"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, MapPin, Trophy, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function CompeticoesPage() {
  const [mounted, setMounted] = useState(false)
  const [filtroEsporte, setFiltroEsporte] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("")
  const [busca, setBusca] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const competicoes = [
    {
      id: 1,
      nome: "Torneio de Futebol Amador",
      data: "15/06/2025",
      dataInicio: "15/06/2025",
      dataFim: "20/06/2025",
      local: "Quadra Poliesportiva Central",
      endereco: "Av. Principal, 123 - Centro",
      esporte: "Futebol",
      participantes: 24,
      vagas: 32,
      status: "inscricoes",
      imagem: "/placeholder.svg?height=200&width=400&text=Competição 1",
      organizador: "Liga Municipal de Esportes",
      premio: "Troféu + Medalhas",
      descricao: "Torneio amador de futebol para equipes de 5 a 7 jogadores.",
    },
    {
      id: 2,
      nome: "Copa Basquete 3x3",
      data: "22/06/2025",
      dataInicio: "22/06/2025",
      dataFim: "23/06/2025",
      local: "Ginásio Municipal",
      endereco: "Av. Central, 654 - Centro",
      esporte: "Basquete",
      participantes: 18,
      vagas: 24,
      status: "inscricoes",
      imagem: "/placeholder.svg?height=200&width=400&text=Competição 2",
      organizador: "Associação de Basquete",
      premio: "R$ 2.000 + Troféu",
      descricao: "Competição de basquete 3x3 com categorias masculina e feminina.",
    },
    {
      id: 3,
      nome: "Campeonato de Vôlei de Praia",
      data: "29/06/2025",
      dataInicio: "29/06/2025",
      dataFim: "30/06/2025",
      local: "Centro Esportivo Parque Verde",
      endereco: "Rua do Parque, 321 - Parque Verde",
      esporte: "Vôlei de Praia",
      participantes: 12,
      vagas: 16,
      status: "inscricoes",
      imagem: "/placeholder.svg?height=200&width=400&text=Competição 3",
      organizador: "Clube de Vôlei da Cidade",
      premio: "R$ 1.500 + Troféu",
      descricao: "Campeonato de vôlei de praia em duplas.",
    },
    {
      id: 4,
      nome: "Torneio de Tênis Municipal",
      data: "05/07/2025",
      dataInicio: "05/07/2025",
      dataFim: "12/07/2025",
      local: "Complexo Esportivo Municipal",
      endereco: "Rua das Flores, 456 - Jardim",
      esporte: "Tênis",
      participantes: 8,
      vagas: 16,
      status: "inscricoes",
      imagem: "/placeholder.svg?height=200&width=400&text=Competição 4",
      organizador: "Clube de Tênis",
      premio: "Troféu + Equipamentos esportivos",
      descricao: "Torneio de tênis individual com categorias por idade.",
    },
    {
      id: 5,
      nome: "Maratona da Cidade",
      data: "20/07/2025",
      dataInicio: "20/07/2025",
      dataFim: "20/07/2025",
      local: "Parque Central",
      endereco: "Av. do Parque, 100 - Centro",
      esporte: "Corrida",
      participantes: 120,
      vagas: 200,
      status: "inscricoes",
      imagem: "/placeholder.svg?height=200&width=400&text=Competição 5",
      organizador: "Secretaria de Esportes",
      premio: "Medalhas + Certificados",
      descricao: "Maratona com percursos de 5km, 10km e 21km.",
    },
    {
      id: 6,
      nome: "Campeonato de Natação",
      data: "10/08/2025",
      dataInicio: "10/08/2025",
      dataFim: "11/08/2025",
      local: "Clube Esportivo Água Azul",
      endereco: "Rua do Lago, 987 - Lagoa",
      esporte: "Natação",
      participantes: 45,
      vagas: 60,
      status: "inscricoes",
      imagem: "/placeholder.svg?height=200&width=400&text=Competição 6",
      organizador: "Federação de Natação",
      premio: "Medalhas + Troféus",
      descricao: "Campeonato de natação com diversas categorias e estilos.",
    },
  ]

  const esportes = [...new Set(competicoes.map((competicao) => competicao.esporte))]

  const competicoesFiltradas = competicoes.filter((competicao) => {
    const matchEsporte = filtroEsporte ? competicao.esporte === filtroEsporte : true
    const matchStatus = filtroStatus ? competicao.status === filtroStatus : true
    const matchBusca = busca
      ? competicao.nome.toLowerCase().includes(busca.toLowerCase()) ||
        competicao.local.toLowerCase().includes(busca.toLowerCase())
      : true

    return matchEsporte && matchStatus && matchBusca
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Competições</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar competições..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtrar competições</DialogTitle>
                <DialogDescription>Selecione os filtros para encontrar competições do seu interesse</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Esporte</label>
                  <Select value={filtroEsporte} onValueChange={setFiltroEsporte}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os esportes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os esportes</SelectItem>
                      {esportes.map((esporte) => (
                        <SelectItem key={esporte} value={esporte}>
                          {esporte}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="inscricoes">Inscrições abertas</SelectItem>
                      <SelectItem value="andamento">Em andamento</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Período</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Qualquer período</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                      <SelectItem value="next">Próximo mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiltroEsporte("")
                    setFiltroStatus("")
                  }}
                >
                  Limpar filtros
                </Button>
                <Button>Aplicar filtros</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Criar competição</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="proximas" className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="minhas">Minhas</TabsTrigger>
          <TabsTrigger value="passadas">Passadas</TabsTrigger>
        </TabsList>
        <TabsContent value="proximas" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competicoesFiltradas.length > 0 ? (
              competicoesFiltradas.map((competicao) => (
                <Card key={competicao.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={competicao.imagem || "/placeholder.svg"}
                        alt={competicao.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 md:w-2/3">
                      <div className="flex items-center mb-2">
                        <Badge
                          variant="outline"
                          className="bg-primary-sportlink/10 text-primary-sportlink border-primary-sportlink/20 mr-2"
                        >
                          {competicao.esporte}
                        </Badge>
                        <Badge variant="secondary">
                          {competicao.status === "inscricoes"
                            ? "Inscrições abertas"
                            : competicao.status === "andamento"
                              ? "Em andamento"
                              : "Finalizado"}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{competicao.nome}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <p className="text-sm">
                          {competicao.dataInicio === competicao.dataFim
                            ? competicao.dataInicio
                            : `${competicao.dataInicio} a ${competicao.dataFim}`}
                        </p>
                      </div>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{competicao.local}</p>
                          <p className="text-xs">{competicao.endereco}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                        <div className="w-full">
                          <div className="flex justify-between text-sm mb-1">
                            <span>
                              {competicao.participantes} de {competicao.vagas} participantes
                            </span>
                            <span>{Math.round((competicao.participantes / competicao.vagas) * 100)}%</span>
                          </div>
                          <Progress value={(competicao.participantes / competicao.vagas) * 100} className="h-2" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-muted-foreground">
                          <Trophy className="w-4 h-4 mr-2 flex-shrink-0" />
                          <p className="text-sm">{competicao.premio}</p>
                        </div>
                        <Button>Participar</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Nenhuma competição encontrada</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Não encontramos competições com os filtros selecionados. Tente ajustar seus filtros ou criar uma nova
                  competição.
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFiltroEsporte("")
                      setFiltroStatus("")
                      setBusca("")
                    }}
                  >
                    Limpar filtros
                  </Button>
                  <Button>Criar competição</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="minhas" className="mt-4">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Você ainda não participa de competições</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Inscreva-se em uma competição ou crie a sua própria para começar a competir.
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <Button variant="outline">Explorar competições</Button>
              <Button>Criar competição</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="passadas" className="mt-4">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Nenhuma competição passada</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Seu histórico de competições aparecerá aqui quando você participar de eventos.
            </p>
            <Button variant="outline" className="mt-4">
              Explorar competições
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
