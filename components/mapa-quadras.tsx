"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin } from "lucide-react"

// Componentes do mapa serão importados apenas no cliente
export default function MapaQuadras({ quadras }: { quadras: any[] }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Skip on server-side rendering
    if (!mounted) return

    // Clean function to destroy the map instance
    const cleanupMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }

    // Create a new map instance
    const createMap = async () => {
      setIsLoading(true)
      setError(null)
      
      // Clean up any existing map first
      cleanupMap()
      
      try {
        // Dynamically import Leaflet
        const L = await import("leaflet")
        await import("leaflet/dist/leaflet.css")
        
        // Make sure container exists
        if (!mapContainerRef.current) return
        
        // Apply dark mode styles
        if (theme === "dark") {
          const styleEl = document.createElement('style')
          styleEl.innerHTML = `
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
          `
          document.head.appendChild(styleEl)
        }
        
        // Create map instance
        const defaultCenter = [-23.5505, -46.6333]
        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: 13,
          zoomControl: false,
        })
        
        // Store the map instance for later cleanup
        mapInstanceRef.current = map
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)
        
        // Apply dark theme if needed
        if (theme === "dark") {
          mapContainerRef.current.classList.add("dark-map")
        } else {
          mapContainerRef.current.classList.remove("dark-map")
        }
        
        // Add markers for each quadra
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })
        
        // Add markers
        quadras.forEach(quadra => {
          const marker = L.marker([quadra.latitude, quadra.longitude], { icon })
            .addTo(map)
            
          // Create popup content
          const popupContent = document.createElement('div')
          popupContent.className = `p-1 ${theme === "dark" ? "text-white" : "text-black"}`
          popupContent.innerHTML = `
            <div class="mb-2">
              <img 
                src="${quadra.imagem || "/placeholder.svg"}" 
                alt="${quadra.nome}" 
                class="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 class="font-semibold text-base">${quadra.nome}</h3>
              <p class="text-sm opacity-70">${quadra.endereco}</p>
            </div>
            
            <div class="flex items-center text-sm mb-2">
              <span>${quadra.avaliacao} (${quadra.avaliacoes} avaliações)</span>
              <span class="mx-1">•</span>
              <span>${quadra.preco}</span>
            </div>
          `
          
          // Add esportes badges
          const esportesDiv = document.createElement('div')
          esportesDiv.className = 'flex flex-wrap gap-1 mb-2'
          quadra.esportes.forEach((esporte: string) => {
            const badge = document.createElement('span')
            badge.className = 'bg-primary-sportlink/10 text-xs px-2 py-1 rounded-full'
            badge.textContent = esporte
            esportesDiv.appendChild(badge)
          })
          popupContent.appendChild(esportesDiv)
          
          // Add footer
          const footer = document.createElement('div')
          footer.className = 'flex items-center justify-between mt-2'
          footer.innerHTML = `
            <div class="flex items-center text-sm opacity-70">
              <span>${quadra.jogadoresHoje} pessoas hoje</span>
            </div>
            <button class="bg-primary px-3 py-1 text-xs rounded text-white">Ver detalhes</button>
          `
          popupContent.appendChild(footer)
          
          // Bind popup to marker
          marker.bindPopup(popupContent, { 
            minWidth: 280,
            maxWidth: 320
          })
        })
        
        setIsLoading(false)
      } catch (error) {
        console.error("Erro ao carregar o mapa:", error)
        setError("Não foi possível carregar o mapa. Por favor, tente novamente mais tarde.")
        setIsLoading(false)
      }
    }
    
    // Initialize map
    createMap()
    
    // Cleanup on unmount or deps change
    return cleanupMap
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

  if (!mounted || isLoading) {
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-muted rounded-lg">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Erro ao carregar o mapa</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border border-border h-[600px] relative">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  )
}
