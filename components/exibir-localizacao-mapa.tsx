"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { MapPin } from "lucide-react"
import Script from "next/script"

interface ExibirLocalizacaoMapaProps {
  latitude: number | null
  longitude: number | null
  endereco: string
  altura?: string
}

export default function ExibirLocalizacaoMapa({
  latitude,
  longitude,
  endereco,
  altura = "300px"
}: ExibirLocalizacaoMapaProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const mapInitializedRef = useRef(false)

  // Função para limpar mapa existente
  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove()
      } catch (e) {
        console.error("Erro ao remover mapa:", e)
      } finally {
        mapInstanceRef.current = null
        mapInitializedRef.current = false
      }
    }
  }

  // Carregar scripts do Leaflet manualmente
  useEffect(() => {
    if (mounted && !mapLoaded) {
      // Verificar se o Leaflet já está carregado
      if (window.L) {
        setMapLoaded(true)
        return
      }

      // Criar e inserir o CSS do Leaflet
      const linkEl = document.createElement('link')
      linkEl.rel = 'stylesheet'
      linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      linkEl.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      linkEl.crossOrigin = ''
      document.head.appendChild(linkEl)

      // Criar e inserir o script do Leaflet
      const scriptEl = document.createElement('script')
      scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      scriptEl.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
      scriptEl.crossOrigin = ''
      scriptEl.onload = () => {
        console.log("Leaflet carregado com sucesso")
        setMapLoaded(true)
      }
      scriptEl.onerror = () => {
        console.error("Erro ao carregar Leaflet")
        setError("Erro ao carregar biblioteca de mapas")
        setIsLoading(false)
      }
      document.body.appendChild(scriptEl)

      return () => {
        document.head.removeChild(linkEl)
        document.body.removeChild(scriptEl)
      }
    }
  }, [mounted, mapLoaded])

  // Criar ou atualizar o mapa
  useEffect(() => {
    if (!mounted || !mapLoaded) return

    console.log("Tentando criar/atualizar mapa", { 
      latitude, 
      longitude, 
      hasContainer: !!mapContainerRef.current,
      isInitialized: mapInitializedRef.current
    })
    
    // Aguardar um momento para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      setIsLoading(true)
      setError(null)

      // Limpar mapa anterior para evitar o erro "Map container is already initialized"
      if (mapInitializedRef.current) {
        cleanupMap()
      }
      
      // Se não temos coordenadas ou container, não prosseguir
      if (!latitude || !longitude || !mapContainerRef.current) {
        setIsLoading(false)
        return
      }

      try {
        console.log("Criando mapa com coordenadas:", latitude, longitude)
        
        // Verificar se o Leaflet está disponível
        if (!window.L) {
          console.error("Leaflet não está disponível")
          setError("Biblioteca de mapas não carregada corretamente")
          setIsLoading(false)
          return
        }
        
        // Acessar o objeto L (Leaflet) global
        const L = window.L
        
        // Usar um ID único para o container para evitar conflitos
        const uniqueId = `map-container-view-${Date.now()}`
        mapContainerRef.current.id = uniqueId

        // Criar o mapa no container referenciado
        const map = L.map(mapContainerRef.current, {
          center: [latitude, longitude],
          zoom: 15,
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false
        })
        
        // Guardar referência para limpeza posterior
        mapInstanceRef.current = map
        mapInitializedRef.current = true
        
        // Adicionar a camada do mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)
        
        // Configurar tema escuro se necessário
        if (theme === "dark") {
          mapContainerRef.current.classList.add("dark-map")
        } else {
          mapContainerRef.current.classList.remove("dark-map")
        }
        
        // Adicionar marcador
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
        
        L.marker([latitude, longitude], { icon }).addTo(map)
        
        // Adicionar um tratador de evento para invalidação do tamanho
        // É necessário um tempo maior para garantir que o mapa seja renderizado corretamente
        setTimeout(() => {
          if (map && !map._container._leaflet_id) {
            console.log("Invalidando tamanho do mapa")
            map.invalidateSize(true)
          }
        }, 300)
        
        console.log("Mapa criado com sucesso")
        setIsLoading(false)
      } catch (err) {
        console.error("Erro ao carregar mapa:", err)
        setError("Não foi possível carregar o mapa")
        setIsLoading(false)
      }
    }, 200) // Aguardar 200ms para garantir que o DOM esteja pronto
    
    // Limpar o mapa quando o componente for desmontado ou quando as dependências mudarem
    return () => {
      clearTimeout(timer)
      cleanupMap()
    }
  }, [latitude, longitude, mounted, theme, mapLoaded])

  // Efeito para setar o estado montado e estilizar o mapa no tema escuro
  useEffect(() => {
    setMounted(true)
    
    // Inserir estilo global para o mapa no tema escuro
    const styleEl = document.createElement('style')
    styleEl.innerHTML = `
      .dark-map .leaflet-tile {
        filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
      }
      .dark-map .leaflet-container {
        background: #333;
      }
    `
    document.head.appendChild(styleEl)
    
    return () => {
      document.head.removeChild(styleEl)
      cleanupMap()
    }
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30 rounded-md" style={{ height: altura }}>
        <div className="text-center">
          <div className="h-6 w-6 border-2 border-primary-sportlink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    )
  }
  
  if (error || !latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-md border border-border" style={{ height: altura }}>
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {error || "Selecione uma localização no mapa para visualizar"}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md overflow-hidden border border-border relative" style={{ height: altura }}>
      <div ref={mapContainerRef} className="h-full w-full" id={`map-container-${latitude}-${longitude}`} />
    </div>
  )
}

// Adiciona a declaração global para o tipo Leaflet
declare global {
  interface Window {
    L: any;
  }
}
