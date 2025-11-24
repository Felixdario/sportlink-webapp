"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, X, Search, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getCourts } from "@/lib/data/courts"

interface PartidaAmistosa {
  id: number
  nome: string
  descricao: string
  esporte: string
  dataInicio: string
  local: string
  endereco: string
  custoQuadra: number
  participantesConfirmados: number
  vagas: number
  custoParticipante: number
  status: "confirmada" | "pendente" | "finalizada" | "cancelada"
  organizador: string
  criadoEm: string
  participantes?: string[]
}

const esportes = ["Futebol", "Basquete", "Vôlei", "Futsal", "Tênis", "Badminton", "Handball", "Outro"]

export default function CriarPartidaPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isQuadraDialogAberto, setIsQuadraDialogAberto] = useState(false)
  const [quadrasDisponiveis, setQuadrasDisponiveis] = useState<any[]>([])
  const [quadraSelecionada, setQuadraSelecionada] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    esporte: "",
    dataInicio: "",
    horario: "",
    local: "",
    endereco: "",
    custoQuadra: "",
    vagas: "",
    participantes: [] as string[],
  })
  const [novoParticipante, setNovoParticipante] = useState("")
  const [isCarregando, setIsCarregando] = useState(false)

  useEffect(() => {
    setMounted(true)
    carregarQuadras()
  }, [])

  // Efeito para recarregar quadras quando a página ganha foco (usuário volta de outra página)
  useEffect(() => {
    const handleFocus = () => {
      carregarQuadras()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const carregarQuadras = () => {
    // Carregar quadras do organizador
    const organizerId = "org1" // Em produção, viria do contexto de autenticação
    const quadras = getCourts(organizerId)
    setQuadrasDisponiveis(quadras)
  }

  const handleSelecionarQuadra = (quadra: any) => {
    setQuadraSelecionada(quadra)
    setFormData((prev) => ({
      ...prev,
      local: quadra.name,
      endereco: quadra.address,
      custoQuadra: quadra.price.toString(),
    }))
    setIsQuadraDialogAberto(false)
  }

  const abrirSeletorQuadras = () => {
    setIsQuadraDialogAberto(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string, campo: string) => {
    setFormData((prev) => ({
      ...prev,
      [campo]: value,
    }))
  }

  const adicionarParticipante = () => {
    if (novoParticipante.trim()) {
      setFormData((prev) => ({
        ...prev,
        participantes: [...prev.participantes, novoParticipante],
      }))
      setNovoParticipante("")
    }
  }

  const removerParticipante = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      participantes: prev.participantes.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCarregando(true)

    try {
      // Validar dados
      if (
        !formData.nome ||
        !formData.esporte ||
        !formData.dataInicio ||
        !formData.horario ||
        !formData.local ||
        !formData.custoQuadra ||
        !formData.vagas
      ) {
        alert("Preencha todos os campos obrigatórios!")
        setIsCarregando(false)
        return
      }

      // Criar nova partida
      const novaPartida: PartidaAmistosa = {
        id: Date.now(),
        nome: formData.nome,
        descricao: formData.descricao,
        esporte: formData.esporte,
        dataInicio: `${formData.dataInicio}T${formData.horario}:00`,
        local: formData.local,
        endereco: formData.endereco,
        custoQuadra: Number.parseFloat(formData.custoQuadra),
        participantesConfirmados: formData.participantes.length,
        vagas: Number.parseInt(formData.vagas),
        custoParticipante:
          Math.round((Number.parseFloat(formData.custoQuadra) / Number.parseInt(formData.vagas)) * 100) / 100,
        status: "pendente",
        organizador: "Você", // Em produção, seria o usuário logado
        criadoEm: new Date().toISOString(),
        participantes: formData.participantes,
      }

      // Salvar no localStorage
      const partidas = JSON.parse(localStorage.getItem("partidasAmistosas") || "[]")
      partidas.push(novaPartida)
      localStorage.setItem("partidasAmistosas", JSON.stringify(partidas))

      // Redirecionar
      router.push(`/dashboard/competicoes/partidas/${novaPartida.id}`)
    } catch (error) {
      console.error("Erro ao criar partida:", error)
      alert("Erro ao criar partida. Tente novamente.")
    } finally {
      setIsCarregando(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Criar Partida Amistosa</h1>
          <p className="text-muted-foreground">Configure os detalhes da sua partida</p>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Preencha os detalhes principais da partida</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Partida *</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Pelada Quinta à Noite"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva a partida, nível de jogo, regras especiais, etc."
                value={formData.descricao}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            {/* Esporte */}
            <div className="space-y-2">
              <Label htmlFor="esporte">Esporte *</Label>
              <Select value={formData.esporte} onValueChange={(value) => handleSelectChange(value, "esporte")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o esporte" />
                </SelectTrigger>
                <SelectContent>
                  {esportes.map((esporte) => (
                    <SelectItem key={esporte} value={esporte}>
                      {esporte}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data *</Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horario">Horário *</Label>
                <Input
                  id="horario"
                  name="horario"
                  type="time"
                  value={formData.horario}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Local */}
            <div className="space-y-2">
              <Label htmlFor="local">Nome do local *</Label>
              <div className="relative">
                <Input
                  id="local"
                  placeholder="Selecione uma quadra cadastrada..."
                  value={formData.local}
                  readOnly
                  onClick={abrirSeletorQuadras}
                  className="cursor-pointer"
                  disabled={isCarregando}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Clique para selecionar uma das suas quadras cadastradas
              </p>
            </div>

            {quadraSelecionada && (
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{quadraSelecionada.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{quadraSelecionada.address}</p>
                    <p className="text-sm text-muted-foreground">{quadraSelecionada.neighborhood}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {quadraSelecionada.sports.map((sport: string) => (
                        <span
                          key={sport}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <p>📍 {quadraSelecionada.address}</p>
                      <p>💰 R$ {quadraSelecionada.price}/hora</p>
                      {quadraSelecionada.rating && (
                        <p>⭐ {quadraSelecionada.rating} ({quadraSelecionada.totalReviews} avaliações)</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={abrirSeletorQuadras}
                    disabled={isCarregando}
                  >
                    Alterar
                  </Button>
                </div>
              </div>
            )}

            {/* Custo da Quadra e Vagas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="custoQuadra">Custo da Quadra (R$) *</Label>
                <Input
                  id="custoQuadra"
                  name="custoQuadra"
                  type="number"
                  placeholder="150"
                  value={formData.custoQuadra}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vagas">Número de Vagas *</Label>
                <Input
                  id="vagas"
                  name="vagas"
                  type="number"
                  placeholder="10"
                  value={formData.vagas}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Custo por participante */}
            {formData.custoQuadra && formData.vagas && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600">
                  <strong>Custo por participante:</strong> R${" "}
                  {(
                    Math.round((Number.parseFloat(formData.custoQuadra) / Number.parseInt(formData.vagas)) * 100) / 100
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para seleção de quadras */}
        <Dialog open={isQuadraDialogAberto} onOpenChange={setIsQuadraDialogAberto}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Selecionar Quadra</DialogTitle>
                  <DialogDescription>
                    Escolha uma das suas quadras cadastradas para a partida
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <Command>
              <CommandInput placeholder="Buscar quadras..." />
              <CommandList>
                <CommandEmpty>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">Nenhuma quadra encontrada.</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={carregarQuadras}
                    >
                      🔄 Atualizar
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup>
                  {quadrasDisponiveis.map((quadra) => (
                    <CommandItem
                      key={quadra.id}
                      onSelect={() => handleSelecionarQuadra(quadra)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center space-x-2 w-full">
                        <div className="flex-1">
                          <div className="font-medium">{quadra.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {quadra.neighborhood}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {quadra.sports.slice(0, 2).map((sport: string) => (
                              <span
                                key={sport}
                                className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
                              >
                                {sport}
                              </span>
                            ))}
                            {quadra.sports.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{quadra.sports.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                        {quadraSelecionada?.id === quadra.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>

            {quadrasDisponiveis.length === 0 && (
              <div className="text-center py-6">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma quadra cadastrada</h3>
                <p className="text-muted-foreground mb-4">
                  Você precisa cadastrar pelo menos uma quadra para criar uma partida.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={carregarQuadras}
                    className="w-full"
                  >
                    🔄 Atualizar Lista
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Participantes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Participantes Confirmados</CardTitle>
            <CardDescription>Adicione os participantes confirmados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nome do participante"
                value={novoParticipante}
                onChange={(e) => setNovoParticipante(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    adicionarParticipante()
                  }
                }}
              />
              <Button type="button" onClick={adicionarParticipante} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.participantes.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {formData.participantes.map((participante, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {participante}
                      <button
                        type="button"
                        onClick={() => removerParticipante(index)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.participantes.length} participante(s) confirmado(s)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex gap-3 mt-8">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCarregando}>
            {isCarregando ? "Criando..." : "Criar Partida"}
          </Button>
        </div>
      </form>
    </div>
  )
}
