"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"

// Chave da API do Google Maps
// Esta é uma chave temporária para desenvolvimento. Em produção, use variáveis de ambiente.
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

// Estilo de centro para o contêiner do mapa
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
  borderRadius: "0.375rem",
}

// Opções para o mapa
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
}

// Interface para as propriedades do componente
interface GoogleMapaSeletorProps {
  onSelectLocation: (lat: number, lng: number, endereco: string) => void
  initialLocation?: { lat: number; lng: number }
}

export default function GoogleMapaSeletor({
  onSelectLocation,
  initialLocation = { lat: -23.5505, lng: -46.6333 } // São Paulo como padrão
}: GoogleMapaSeletorProps) {
  // Estado para armazenar a posição selecionada
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(initialLocation)
  const [endereco, setEndereco] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  
  // Referência para o mapa
  const mapRef = useRef<google.maps.Map | null>(null)
  const geocoderRef = useRef<google.maps.Geocoder | null>(null)
  
  // Carregamento da API do Google Maps
  const { isLoaded: apiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  })

  // Inicializar o geocoder quando a API estiver carregada
  useEffect(() => {
    if (apiLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder()
    }
  }, [apiLoaded])

  // Callback quando o mapa é carregado
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMapLoaded(true)
    console.log("Mapa carregado com sucesso")
    
    // Se temos uma posição inicial, buscar o endereço
    if (initialLocation && geocoderRef.current) {
      console.log("Buscando endereço inicial:", initialLocation)
      geocoderRef.current.geocode({ 
        location: initialLocation 
      }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          console.log("Endereço encontrado:", results[0].formatted_address)
          setEndereco(results[0].formatted_address)
        } else {
          console.error("Erro ao buscar endereço inicial:", status)
        }
      })
    }
  }, [initialLocation])
  
  // Função para buscar o endereço a partir de coordenadas
  const buscarEndereco = useCallback((lat: number, lng: number) => {
    if (!geocoderRef.current) return
    
    setIsLoading(true)
    
    geocoderRef.current.geocode({ 
      location: { lat, lng } 
    }, (results, status) => {
      setIsLoading(false)
      
      if (status === "OK" && results && results[0]) {
        setEndereco(results[0].formatted_address)
      } else {
        console.error("Erro ao buscar endereço:", status)
        setEndereco("Endereço não encontrado")
      }
    })
  }, [])

  // Manipulador de clique no mapa
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) {
      console.error("Clique no mapa não gerou coordenadas válidas")
      return
    }
    
    const lat = event.latLng.lat()
    const lng = event.latLng.lng()
    
    console.log(`Clique no mapa: lat=${lat}, lng=${lng}`)
    setPosition({ lat, lng })
    buscarEndereco(lat, lng)
  }, [buscarEndereco])
  
  // Função para confirmar a seleção
  const handleConfirmar = useCallback(() => {
    if (position) {
      onSelectLocation(position.lat, position.lng, endereco)
    }
  }, [position, endereco, onSelectLocation])

  // Renderizar mensagem de erro se a API não carregou
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 rounded-md bg-muted/20">
        <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Erro ao carregar o mapa</h3>
        <p className="text-center text-muted-foreground mb-4">
          Não foi possível carregar o serviço de mapas. Verifique sua conexão com a internet ou tente novamente mais tarde.
        </p>
        <p className="text-xs text-muted-foreground">Erro: {loadError.message}</p>
      </div>
    )
  }

  // Renderizar loader enquanto a API carrega
  if (!apiLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="h-8 w-8 border-4 border-primary-sportlink border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Carregando serviço de mapas...</p>
      </div>
    )
  }

  // Renderizar o mapa
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 rounded-md overflow-hidden border border-border relative mb-4" 
           style={{ minHeight: "400px" }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={position || initialLocation}
          zoom={13}
          onClick={handleMapClick}
          onLoad={onMapLoad}
          options={mapOptions}
        >
          {position && <Marker position={position} />}
        </GoogleMap>
      </div>
      
      {position && (
        <div className="space-y-4">
          <div className="text-sm">
            <p className="font-medium">Endereço selecionado:</p>
            <div className="flex items-center gap-2 mt-1">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
              <p className="text-muted-foreground">{endereco || "Buscando endereço..."}</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium">Coordenadas:</p>
            <p className="text-muted-foreground mt-1">
              Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}
            </p>
          </div>
          
          <Button 
            onClick={handleConfirmar} 
            className="w-full"
            disabled={!position || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Confirmar localização"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

// Componente de fallback para modo de desenvolvimento sem API key
export function GoogleMapaSeletorFallback({
  onSelectLocation,
  initialLocation = { lat: -23.5505, lng: -46.6333 }
}: GoogleMapaSeletorProps) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(initialLocation)
  
  const handleConfirmar = useCallback(() => {
    if (position) {
      onSelectLocation(position.lat, position.lng, "Endereço simulado para desenvolvimento")
    }
  }, [position, onSelectLocation])
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 rounded-md overflow-hidden border border-border bg-muted/20 p-4 relative mb-4" 
           style={{ minHeight: "400px" }}>
        <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-6">
          <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Modo de desenvolvimento</h3>
          <p className="text-muted-foreground mb-4">
            Este é um mapa simulado para desenvolvimento. Para usar o mapa real, configure uma chave de API do Google Maps.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              // Simular seleção de um local aleatório próximo
              const lat = initialLocation.lat + (Math.random() - 0.5) * 0.01
              const lng = initialLocation.lng + (Math.random() - 0.5) * 0.01
              setPosition({ lat, lng })
            }}
          >
            Simular seleção de localização
          </Button>
        </div>
      </div>
      
      {position && (
        <div className="space-y-4">
          <div className="text-sm">
            <p className="font-medium">Endereço simulado:</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground">Rua Simulada, 123 - Desenvolvimento, Cidade Teste</p>
            </div>
          </div>
          
          <div className="text-sm">
            <p className="font-medium">Coordenadas:</p>
            <p className="text-muted-foreground mt-1">
              Latitude: {position.lat.toFixed(6)}, Longitude: {position.lng.toFixed(6)}
            </p>
          </div>
          
          <Button onClick={handleConfirmar} className="w-full">
            Confirmar localização
          </Button>
        </div>
      )}
    </div>
  )
}
