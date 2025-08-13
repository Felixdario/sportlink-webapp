"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Trophy,
  Clock,
  Plus,
  Search,
  Filter,
  Star,
  ChevronRight,
  Award,
  Flag,
  Play,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Competicao {
  id: number
  nome: string
  descricao: string
  esporte: string
  categoria: string
  formato: string
  dataInicio: string
  dataFim?: string
  dataLimiteInscricao: string
  local: string
  endereco: string
  vagas: number
  minParticipantes: number
  participantes: number
  premio: string
  taxaInscricao: string
  regras: string[]
  requisitos: string[]
  status: "inscricoes" | "andamento" | "finalizado" | "cancelado"
  organizador: string
  permitirEquipes: boolean
  tamanhoEquipe?: number
  criadoEm: string
  imagem?: string
}

const competicoesExemplo: Competicao[] = [
  {
    id: 1,
    nome: "Torneio de Futebol Society - Copa Verão 2025",
    descricao:
      "Participe do maior torneio de futebol society da região! Competição emocionante com times de toda a cidade.",
    esporte: "Futebol",
    categoria: "Amador",
    formato: "Eliminatória",
    dataInicio: "2025-02-15T09:00:00",
    dataFim: "2025-02-16T18:00:00",
    dataLimiteInscricao: "2025-02-10T23:59:59",
    local: "Centro Esportivo Municipal",
    endereco: "Rua das Palmeiras, 123 - Centro",
    vagas: 16,
    minParticipantes: 8,
    participantes: 12,
    premio: "R$ 2.000 para o 1º lugar",
    taxaInscricao: "R$ 150 por equipe",
    regras: [
      "Cada equipe deve ter no mínimo 7 jogadores",
      "Tempo de jogo: 2 tempos de 20 minutos",
      "Cartões amarelos e vermelhos seguem regras oficiais",
      "Substituições ilimitadas",
    ],
    requisitos: [
      "Idade mínima: 18 anos",
      "Apresentar documento com foto",
      "Atestado médico obrigatório",
      "Pagamento da taxa de inscrição",
    ],
    status: "inscricoes",
    organizador: "Carlos Silva",
    permitirEquipes: true,
    tamanhoEquipe: 11,
    criadoEm: "2025-01-10T10:00:00",
  },
  {
    id: 2,
    nome: "Campeonato de Basquete 3x3",
    descricao: "Torneio de basquete 3x3 para todas as idades. Venha mostrar suas habilidades na quadra!",
    esporte: "Basquete",
    categoria: "Livre",
    formato: "Grupos + Eliminatória",
    dataInicio: "2025-01-20T08:00:00",
    dataFim: "2025-01-20T17:00:00",
    dataLimiteInscricao: "2025-01-18T23:59:59",
    local: "Quadra Poliesportiva Central",
    endereco: "Av. Principal, 456 - Bairro Novo",
    vagas: 12,
    minParticipantes: 6,
    participantes: 8,
    premio: "Troféus e medalhas",
    taxaInscricao: "R$ 80 por equipe",
    regras: [
      "Equipes de 3 jogadores + 1 reserva",
      "Tempo de jogo: 15 minutos ou 21 pontos",
      "Bola oficial de basquete",
      "Arbitragem oficial",
    ],
    requisitos: ["Idade mínima: 16 anos", "Documento com foto", "Tênis apropriado para quadra"],
    status: "andamento",
    organizador: "Ana Oliveira",
    permitirEquipes: true,
    tamanhoEquipe: 3,
    criadoEm: "2025-01-05T14:30:00",
  },
  {
    id: 3,
    nome: "Torneio Individual de Tênis",
    descricao: "Competição individual de tênis para jogadores intermediários e avançados.",
    esporte: "Tênis",
    categoria: "Intermediário/Avançado",
    formato: "Eliminatória Simples",
    dataInicio: "2025-01-10T08:00:00",
    dataFim: "2025-01-12T16:00:00",
    dataLimiteInscricao: "2025-01-08T23:59:59",
    local: "Clube de Tênis Elite",
    endereco: "Rua dos Esportes, 789 - Vila Olímpica",
    vagas: 32,
    minParticipantes: 16,
    participantes: 32,
    premio: "R$ 1.500 para o campeão",
    taxaInscricao: "R$ 120 por pessoa",
    regras: [
      "Melhor de 3 sets até as semifinais",
      "Final em melhor de 5 sets",
      "Tie-break em 6x6",
      "Bolas oficiais fornecidas",
    ],
    requisitos: ["Ranking mínimo intermediário", "Equipamentos próprios", "Seguro esportivo"],
    status: "finalizado",
    organizador: "Pedro Santos",
    permitirEquipes: false,
    criadoEm: "2024-12-20T09:15:00",
  },
  {
    id: 4,
    nome: "Copa de Vôlei de Praia",
    descricao: "Torneio de vôlei de praia na areia! Duplas masculinas, femininas e mistas.",
    esporte: "Vôlei de Praia",
    categoria: "Livre",
    formato: "Grupos + Mata-mata",
    dataInicio: "2025-03-01T07:00:00",
    dataFim: "2025-03-02T19:00:00",
    dataLimiteInscricao: "2025-02-25T23:59:59",
    local: "Arena de Vôlei de Praia",
    endereco: "Orla da Praia, s/n - Beira Mar",
    vagas: 24,
    minParticipantes: 12,
    participantes: 6,
    premio: "R$ 3.000 em premiação total",
    taxaInscricao: "R$ 100 por dupla",
    regras: [
      "Duplas (2 jogadores + 1 reserva)",
      "Melhor de 3 sets até 21 pontos",
      "Set decisivo até 15 pontos",
      "Rede oficial de vôlei de praia",
    ],
    requisitos: ["Idade mínima: 18 anos", "Experiência em vôlei", "Protetor solar obrigatório"],
    status: "inscricoes",
    organizador: "Mariana Costa",
    permitirEquipes: true,
    tamanhoEquipe: 2,
    criadoEm: "2025-01-08T16:45:00",
  },
  {
    id: 5,
    nome: "Maratona de Corrida 10K",
    descricao: "Corrida de 10 quilômetros pelas principais ruas da cidade. Para todos os níveis!",
    esporte: "Corrida",
    categoria: "Livre",
    formato: "Tempo Individual",
    dataInicio: "2025-02-20T06:00:00",
    dataLimiteInscricao: "2025-02-15T23:59:59",
    local: "Parque Municipal",
    endereco: "Entrada Principal do Parque - Centro",
    vagas: 200,
    minParticipantes: 50,
    participantes: 145,
    premio: "Medalhas para todos os participantes",
    taxaInscricao: "R$ 45 por pessoa",
    regras: [
      "Percurso de 10km demarcado",
      "Hidratação a cada 2,5km",
      "Cronometragem eletrônica",
      "Largada em grupos por ritmo",
    ],
    requisitos: ["Idade mínima: 16 anos", "Atestado médico obrigatório", "Número de peito fornecido"],
    status: "inscricoes",
    organizador: "Lucas Mendes",
    permitirEquipes: false,
    criadoEm: "2025-01-12T11:20:00",
  },
]

export default function CompeticoesPage() {
  const router = useRouter()
  const [competicoes, setCompeticoes] = useState<Competicao[]>([])
  const [filtroEsporte, setFiltroEsporte] = useState<string>("todos")
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [busca, setBusca] = useState("")
  const [tabAtiva, setTabAtiva] = useState("proximas")

  useEffect(() => {
    // Carregar competições do localStorage ou usar exemplos
    const competicoesStorage = localStorage.getItem("competicoes")
    if (competicoesStorage) {
      const competicoesExistentes = JSON.parse(competicoesStorage)
      // Se não há competições ou são muito poucas, adicionar exemplos
      if (competicoesExistentes.length < 3) {
        const competicoesCompletas = [...competicoesExistentes, ...competicoesExemplo]
        localStorage.setItem("competicoes", JSON.stringify(competicoesCompletas))
        setCompeticoes(competicoesCompletas)
      } else {
        setCompeticoes(competicoesExistentes)
      }
    } else {
      // Primeira vez, salvar exemplos
      localStorage.setItem("competicoes", JSON.stringify(competicoesExemplo))
      setCompeticoes(competicoesExemplo)
    }
  }, [])

  const competicoesFiltradas = competicoes.filter((competicao) => {
    const matchBusca =
      competicao.nome.toLowerCase().includes(busca.toLowerCase()) ||
      competicao.esporte.toLowerCase().includes(busca.toLowerCase()) ||
      competicao.local.toLowerCase().includes(busca.toLowerCase())

    const matchEsporte = filtroEsporte === "todos" || competicao.esporte === filtroEsporte
    const matchStatus = filtroStatus === "todos" || competicao.status === filtroStatus

    const matchTab = (() => {
      switch (tabAtiva) {
        case "proximas":
          return competicao.status === "inscricoes" || competicao.status === "andamento"
        case "inscricoes":
          return competicao.status === "inscricoes"
        case "andamento":
          return competicao.status === "andamento"
        case "finalizadas":
          return competicao.status === "finalizado"
        default:
          return true
      }
    })()

    return matchBusca && matchEsporte && matchStatus && matchTab
  })

  const esportesDisponiveis = [...new Set(competicoes.map((c) => c.esporte))]

  const handleVerCompeticao = (id: number) => {
    router.push(`/dashboard/competicoes/${id}`)
  }

  const handleCriarCompeticao = () => {
    router.push("/dashboard/competicoes/criar")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "inscricoes":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Inscrições Abertas</Badge>
      case "andamento":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>
      case "finalizado":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Finalizado</Badge>
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "inscricoes":
        return <UserCheck className="h-4 w-4" />
      case "andamento":
        return <Play className="h-4 w-4" />
      case "finalizado":
        return <Flag className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const limparFiltros = () => {
    setFiltroEsporte("todos")
    setFiltroStatus("todos")
    setBusca("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Competições</h1>
          <p className="text-muted-foreground">Encontre e participe de competições esportivas na sua região</p>
        </div>
        <Button onClick={handleCriarCompeticao} className="bg-primary-sportlink hover:bg-primary-sportlink/90">
          <Plus className="h-4 w-4 mr-2" />
          Criar Competição
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar competições..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filtroEsporte} onValueChange={setFiltroEsporte}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Esporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os esportes</SelectItem>
                {esportesDisponiveis.map((esporte) => (
                  <SelectItem key={esporte} value={esporte}>
                    {esporte}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="inscricoes">Inscrições Abertas</SelectItem>
                <SelectItem value="andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizado">Finalizadas</SelectItem>
              </SelectContent>
            </Select>
            {(filtroEsporte !== "todos" || filtroStatus !== "todos" || busca) && (
              <Button variant="outline" onClick={limparFiltros}>
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="inscricoes">Inscrições</TabsTrigger>
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
        </TabsList>

        <TabsContent value={tabAtiva} className="mt-6">
          {competicoesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {busca || filtroEsporte !== "todos" || filtroStatus !== "todos"
                  ? "Nenhuma competição encontrada"
                  : "Nenhuma competição disponível"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {busca || filtroEsporte !== "todos" || filtroStatus !== "todos"
                  ? "Tente ajustar os filtros para encontrar competições."
                  : "Seja o primeiro a criar uma competição!"}
              </p>
              <div className="flex gap-2 justify-center">
                {(busca || filtroEsporte !== "todos" || filtroStatus !== "todos") && (
                  <Button variant="outline" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                )}
                <Button onClick={handleCriarCompeticao}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Competição
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competicoesFiltradas.map((competicao) => (
                <Card
                  key={competicao.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => handleVerCompeticao(competicao.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusIcon(competicao.status)}
                        {getStatusBadge(competicao.status)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">4.5</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{competicao.nome}</CardTitle>
                    <CardDescription className="line-clamp-2">{competicao.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4" />
                      <span>{competicao.esporte}</span>
                      <span>•</span>
                      <span>{competicao.categoria}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(competicao.dataInicio), "PPP", { locale: ptBR })}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{competicao.local}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Participantes</span>
                        <span className="font-medium">
                          {competicao.participantes}/{competicao.vagas}
                        </span>
                      </div>
                      <Progress value={(competicao.participantes / competicao.vagas) * 100} className="h-2" />
                    </div>

                    {competicao.premio && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-primary-sportlink">{competicao.premio}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {competicao.organizador
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{competicao.organizador}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={competicao.status === "inscricoes" ? "default" : "outline"}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVerCompeticao(competicao.id)
                        }}
                      >
                        {competicao.status === "inscricoes" ? "Participar" : "Ver detalhes"}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Estatísticas */}
      {competicoes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-sportlink">{competicoes.length}</div>
              <div className="text-sm text-muted-foreground">Total de Competições</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {competicoes.filter((c) => c.status === "inscricoes").length}
              </div>
              <div className="text-sm text-muted-foreground">Inscrições Abertas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {competicoes.filter((c) => c.status === "andamento").length}
              </div>
              <div className="text-sm text-muted-foreground">Em Andamento</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {competicoes.filter((c) => c.status === "finalizado").length}
              </div>
              <div className="text-sm text-muted-foreground">Finalizadas</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
