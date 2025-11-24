"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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
              <Label htmlFor="local">Local (nome da quadra) *</Label>
              <Input
                id="local"
                name="local"
                placeholder="Ex: Quadra Poliesportiva Central"
                value={formData.local}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                placeholder="Rua, número, bairro"
                value={formData.endereco}
                onChange={handleInputChange}
              />
            </div>

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
