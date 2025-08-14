"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createCompeticao } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Trophy, Upload, MapPin, Plus, Minus, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Importações corrigidas do date-fns
import format from "date-fns/format"
import ptBR from "date-fns/locale/pt-BR"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Importar os componentes do Google Maps dinamicamente
// Usando os componentes reais do Google Maps
const GoogleMapaSeletor = dynamic(() => import("@/components/google-mapa-seletor").then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="bg-muted rounded-lg overflow-hidden h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-primary-sportlink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-medium mb-2">Carregando mapa</h3>
        <p className="text-muted-foreground max-w-md mx-auto">Estamos carregando o mapa para seleção de localização.</p>
      </div>
    </div>
  ),
})

// Componente para exibir a localização no mapa
const GoogleMapaExibicao = dynamic(() => import("@/components/google-mapa-exibicao").then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="bg-muted/30 rounded-md overflow-hidden h-[200px] flex items-center justify-center">
      <div className="text-center">
        <div className="h-6 w-6 border-2 border-primary-sportlink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Carregando visualização do mapa...</p>
      </div>
    </div>
  ),
})

export default function CriarCompeticaoPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMapaAberto, setIsMapaAberto] = useState(false)

  // Dados do formulário
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [esporte, setEsporte] = useState("")
  const [categoria, setCategoria] = useState("")
  const [formato, setFormato] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [dataLimiteInscricao, setDataLimiteInscricao] = useState<Date>()
  const [local, setLocal] = useState("")
  const [endereco, setEndereco] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [vagas, setVagas] = useState("16")
  const [minParticipantes, setMinParticipantes] = useState("8")
  const [premio, setPremio] = useState("")
  const [taxaInscricao, setTaxaInscricao] = useState("")
  const [regras, setRegras] = useState<string[]>([""])
  const [requisitos, setRequisitos] = useState<string[]>([""])
  const [isPublica, setIsPublica] = useState(true)
  const [inscricoesAutomaticas, setInscricoesAutomaticas] = useState(true)
  const [permitirEquipes, setPermitirEquipes] = useState(false)
  const [tamanhoEquipe, setTamanhoEquipe] = useState("5")

  useEffect(() => {
    setMounted(true)
  }, [])

  const adicionarRegra = () => {
    setRegras([...regras, ""])
  }

  const removerRegra = (index: number) => {
    const novasRegras = [...regras]
    novasRegras.splice(index, 1)
    setRegras(novasRegras)
  }

  const atualizarRegra = (index: number, valor: string) => {
    const novasRegras = [...regras]
    novasRegras[index] = valor
    setRegras(novasRegras)
  }

  const adicionarRequisito = () => {
    setRequisitos([...requisitos, ""])
  }

  const removerRequisito = (index: number) => {
    const novosRequisitos = [...requisitos]
    novosRequisitos.splice(index, 1)
    setRequisitos(novosRequisitos)
  }

  const atualizarRequisito = (index: number, valor: string) => {
    const novosRequisitos = [...requisitos]
    novosRequisitos[index] = valor
    setRequisitos(novosRequisitos)
  }

  const handleSelecionarLocalizacao = (lat: number, lng: number, endereco: string) => {
    // Registrar que a localização foi selecionada
    console.log(`Localização selecionada: ${endereco} (${lat}, ${lng})`);
    
    // Atualizar os estados com os dados da localização
    setLatitude(lat);
    setLongitude(lng);
    if (endereco) setEndereco(endereco);
    
    // Aguardar o próximo ciclo de renderização para fechar o diálogo
    requestAnimationFrame(() => {
      // Fechar o diálogo
      setIsMapaAberto(false);
      console.log("Diálogo fechado após seleção de localização");
      
      // Aguardar um momento extra para garantir que os estados estejam atualizados
      setTimeout(() => {
        console.log("Estados atualizados após seleção:", {
          latitude: lat,
          longitude: lng,
          endereco: endereco
        });
      }, 300);
    });
  }

  const validarFormulario = () => {
    if (!nome.trim()) {
      setError("O nome da competição é obrigatório")
      return false
    }

    if (!esporte) {
      setError("Selecione um esporte para a competição")
      return false
    }

    if (!categoria) {
      setError("Selecione uma categoria para a competição")
      return false
    }

    if (!formato) {
      setError("Selecione o formato da competição")
      return false
    }

    if (!dataInicio) {
      setError("A data de início é obrigatória")
      return false
    }

    if (!dataLimiteInscricao) {
      setError("A data limite para inscrições é obrigatória")
      return false
    }

    if (dataLimiteInscricao >= dataInicio) {
      setError("A data limite para inscrições deve ser anterior à data de início")
      return false
    }

    if (!local.trim()) {
      setError("O local da competição é obrigatório")
      return false
    }

    if (!endereco.trim()) {
      setError("O endereço do local é obrigatório")
      return false
    }

    if (!vagas || Number.parseInt(vagas) <= 0) {
      setError("O número de vagas deve ser maior que zero")
      return false
    }

    if (!minParticipantes || Number.parseInt(minParticipantes) <= 0) {
      setError("O número mínimo de participantes deve ser maior que zero")
      return false
    }

    if (Number.parseInt(minParticipantes) > Number.parseInt(vagas)) {
      setError("O número mínimo de participantes não pode ser maior que o número de vagas")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validarFormulario()) {
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para API
      const competicaoData = {
        nome,
        descricao,
        esporte,
        categoria,
        formato,
        dataInicio: dataInicio?.toISOString() || "",
        dataFim: dataFim?.toISOString(),
        dataLimiteInscricao: dataLimiteInscricao?.toISOString() || "",
        local,
        endereco,
        latitude,
        longitude,
        vagas: Number.parseInt(vagas),
        minParticipantes: Number.parseInt(minParticipantes),
        premio,
        taxaInscricao,
        regras: regras.filter((r) => r.trim()),
        requisitos: requisitos.filter((r) => r.trim()),
        isPublica,
        inscricoesAutomaticas,
        permitirEquipes,
        tamanhoEquipe: permitirEquipes ? Number.parseInt(tamanhoEquipe) : null,
        organizador_id: 1 // ID fixo para testes, em produção viria de um contexto de autenticação
      };

      // Para debug: mostra os dados que serão enviados
      console.log("Enviando dados da competição:", competicaoData);

      // Tentar criar a competição na API
      try {
        const responseData = await createCompeticao(competicaoData);
        console.log("Competição criada com sucesso:", responseData);
        
        // Identificar o ID da competição criada
        const competicaoId = responseData.id || Date.now();
        
        // Também salvar no localStorage para compatibilidade com o mock atual
        const novaCompeticao = {
          ...competicaoData,
          id: competicaoId,
          participantes: 0,
          status: "inscricoes",
          organizador: "Usuário Atual",
          criadoEm: new Date().toISOString(),
        };
        
        const competicoes = JSON.parse(localStorage.getItem("competicoes") || "[]");
        competicoes.push(novaCompeticao);
        localStorage.setItem("competicoes", JSON.stringify(competicoes));
        
        // Redirecionar para a página da competição criada com parâmetro de sucesso
        router.push(`/dashboard/competicoes/${competicaoId}?recemCriada=true`);
      } catch (apiError: any) {
        console.error("Erro na API:", apiError);
        
        // Fallback para mock local se a API falhar
        console.log("Usando fallback local...");
        
        const novaCompeticao = {
          ...competicaoData,
          id: Date.now(),
          participantes: 0,
          status: "inscricoes",
          organizador: "Usuário Atual",
          criadoEm: new Date().toISOString(),
        };
        
        const competicoes = JSON.parse(localStorage.getItem("competicoes") || "[]");
        competicoes.push(novaCompeticao);
        localStorage.setItem("competicoes", JSON.stringify(competicoes));
        
        
        // Esperar um pouco para o usuário ver a mensagem
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Redirecionar para a página da competição criada com parâmetro de sucesso
        router.push(`/dashboard/competicoes/${novaCompeticao.id}?recemCriada=true&localMode=true`);
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a competição. Tente novamente.")
      console.error("Erro ao criar competição:", err);
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Trophy className="h-8 w-8 text-primary-sportlink mr-3" />
        <h1 className="text-3xl font-bold">Criar nova competição</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações básicas</CardTitle>
                <CardDescription>Defina os detalhes principais da sua competição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da competição *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Torneio de Futebol Amador"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva os detalhes da sua competição"
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="esporte">Esporte *</Label>
                    <Select value={esporte} onValueChange={setEsporte} disabled={isLoading}>
                      <SelectTrigger id="esporte">
                        <SelectValue placeholder="Selecione um esporte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="futebol">Futebol</SelectItem>
                        <SelectItem value="futsal">Futsal</SelectItem>
                        <SelectItem value="basquete">Basquete</SelectItem>
                        <SelectItem value="volei">Vôlei</SelectItem>
                        <SelectItem value="volei-praia">Vôlei de Praia</SelectItem>
                        <SelectItem value="tenis">Tênis</SelectItem>
                        <SelectItem value="natacao">Natação</SelectItem>
                        <SelectItem value="corrida">Corrida</SelectItem>
                        <SelectItem value="ciclismo">Ciclismo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={categoria} onValueChange={setCategoria} disabled={isLoading}>
                      <SelectTrigger id="categoria">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amador">Amador</SelectItem>
                        <SelectItem value="semi-profissional">Semi-profissional</SelectItem>
                        <SelectItem value="profissional">Profissional</SelectItem>
                        <SelectItem value="juvenil">Juvenil</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formato">Formato *</Label>
                    <Select value={formato} onValueChange={setFormato} disabled={isLoading}>
                      <SelectTrigger id="formato">
                        <SelectValue placeholder="Formato da competição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eliminacao-simples">Eliminação Simples</SelectItem>
                        <SelectItem value="eliminacao-dupla">Eliminação Dupla</SelectItem>
                        <SelectItem value="pontos-corridos">Pontos Corridos</SelectItem>
                        <SelectItem value="grupos-eliminatorias">Grupos + Eliminatórias</SelectItem>
                        <SelectItem value="suico">Sistema Suíço</SelectItem>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vagas">Número de vagas *</Label>
                    <Input
                      id="vagas"
                      type="number"
                      min="2"
                      value={vagas}
                      onChange={(e) => setVagas(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minParticipantes">Mínimo de participantes *</Label>
                    <Input
                      id="minParticipantes"
                      type="number"
                      min="2"
                      value={minParticipantes}
                      onChange={(e) => setMinParticipantes(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="permitirEquipes"
                      checked={permitirEquipes}
                      onCheckedChange={setPermitirEquipes}
                      disabled={isLoading}
                    />
                    <Label htmlFor="permitirEquipes">Permitir equipes</Label>
                  </div>

                  {permitirEquipes && (
                    <div className="space-y-2">
                      <Label htmlFor="tamanhoEquipe">Tamanho da equipe</Label>
                      <Input
                        id="tamanhoEquipe"
                        type="number"
                        min="2"
                        max="11"
                        value={tamanhoEquipe}
                        onChange={(e) => setTamanhoEquipe(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Data de início *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataInicio && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataInicio ? format(dataInicio, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de término</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataFim && "text-muted-foreground",
                          )}
                          disabled={isLoading || !dataInicio}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataFim ? format(dataFim, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataFim}
                          onSelect={setDataFim}
                          disabled={(date) => (dataInicio ? date < dataInicio : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Limite para inscrições *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataLimiteInscricao && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataLimiteInscricao
                            ? format(dataLimiteInscricao, "PPP", { locale: ptBR })
                            : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataLimiteInscricao}
                          onSelect={setDataLimiteInscricao}
                          disabled={(date) => (dataInicio ? date >= dataInicio : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local</CardTitle>
                <CardDescription>Informe onde a competição será realizada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Nome do local *</Label>
                  <Input
                    id="local"
                    placeholder="Ex: Quadra Poliesportiva Central"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço completo *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="endereco"
                      placeholder="Ex: Av. Principal, 123 - Centro"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={async () => {
                        if (endereco) {
                          try {
                            // Salvar o erro atual e mostrar mensagem de carregamento temporariamente
                            setIsLoading(true);
                            setError("Buscando localização...");
                            
                            console.log("Buscando endereço:", endereco);
                            
                            // Buscar coordenadas a partir do endereço
                            const response = await fetch(
                              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`
                            );
                            const data = await response.json();
                            console.log("Resposta da busca:", data);
                            
                            if (data && data.length > 0) {
                              const { lat, lon, display_name } = data[0];
                              setLatitude(Number.parseFloat(lat));
                              setLongitude(Number.parseFloat(lon));
                              setEndereco(display_name);
                              setError(null);
                              console.log(`Localização encontrada: ${display_name}`);
                            } else {
                              setError("Endereço não encontrado. Tente ser mais específico.");
                            }
                          } catch (error) {
                            console.error("Erro ao buscar localização:", error);
                            setError("Erro ao buscar localização. Tente novamente.");
                          } finally {
                            setIsLoading(false);
                          }
                        } else {
                          setError("Digite um endereço para buscar a localização.");
                        }
                      }}
                      disabled={isLoading || !endereco}
                    >
                      <MapPin className="h-4 w-4 mr-2" /> {isLoading ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Digite o endereço completo para buscar a localização ou selecione manualmente no mapa</p>
                </div>

                {/* Botão para abrir o seletor de mapa */}
                <div 
                  className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    console.log("Abrindo seletor de mapa do Google");
                    setIsMapaAberto(true);
                  }}
                >
                  <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {latitude && longitude
                      ? "Localização selecionada. Clique para alterar."
                      : "Selecione a localização no mapa"}
                  </p>
                  <Button variant="outline" size="sm" type="button" disabled={isLoading}>
                    {latitude && longitude ? "Alterar localização" : "Abrir mapa"}
                  </Button>
                </div>
                
                {/* Diálogo para o seletor de mapa do Google */}
                <Dialog 
                  open={isMapaAberto} 
                  onOpenChange={(open) => {
                    console.log("Dialog onOpenChange:", open);
                    if (open) {
                      setIsMapaAberto(true);
                      console.log("Diálogo do mapa aberto");
                    } else {
                      // Fechamento controlado
                      setIsMapaAberto(false);
                      console.log("Diálogo do mapa fechado pelo usuário");
                    }
                  }}
                >
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Selecionar localização</DialogTitle>
                      <DialogDescription>
                        Clique no mapa para selecionar a localização exata da competição
                      </DialogDescription>
                    </DialogHeader>
                    <div className="h-[500px] w-full">
                      {isMapaAberto && (
                        <GoogleMapaSeletor
                          onSelectLocation={handleSelecionarLocalizacao}
                          initialLocation={
                            latitude && longitude 
                              ? { lat: latitude, lng: longitude } 
                              : { lat: -23.5505, lng: -46.6333 }
                          }
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {latitude && longitude && endereco && (
                  <div className="mt-4 space-y-2">
                    <Label>Visualização da localização</Label>
                    <GoogleMapaExibicao 
                      latitude={latitude} 
                      longitude={longitude} 
                      endereco={endereco} 
                      altura="200px"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      <p>Localização: {endereco}</p>
                      <p>Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regras e requisitos</CardTitle>
                <CardDescription>Defina as regras e requisitos para participação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premio">Premiação</Label>
                  <Input
                    id="premio"
                    placeholder="Ex: Troféu + Medalhas + R$ 1.000,00"
                    value={premio}
                    onChange={(e) => setPremio(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxa">Taxa de inscrição</Label>
                  <Input
                    id="taxa"
                    placeholder="Ex: R$ 50,00 por participante"
                    value={taxaInscricao}
                    onChange={(e) => setTaxaInscricao(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Regras da competição</Label>
                    <Button type="button" variant="outline" size="sm" onClick={adicionarRegra} disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar regra
                    </Button>
                  </div>

                  {regras.map((regra, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Regra ${index + 1}`}
                        value={regra}
                        onChange={(e) => atualizarRegra(index, e.target.value)}
                        disabled={isLoading}
                      />
                      {regras.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerRegra(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Requisitos para participação</Label>
                    <Button type="button" variant="outline" size="sm" onClick={adicionarRequisito} disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar requisito
                    </Button>
                  </div>

                  {requisitos.map((requisito, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Requisito ${index + 1}`}
                        value={requisito}
                        onChange={(e) => atualizarRequisito(index, e.target.value)}
                        disabled={isLoading}
                      />
                      {requisitos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerRequisito(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Defina as configurações da competição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publica">Competição pública</Label>
                    <p className="text-sm text-muted-foreground">Qualquer pessoa pode visualizar esta competição</p>
                  </div>
                  <Switch id="publica" checked={isPublica} onCheckedChange={setIsPublica} disabled={isLoading} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inscricoes">Aprovar inscrições automaticamente</Label>
                    <p className="text-sm text-muted-foreground">Inscrições serão aprovadas sem revisão</p>
                  </div>
                  <Switch
                    id="inscricoes"
                    checked={inscricoesAutomaticas}
                    onCheckedChange={setInscricoesAutomaticas}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publicar</CardTitle>
                <CardDescription>Revise e publique sua competição</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ao publicar, sua competição ficará visível para todos os usuários e as inscrições serão abertas
                  conforme suas configurações.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando competição...
                    </>
                  ) : (
                    "Publicar competição"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/dashboard/competicoes")}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
