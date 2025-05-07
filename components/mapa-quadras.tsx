"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin } from "lucide-react"

// Componentes do mapa serão importados apenas no cliente
export default function MapaQuadras({ quadras }: { quadras: any[] }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mapComponent, setMapComponent] = useState<React.ReactNode | null>(null)

  useEffect(() => {
    setMounted(true)

    // Importar dinamicamente os componentes do Leaflet apenas no cliente
    const loadMap = async () => {
      try {
        // Importar os módulos do Leaflet apenas no cliente
        const L = await import("leaflet")
        const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet")

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

        // Definir o centro inicial do mapa (São Paulo)
        const defaultCenter = [-23.5505, -46.6333]

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
              .leaflet-popup-content-wrapper {
                background: ${theme === "dark" ? "#1f1f1f" : "#fff"};
                color: ${theme === "dark" ? "#fff" : "#000"};
              }
              .leaflet-popup-tip {
                background: ${theme === "dark" ? "#1f1f1f" : "#fff"};
              }
            `}</style>

            <MapContainer
              center={defaultCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              className={theme === "dark" ? "dark-map" : ""}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {quadras.map((quadra) => (
                <Marker key={quadra.id} position={[quadra.latitude, quadra.longitude]} icon={icon}>
                  <Popup className="custom-popup" minWidth={280} maxWidth={320}>
                    <div className={`p-1 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      <div className="mb-2">
                        <img
                          src={quadra.imagem || "/placeholder.svg"}
                          alt={quadra.nome}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <h3 className="font-semibold text-base">{quadra.nome}</h3>
                        <p className="text-sm opacity-70">{quadra.endereco}</p>
                      </div>

                      <div className="flex items-center text-sm mb-2">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>
                          {quadra.avaliacao} ({quadra.avaliacoes} avaliações)
                        </span>
                        <span className="mx-1">•</span>
                        <span>{quadra.preco}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {quadra.esportes.map((esporte: string, i: number) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-primary-sportlink/10 text-primary-sportlink border-primary-sportlink/20 text-xs"
                          >
                            {esporte}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-sm opacity-70">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{quadra.jogadoresHoje} pessoas hoje</span>
                        </div>
                        <Button size="sm">Ver detalhes</Button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
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

    if (mounted) {
      loadMap()
    }
  }, [mounted, theme, quadras])

  // Verificar se há quadras para exibir
  if (quadras.length === 0) {
    return (
      <div className="bg-muted rounded-lg overflow-hidden h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Nenhuma quadra encontrada</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Não encontramos quadras com os filtros selecionados. Tente ajustar seus filtros ou buscar em uma área maior.
          </p>
        </div>
      </div>
    )
  }

  if (!mounted || !mapComponent) {
    return (
      <div className="bg-muted rounded-lg overflow-hidden h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary-sportlink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-medium mb-2">Carregando mapa</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Estamos carregando o mapa com as quadras próximas a você.
          </p>
        </div>
      </div>
    )
  }

  return <div className="rounded-lg overflow-hidden border border-border h-[600px] relative">{mapComponent}</div>
}
