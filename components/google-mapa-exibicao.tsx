"use client"

import React, { useState, useCallback, useRef } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import { MapPin, Loader2 } from "lucide-react"

// Chave da API do Google Maps
// Esta é uma chave temporária para desenvolvimento. Em produção, use variáveis de ambiente.
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

interface GoogleMapaExibicaoProps {
  latitude: number | null
  longitude: number | null
  endereco: string
  altura?: string
}

// Estilo de centro para o contêiner do mapa
const getMapContainerStyle = (altura: string) => ({
  width: "100%",
  height: altura,
  borderRadius: "0.375rem",
})

// Opções para o mapa
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  draggable: false,
}

export default function GoogleMapaExibicao({
  latitude,
  longitude,
  endereco,
  altura = "300px"
}: GoogleMapaExibicaoProps) {
  // Estado para controlar o carregamento
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)
  
  // Carregar a API do Google Maps
  const { isLoaded: apiLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  })
  
  // Referência para o mapa
  const mapRef = useRef<google.maps.Map | null>(null)
  
  // Callback para quando o mapa é carregado
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMapLoaded(true)
    console.log("Mapa de exibição carregado com sucesso")
    console.log(`Exibindo localização: lat=${latitude}, lng=${longitude}, endereco=${endereco}`)
  }, [latitude, longitude, endereco])
  
  // Se não temos coordenadas válidas, exibir um placeholder
  if (!latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-border" 
           style={{ height: altura }}>
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Localização não disponível
        </p>
      </div>
    )
  }
  
  // Se houve erro ao carregar a API
  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-border" 
           style={{ height: altura }}>
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar o mapa
        </p>
      </div>
    )
  }
  
  // Se a API ainda está carregando
  if (!apiLoaded) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-border bg-muted/30" 
           style={{ height: altura }}>
        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">
          Carregando mapa...
        </p>
      </div>
    )
  }
  
  // Renderizar o mapa com a localização
  return (
    <div className="rounded-md overflow-hidden border border-border" style={{ height: altura }}>
      <GoogleMap
        mapContainerStyle={getMapContainerStyle(altura)}
        center={{ lat: latitude, lng: longitude }}
        zoom={15}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        <Marker position={{ lat: latitude, lng: longitude }} />
      </GoogleMap>
    </div>
  )
}

// Versão de fallback para desenvolvimento sem API key
export function GoogleMapaExibicaoFallback({
  latitude,
  longitude,
  endereco,
  altura = "300px"
}: GoogleMapaExibicaoProps) {
  if (!latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-border" 
           style={{ height: altura }}>
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Localização não disponível
        </p>
      </div>
    )
  }
  
  return (
    <div className="rounded-md overflow-hidden border border-border relative" style={{ height: altura }}>
      <div className="absolute inset-0 bg-muted/30 flex items-center justify-center flex-col">
        <MapPin className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-center text-muted-foreground max-w-xs px-4">
          Visualização de mapa simulada em {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      </div>
    </div>
  )
}
