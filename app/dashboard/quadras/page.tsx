"use client"

import { useState, useEffect } from "react"
import { MapPin, Star, Users, Filter, Search } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

export default function QuadrasPage() {
  const [mounted, setMounted] = useState(false)
  const [filtroEsporte, setFiltroEsporte] = useState("")
  const [filtroBairro, setFiltroBairro] = useState("")
  const [busca, setBusca] = useState("")
  const [activeTab, setActiveTab] = useState("lista")

  useEffect(() => {
    setMounted(true)
  }, [])

  const quadras = [
    {
      id: 1,
      nome: "Quadra Poliesportiva Central",
      endereco: "Av. Principal, 123 - Centro",
      bairro: "Centro",
      distancia: "1.2 km",
      esportes: ["Futebol", "Basquete", "Vôlei"],
      avaliacao: 4.5,
      avaliacoes: 120,
      imagem: "/placeholder.svg?height=200&width=400&text=Quadra 1",
      jogadoresHoje: 12,
      preco: "R$ 80/hora",
      disponivel: true,
      latitude: -23.5505,
      longitude: -46.6333,
    },
    {
      id: 2,
      nome: "Complexo Esportivo Municipal",
      endereco: "Rua das Flores, 456 - Jardim",
      bairro: "Jardim",
      distancia: "2.5 km",
      esportes: ["Tênis", "Futebol", "Natação"],
      avaliacao: 4.2,
      avaliacoes: 85,
      imagem: "/placeholder.svg?height=200&width=400&text=Quadra 2",
      jogadoresHoje: 8,
      preco: "R$ 60/hora",
      disponivel: true,
      latitude: -23.5605,
      longitude: -46.6433,
    },
    {
      id: 3,
      nome: "Arena Esportiva Zona Sul",
      endereco: "Av. Sul, 789 - Zona Sul",
      bairro: "Zona Sul",
      distancia: "3.8 km",
      esportes: ["Futsal", "Handebol", "Basquete"],
      avaliacao: 4.7,
      avaliacoes: 150,
      imagem: "/placeholder.svg?height=200&width=400&text=Quadra 3",
      jogadoresHoje: 15,
      preco: "R$ 100/hora",
      disponivel: true,
      latitude: -23.5705,
      longitude: -46.6233,
    },
    {
      id: 4,
      nome: "Centro Esportivo Parque Verde",
      endereco: "Rua do Parque, 321 - Parque Verde",
      bairro: "Parque Verde",
      distancia: "4.1 km",
      esportes: ["Futebol", "Vôlei de Praia", "Tênis"],
      avaliacao: 4.0,
      avaliacoes: 95,
      imagem: "/placeholder.svg?height=200&width=400&text=Quadra 4",
      jogadoresHoje: 10,
      preco: "R$ 75/hora",
      disponivel: false,
      latitude: -23.5805,
      longitude: -46.6533,
    },
    {
      id: 5,
      nome: "Ginásio Municipal",
      endereco: "Av. Central, 654 - Centro",
      bairro: "Centro",
      distancia: "1.9 km",
      esportes: ["Basquete", "Vôlei", "Futsal"],
      avaliacao: 4.3,
      avaliacoes: 110,
      imagem: "/placeholder.svg?height=200&width=400&text=Quadra 5",
      jogadoresHoje: 14,
      preco: "R$ 90/hora",
      disponivel: true,
      latitude: -23.5405,
      longitude: -46.6433,
    },
    {
      id: 6,
      nome: "Clube Esportivo Água Azul",
      endereco: "Rua do Lago, 987 - Lagoa",
      bairro: "Lagoa",
      distancia: "5.2 km",
      esportes: ["Natação", "Tênis", "Futebol"],
      avaliacao: 4.8,
      avaliacoes: 200,
      imagem: "/placeholder.svg?height=200&width=400&text=Quadra 6",
      jogadoresHoje: 20,
      preco: "R$ 120/hora",
      disponivel: true,
      latitude: -23.5605,
      longitude: -46.6133,
    },
  ]

  const bairros = [...new Set(quadras.map((quadra) => quadra.bairro))]
  const esportes = [...new Set(quadras.flatMap((quadra) => quadra.esportes))]

  const quadrasFiltradas = quadras.filter((quadra) => {
    const matchEsporte = filtroEsporte ? quadra.esportes.includes(filtroEsporte) : true
    const matchBairro = filtroBairro ? quadra.bairro === filtroBairro : true
    const matchBusca = busca
      ? quadra.nome.toLowerCase().includes(busca.toLowerCase()) ||
        quadra.endereco.toLowerCase().includes(busca.toLowerCase())
      : true

    return matchEsporte && matchBairro && matchBusca
  })

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Quadras próximas a você</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar quadras..."
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
                <DialogTitle>Filtrar quadras</DialogTitle>
                <DialogDescription>Selecione os filtros para encontrar a quadra ideal</DialogDescription>
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
                  <label className="text-sm font-medium">Bairro</label>
                  <Select value={filtroBairro} onValueChange={setFiltroBairro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os bairros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os bairros</SelectItem>
                      {bairros.map((bairro) => (
                        <SelectItem key={bairro} value={bairro}>
                          {bairro}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disponibilidade</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer disponibilidade</SelectItem>
                      <SelectItem value="available">Disponível agora</SelectItem>
                      <SelectItem value="today">Disponível hoje</SelectItem>
                      <SelectItem value="week">Disponível esta semana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preço</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Qualquer preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Qualquer preço</SelectItem>
                      <SelectItem value="low">Até R$ 50/hora</SelectItem>
                      <SelectItem value="medium">R$ 50 a R$ 100/hora</SelectItem>
                      <SelectItem value="high">Acima de R$ 100/hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFiltroEsporte("")
                    setFiltroBairro("")
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadrasFiltradas.length > 0 ? (
              quadrasFiltradas.map((quadra) => (
                <Card key={quadra.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border">
                  <div className="relative">
                    <img
                      src={quadra.imagem || "/placeholder.svg"}
                      alt={quadra.nome}
                      className="w-full h-48 object-cover"
                    />
                    {!quadra.disponivel && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm py-1 px-3">
                          Indisponível
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {quadra.preco}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{quadra.nome}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                      <p className="text-sm truncate">{quadra.endereco}</p>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1 flex-shrink-0" />
                      <p className="text-sm">
                        {quadra.avaliacao} ({quadra.avaliacoes} avaliações)
                      </p>
                      <span className="mx-2">•</span>
                      <p className="text-sm">{quadra.distancia}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Esportes disponíveis:</p>
                      <div className="flex flex-wrap gap-2">
                        {quadra.esportes.map((esporte, index) => (
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
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                        <p className="text-sm">{quadra.jogadoresHoje} pessoas hoje</p>
                      </div>
                      <Button size="sm">Ver detalhes</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Nenhuma quadra encontrada</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Não encontramos quadras com os filtros selecionados. Tente ajustar seus filtros ou buscar em uma área
                  maior.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setFiltroEsporte("")
                    setFiltroBairro("")
                    setBusca("")
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
    </div>
  )
}
