"use client"

import { useState, useEffect } from "react"
import { Search, Filter, MapPin, Trophy, MessageSquare, Medal, Star, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AtletasPage() {
  const [mounted, setMounted] = useState(false)
  const [filtroEsporte, setFiltroEsporte] = useState("todos")
  const [filtroLocalizacao, setFiltroLocalizacao] = useState("todas")
  const [busca, setBusca] = useState("")
  const [visualizacao, setVisualizacao] = useState("cards")
  const [ordenacao, setOrdenacao] = useState("pontos")
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setMounted(true)
  }, [])

  const atletas = [
    {
      id: 1,
      nome: "Carlos Silva",
      username: "@carlossilva",
      localizacao: "São Paulo, SP",
      distancia: "1.2 km",
      esportesFavoritos: ["Futebol", "Basquete", "Tênis"],
      nivel: "Avançado",
      conquistas: 8,
      avatar: "/placeholder.svg?height=150&width=150&text=CS",
      bio: "Apaixonado por esportes e sempre em busca de novos desafios.",
      pontos: 1250,
      vitorias: 32,
      derrotas: 8,
      empates: 4,
      posicao: 1,
      tendencia: "subindo",
    },
    {
      id: 2,
      nome: "Ana Oliveira",
      username: "@anaoliveira",
      localizacao: "Rio de Janeiro, RJ",
      distancia: "2.5 km",
      esportesFavoritos: ["Vôlei", "Natação"],
      nivel: "Intermediário",
      conquistas: 5,
      avatar: "/placeholder.svg?height=150&width=150&text=AO",
      bio: "Atleta amadora com foco em esportes aquáticos e coletivos.",
      pontos: 980,
      vitorias: 24,
      derrotas: 12,
      empates: 6,
      posicao: 2,
      tendencia: "estável",
    },
    {
      id: 3,
      nome: "Pedro Santos",
      username: "@pedrosantos",
      localizacao: "São Paulo, SP",
      distancia: "3.8 km",
      esportesFavoritos: ["Corrida", "Ciclismo", "Natação"],
      nivel: "Profissional",
      conquistas: 15,
      avatar: "/placeholder.svg?height=150&width=150&text=PS",
      bio: "Triatleta profissional com mais de 10 anos de experiência.",
      pontos: 920,
      vitorias: 28,
      derrotas: 10,
      empates: 2,
      posicao: 3,
      tendencia: "subindo",
    },
    {
      id: 4,
      nome: "Mariana Costa",
      username: "@marianacosta",
      localizacao: "Belo Horizonte, MG",
      distancia: "4.1 km",
      esportesFavoritos: ["Tênis", "Yoga"],
      nivel: "Intermediário",
      conquistas: 3,
      avatar: "/placeholder.svg?height=150&width=150&text=MC",
      bio: "Praticante de tênis nos fins de semana e instrutora de yoga.",
      pontos: 750,
      vitorias: 18,
      derrotas: 15,
      empates: 3,
      posicao: 4,
      tendencia: "descendo",
    },
    {
      id: 5,
      nome: "Lucas Mendes",
      username: "@lucasmendes",
      localizacao: "São Paulo, SP",
      distancia: "1.9 km",
      esportesFavoritos: ["Futebol", "Futsal"],
      nivel: "Avançado",
      conquistas: 10,
      avatar: "/placeholder.svg?height=150&width=150&text=LM",
      bio: "Jogador de futebol amador com passagem por categorias de base.",
      pontos: 680,
      vitorias: 20,
      derrotas: 14,
      empates: 8,
      posicao: 5,
      tendencia: "estável",
    },
    {
      id: 6,
      nome: "Juliana Alves",
      username: "@julianaalves",
      localizacao: "Campinas, SP",
      distancia: "5.2 km",
      esportesFavoritos: ["Basquete", "Vôlei", "Handebol"],
      nivel: "Avançado",
      conquistas: 12,
      avatar: "/placeholder.svg?height=150&width=150&text=JA",
      bio: "Ex-atleta universitária de basquete e atual treinadora.",
      pontos: 620,
      vitorias: 16,
      derrotas: 12,
      empates: 4,
      posicao: 6,
      tendencia: "subindo",
    },
  ]

  const localizacoes = [...new Set(atletas.map((atleta) => atleta.localizacao))]
  const esportes = [...new Set(atletas.flatMap((atleta) => atleta.esportesFavoritos))]

  const atletasFiltrados = atletas
    .filter((atleta) => {
      const matchEsporte = filtroEsporte && filtroEsporte !== "todos" ? atleta.esportesFavoritos.includes(filtroEsporte) : true
      const matchLocalizacao = filtroLocalizacao && filtroLocalizacao !== "todas" ? atleta.localizacao === filtroLocalizacao : true
      const matchBusca = busca
        ? atleta.nome.toLowerCase().includes(busca.toLowerCase()) ||
          atleta.username.toLowerCase().includes(busca.toLowerCase())
        : true

      return matchEsporte && matchLocalizacao && matchBusca
    })
    .sort((a, b) => {
      let comparacao = 0

      switch (ordenacao) {
        case "pontos":
          comparacao = a.pontos - b.pontos
          break
        case "vitorias":
          comparacao = a.vitorias - b.vitorias
          break
        case "nome":
          comparacao = a.nome.localeCompare(b.nome)
          break
        case "conquistas":
          comparacao = a.conquistas - b.conquistas
          break
        default:
          comparacao = a.pontos - b.pontos
      }

      return direcaoOrdenacao === "asc" ? comparacao : -comparacao
    })

  const alternarDirecaoOrdenacao = () => {
    setDirecaoOrdenacao(direcaoOrdenacao === "asc" ? "desc" : "asc")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Atletas</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar atletas..."
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
                <DialogTitle>Filtrar atletas</DialogTitle>
                <DialogDescription>
                  Selecione os filtros para encontrar atletas com interesses semelhantes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Esporte</label>
                  <Select value={filtroEsporte} onValueChange={setFiltroEsporte}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os esportes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os esportes</SelectItem>
                      {esportes.map((esporte) => (
                        <SelectItem key={esporte} value={esporte}>
                          {esporte}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Localização</label>
                  <Select value={filtroLocalizacao} onValueChange={setFiltroLocalizacao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as localizações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as localizações</SelectItem>
                      {localizacoes.map((localizacao) => (
                        <SelectItem key={localizacao} value={localizacao}>
                          {localizacao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nível</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os níveis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos_niveis">Todos os níveis</SelectItem>
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                      <SelectItem value="profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiltroEsporte("todos")
                    setFiltroLocalizacao("todas")
                  }}
                >
                  Limpar filtros
                </Button>
                <Button>Aplicar filtros</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="ranking" className="mb-6">
        <TabsList>
          <TabsTrigger value="ranking" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>Ranking</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>Perfis</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 mb-4 gap-2">
          <div className="text-sm text-muted-foreground">Mostrando {atletasFiltrados.length} atletas</div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Ordenar por:</span>
            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pontos">Pontuação</SelectItem>
                <SelectItem value="vitorias">Vitórias</SelectItem>
                <SelectItem value="conquistas">Conquistas</SelectItem>
                <SelectItem value="nome">Nome</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={alternarDirecaoOrdenacao} className="h-9 w-9">
              {direcaoOrdenacao === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <TabsContent value="ranking">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">Posição</TableHead>
                    <TableHead>Atleta</TableHead>
                    <TableHead className="hidden md:table-cell">Localização</TableHead>
                    <TableHead className="hidden md:table-cell">Esportes</TableHead>
                    <TableHead className="text-center">Pontos</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">V/D/E</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">Conquistas</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atletasFiltrados.length > 0 ? (
                    atletasFiltrados.map((atleta, index) => (
                      <TableRow key={atleta.id}>
                        <TableCell className="font-medium text-center">
                          <div className="flex flex-col items-center">
                            <div className="relative">
                              {index < 3 ? (
                                <div className="absolute -top-1 -right-1">
                                  <Medal
                                    className={`h-4 w-4 ${
                                      index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"
                                    }`}
                                  />
                                </div>
                              ) : null}
                              <span className="font-bold text-lg">{index + 1}</span>
                            </div>
                            {atleta.tendencia === "subindo" ? (
                              <ArrowUp className="h-3 w-3 text-green-500" />
                            ) : atleta.tendencia === "descendo" ? (
                              <ArrowDown className="h-3 w-3 text-red-500" />
                            ) : (
                              <span className="h-3 w-3 block">•</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {atleta.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{atleta.nome}</div>
                              <div className="text-xs text-muted-foreground">{atleta.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span>{atleta.localizacao}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {atleta.esportesFavoritos.slice(0, 2).map((esporte, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-primary-sportlink/10 text-primary-sportlink border-primary-sportlink/20 text-xs"
                              >
                                {esporte}
                              </Badge>
                            ))}
                            {atleta.esportesFavoritos.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{atleta.esportesFavoritos.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-center">{atleta.pontos}</TableCell>
                        <TableCell className="text-center hidden sm:table-cell">
                          <span className="text-green-500">{atleta.vitorias}</span>/
                          <span className="text-red-500">{atleta.derrotas}</span>/
                          <span className="text-muted-foreground">{atleta.empates}</span>
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <div className="flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-primary-sportlink mr-1" />
                            <span>{atleta.conquistas}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="h-8">
                              Ver perfil
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex flex-col items-center">
                          <Search className="h-8 w-8 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">Nenhum atleta encontrado</h3>
                          <p className="text-muted-foreground max-w-md">
                            Não encontramos atletas com os filtros selecionados. Tente ajustar seus filtros ou expandir
                            sua busca.
                          </p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              setFiltroEsporte("todos")
                              setFiltroLocalizacao("todas")
                              setBusca("")
                            }}
                          >
                            Limpar filtros
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {atletasFiltrados.length > 0 ? (
              atletasFiltrados.map((atleta, index) => (
                <Card key={atleta.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback>
                            {atleta.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 bg-background rounded-full p-0.5">
                            <Medal
                              className={`h-5 w-5 ${
                                index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-700"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold truncate">{atleta.nome}</h3>
                          <Badge variant="outline" className="bg-primary-sportlink/10 text-primary-sportlink">
                            #{index + 1}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-1">{atleta.username}</p>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span>{atleta.localizacao}</span>
                          <span className="mx-1">•</span>
                          <span>{atleta.distancia}</span>
                        </div>
                        <Badge variant="outline" className="bg-muted/50">
                          {atleta.nivel}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div className="bg-muted/30 rounded-md p-2">
                        <p className="text-xl font-bold">{atleta.pontos}</p>
                        <p className="text-xs text-muted-foreground">Pontos</p>
                      </div>
                      <div className="bg-muted/30 rounded-md p-2">
                        <p className="text-xl font-bold">{atleta.vitorias}</p>
                        <p className="text-xs text-muted-foreground">Vitórias</p>
                      </div>
                      <div className="bg-muted/30 rounded-md p-2">
                        <p className="text-xl font-bold">{atleta.conquistas}</p>
                        <p className="text-xs text-muted-foreground">Troféus</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Esportes favoritos:</p>
                      <div className="flex flex-wrap gap-2">
                        {atleta.esportesFavoritos.map((esporte, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-primary-sportlink/10 text-primary-sportlink border-primary-sportlink/20"
                          >
                            {esporte}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center text-muted-foreground">
                        <Trophy className="w-4 h-4 mr-1 flex-shrink-0" />
                        <p className="text-sm">{atleta.conquistas} conquistas</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only">Mensagem</span>
                        </Button>
                        <Button size="sm">Ver perfil</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Nenhum atleta encontrado</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Não encontramos atletas com os filtros selecionados. Tente ajustar seus filtros ou expandir sua busca.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFiltroEsporte("todos")
                    setFiltroLocalizacao("todas")
                    setBusca("")
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
