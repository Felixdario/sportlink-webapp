"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

interface SelecionarLocalizacaoMapaProps {
  onSelectLocation: (lat: number, lng: number, endereco: string) => void
  initialLocation?: { lat: number; lng: number }
}

export default function SelecionarLocalizacaoMapa({
  onSelectLocation,
  initialLocation = { lat: -23.5505, lng: -46.6333 },
}: SelecionarLocalizacaoMapaProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mapComponent, setMapComponent] = useState<React.ReactNode | null>(null)
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null,
  )
  const [enderecoBusca, setEnderecoBusca] = useState("")
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Função para buscar endereço a partir das coordenadas (geocodificação reversa)
  const buscarEnderecoPorCoordenadas = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      )
      const data = await response.json()
      if (data && data.display_name) {
        setEnderecoSelecionado(data.display_name)
        return data.display_name
      }
      return ""
    } catch (error) {
      console.error("Erro ao buscar endereço:", error)
      return ""
    }
  }

  // Função para buscar coordenadas a partir do endereço (geocodificação)
  const buscarCoordenadasPorEndereco = async () => {
    if (!enderecoBusca.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoBusca)}`,
      )
      const data = await response.json()
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        const newPosition: [number, number] = [Number.parseFloat(lat), Number.parseFloat(lon)]
        setPosition(newPosition)
        setEnderecoSelecionado(display_name)

        // Atualizar o mapa com a nova posição
        loadMap(newPosition)
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleConfirmar = () => {
    if (position) {
      onSelectLocation(position[0], position[1], enderecoSelecionado)
    }
  }

  // Carregar o mapa com a posição especificada
  const loadMap = async (pos: [number, number] | null = position) => {
    try {
      // Importar os módulos do Leaflet apenas no cliente
      const L = await import("leaflet")
      const { MapContainer, TileLayer, Marker, useMapEvents, useMap } = await import("react-leaflet")

      // Importar o CSS do Leaflet
      await import("leaflet/dist/leaflet.css")

      // Corrigir o problema dos ícones do Leaflet
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      // Componente para lidar com cliques no mapa
      function LocationMarker() {
        useMapEvents({
          click(e) {
            const { lat, lng } = e.latlng
            const newPosition: [number, number] = [lat, lng]
            setPosition(newPosition)
            buscarEnderecoPorCoordenadas(lat, lng)
          },
        })

        return pos ? <Marker position={pos} icon={icon} /> : null
      }

      // Componente para atualizar o tema do mapa
      function MapThemeUpdater() {
        const map = useMap()

        useEffect(() => {
          if (map) {
            // Adicionar/remover classe dark no container do mapa
            const container = map.getContainer()
            if (theme === "dark") {
              container.classList.add("dark-map")
            } else {
              container.classList.remove("dark-map")
            }
          }
        }, [map])

        return null
      }

      // Criar o componente do mapa
      setMapComponent(
        <>
          <style jsx global>{`
            .dark-map .leaflet-tile {
              filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
            }
            .dark-map .leaflet-container {
              background: #333;
            }
          `}</style>

          <MapContainer
            center={pos || [initialLocation.lat, initialLocation.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className={theme === "dark" ? "dark-map" : ""}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapThemeUpdater />
            <LocationMarker />
          </MapContainer>
        </>,
      )
    } catch (error) {
      console.error("Erro ao carregar o mapa:", error)
      setMapComponent(
        <div className="flex flex-col items-center justify-center h-full">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Erro ao carregar o mapa</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Não foi possível carregar o mapa. Por favor, tente novamente mais tarde.
          </p>
        </div>,
      )
    }
  }

  // Atualizar endereço quando a posição mudar
  useEffect(() => {
    if (position) {
      buscarEnderecoPorCoordenadas(position[0], position[1])
    }
  }, [position])

  useEffect(() => {
    setMounted(true)

    if (mounted) {
      loadMap()
    }
  }, [mounted, theme])

  if (!mounted || !mapComponent) {
    return (
      <div className="h-full flex items-center justify-center bg-muted rounded-md">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary-sportlink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-medium mb-2">Carregando mapa</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Estamos carregando o mapa para seleção de localização.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar endereço..."
            className="pl-9"
            value={enderecoBusca}
            onChange={(e) => setEnderecoBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarCoordenadasPorEndereco()}
          />
        </div>
        <Button onClick={buscarCoordenadasPorEndereco} disabled={isSearching}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      <div className="flex-1 rounded-md overflow-hidden border border-border relative">{mapComponent}</div>

      {position && (
        <div className="mt-4 space-y-2">
          <div className="text-sm">
            <p className="font-medium">Endereço selecionado:</p>
            <p className="text-muted-foreground">{enderecoSelecionado || "Endereço não encontrado"}</p>
          </div>
          <div className="text-sm">
            <p className="font-medium">Coordenadas:</p>
            <p className="text-muted-foreground">
              Latitude: {position[0].toFixed(6)}, Longitude: {position[1].toFixed(6)}
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
