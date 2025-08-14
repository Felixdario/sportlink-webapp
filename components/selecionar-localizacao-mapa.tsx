"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import Script from "next/script"

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [position, setPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null,
  )
  const [enderecoBusca, setEnderecoBusca] = useState("")
  const [enderecoSelecionado, setEnderecoSelecionado] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  
  // Referências para o mapa e o container
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const mapInitializedRef = useRef(false)

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
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(newPosition, 15)
          
          // Atualizar a posição do marcador
          if (markerRef.current) {
            markerRef.current.setLatLng(newPosition)
          } else {
            // Criar marcador se não existir
            const L = window.L
            const icon = L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
              iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
              shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
            
            markerRef.current = L.marker(newPosition, { icon }).addTo(mapInstanceRef.current)
          }
        }
      } else {
        setError("Endereço não encontrado. Tente ser mais específico.")
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error)
      setError("Erro ao buscar coordenadas. Tente novamente.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleConfirmar = () => {
    if (position) {
      onSelectLocation(position[0], position[1], enderecoSelecionado)
    }
  }

  // Função para limpar mapa existente
  const cleanupMap = () => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove()
      } catch (e) {
        console.error("Erro ao remover mapa:", e)
      } finally {
        mapInstanceRef.current = null
        markerRef.current = null
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
    if (!mounted) return
    
    // Tentar inicializar o mapa quando o componente estiver montado
    let initializeAttempts = 0;
    const maxAttempts = 5;
    
    // Função para tentar inicializar o mapa
    const tryInitializeMap = () => {
      console.log(`Tentativa ${initializeAttempts + 1} de inicializar o mapa`);
      
      // Verificar se já tentamos muitas vezes
      if (initializeAttempts >= maxAttempts) {
        console.error("Número máximo de tentativas de inicialização do mapa atingido");
        setError("Não foi possível carregar o mapa após várias tentativas");
        setIsLoading(false);
        return;
      }
      
      // Verificar se temos o contêiner e o Leaflet carregado
      if (!mapContainerRef.current || !window.L || !mapLoaded) {
        // Se não tivermos, tentar novamente após um intervalo
        initializeAttempts++;
        setTimeout(tryInitializeMap, 500);
        return;
      }
      
      console.log("Iniciando criação do mapa de seleção", { 
        position, 
        initialLocation,
        hasContainer: !!mapContainerRef.current,
        isInitialized: mapInitializedRef.current,
        mapLoadedStatus: mapLoaded,
        leafletAvailable: !!window.L
      });
      
      setIsLoading(true);
      setError(null);
      
      // Limpar mapa anterior se existir
      if (mapInstanceRef.current) {
        console.log("Limpando mapa existente");
        cleanupMap();
      }
      
      try {
        // Acessar o objeto Leaflet
        const L = window.L;
        
        // Posição inicial
        const initialPos = position || [initialLocation.lat, initialLocation.lng];
        console.log("Criando mapa com posição inicial:", initialPos);
        
        // Criar elemento contêiner se não existir
        if (!document.getElementById("mapa-selecao-localizacao")) {
          console.error("Criando contêiner manualmente");
          const containerDiv = document.createElement("div");
          containerDiv.id = "mapa-selecao-localizacao";
          containerDiv.style.width = "100%";
          containerDiv.style.height = "100%";
          containerDiv.style.minHeight = "400px";
          
          // Limpar e adicionar ao contêiner pai
          if (mapContainerRef.current) {
            mapContainerRef.current.innerHTML = "";
            mapContainerRef.current.appendChild(containerDiv);
          }
        }
        
        // Obter o elemento diretamente do DOM para garantir
        const mapElement = document.getElementById("mapa-selecao-localizacao");
        if (!mapElement) {
          throw new Error("Elemento do mapa não encontrado, mesmo após tentativa de criação");
        }
        
        // Criar o mapa
        const map = L.map(mapElement, {
          center: initialPos,
          zoom: 13,
        });
        
        // Guardar referência
        mapInstanceRef.current = map;
        mapInitializedRef.current = true;
        
        // Adicionar camada do mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Aplicar tema escuro se necessário
        if (theme === "dark" && mapElement) {
          mapElement.classList.add("dark-map");
        }
        
        // Criar ícone do marcador
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Adicionar marcador se tivermos uma posição
        if (position) {
          markerRef.current = L.marker(position, { icon }).addTo(map);
        }
        
        // Evento de clique no mapa
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          const newPosition: [number, number] = [lat, lng];
          setPosition(newPosition);
          
          // Atualizar ou criar marcador
          if (markerRef.current) {
            markerRef.current.setLatLng(newPosition);
          } else {
            markerRef.current = L.marker(newPosition, { icon }).addTo(map);
          }
          
          // Buscar endereço para as coordenadas
          buscarEnderecoPorCoordenadas(lat, lng);
        });
        
        // Invalidar tamanho para garantir renderização correta
        // Sequência de invalidações para garantir que funcione em diferentes cenários
        setTimeout(() => map.invalidateSize(true), 100);
        setTimeout(() => map.invalidateSize(true), 300);
        setTimeout(() => map.invalidateSize(true), 500);
        
        console.log("Mapa de seleção criado com sucesso");
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao criar mapa de seleção:", err);
        setError("Erro ao inicializar o mapa. Tente novamente.");
        setIsLoading(false);
        
        // Tentar novamente após um erro, se não excedemos o número máximo de tentativas
        initializeAttempts++;
        setTimeout(tryInitializeMap, 800);
      }
    };
    
    // Iniciar o processo de inicialização do mapa
    tryInitializeMap();
    
    // Limpar na desmontagem
    return () => {
      console.log("Desmontando componente de seleção de mapa");
      cleanupMap();
    };
  }, [mounted, mapLoaded, theme, initialLocation]);

  // Atualizar endereço quando a posição mudar
  useEffect(() => {
    if (position && mounted && mapLoaded) {
      buscarEnderecoPorCoordenadas(position[0], position[1])
    }
  }, [position, mounted, mapLoaded])

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
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-md border border-border">
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {error}
        </p>
        <Button onClick={() => setError(null)} className="mt-4" variant="outline">
          Tentar novamente
        </Button>
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
        <Button onClick={buscarCoordenadasPorEndereco} disabled={isSearching || !enderecoBusca.trim()}>
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      <div 
        className="flex-1 rounded-md overflow-hidden border border-border relative"
        style={{ minHeight: "400px" }} // Garante uma altura mínima
      >
        <div 
          ref={mapContainerRef} 
          className="h-full w-full" 
          id="mapa-selecao-localizacao" 
          style={{ minHeight: "400px" }} // Garante uma altura mínima
        />
      </div>

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
