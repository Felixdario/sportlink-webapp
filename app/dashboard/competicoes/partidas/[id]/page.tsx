"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronLeft,
  AlertCircle,
  DollarSign,
  Share2,
  Heart,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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

export default function PartidaDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [partida, setPartida] = useState<PartidaAmistosa | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorito, setIsFavorito] = useState(false)
  const [seInscreveu, setSeInscreveu] = useState(false)

  useEffect(() => {
    const carregarPartida = () => {
      try {
        const partidas = JSON.parse(localStorage.getItem("partidasAmistosas") || "[]")
        const partidaEncontrada = partidas.find((p: PartidaAmistosa) => p.id === Number(params.id))
        setPartida(partidaEncontrada || null)
      } catch (error) {
        console.error("Erro ao carregar partida:", error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarPartida()
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmada</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      case "finalizada":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Finalizada</Badge>
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando partida...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!partida) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Partida não encontrada</h2>
          <p className="text-muted-foreground mb-4">A partida que você está procurando não existe ou foi removida.</p>
          <Button onClick={() => router.push("/dashboard/competicoes")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para competições
          </Button>
        </div>
      </div>
    )
  }

  const progressoParticipantes = (partida.participantesConfirmados / partida.vagas) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/competicoes")} className="mr-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatusBadge(partida.status)}
            <Badge
              variant="outline"
              className="bg-primary-sportlink/10 text-primary-sportlink border-primary-sportlink/20"
            >
              <Users className="h-3 w-3 mr-1" />
              Amistosa
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{partida.nome}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsFavorito(!isFavorito)}>
            <Heart className={`h-4 w-4 ${isFavorito ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre a Partida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {partida.descricao || "Partida amistosa para diversão e integração entre amigos!"}
              </p>
            </CardContent>
          </Card>

          {/* Detalhes */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Partida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Data</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(partida.dataInicio), "PPP", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Horário</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(partida.dataInicio), "HH:mm")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{partida.local}</p>
                    <p className="text-sm text-muted-foreground">{partida.endereco}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Esporte</p>
                    <p className="text-sm text-muted-foreground">{partida.esporte}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informações de Custo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 mb-1">Custo da Quadra</p>
                  <p className="text-2xl font-bold text-blue-700">R$ {partida.custoQuadra.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-1">Por Participante</p>
                  <p className="text-2xl font-bold text-green-700">R$ {partida.custoParticipante.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
                  <strong>Cálculo:</strong> R$ {partida.custoQuadra.toFixed(2)} ÷ {partida.vagas} vagas = R${" "}
                  {partida.custoParticipante.toFixed(2)} por pessoa
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Participantes */}
          <Card>
            <CardHeader>
              <CardTitle>Participantes Confirmados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{partida.participantesConfirmados} participantes</span>
                  <span>{partida.vagas} vagas</span>
                </div>
                <Progress value={progressoParticipantes} className="h-2" />
              </div>

              {partida.participantes && partida.participantes.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partida.participantes.map((nome, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{nome}</span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Card de Ação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partida.status === "confirmada" || partida.status === "pendente" ? (
                <>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {partida.participantesConfirmados < partida.vagas
                        ? "Ainda há vagas disponíveis!"
                        : "Partida lotada! Fique na lista de espera."}
                    </AlertDescription>
                  </Alert>

                  <Button
                    className="w-full"
                    disabled={seInscreveu}
                    onClick={() => setSeInscreveu(true)}
                    variant={seInscreveu ? "outline" : "default"}
                  >
                    {seInscreveu ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Você está na lista!
                      </>
                    ) : (
                      "Participar da Partida"
                    )}
                  </Button>
                </>
              ) : partida.status === "finalizada" ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Esta partida foi finalizada.</AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Esta partida foi cancelada.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Organizador */}
          <Card>
            <CardHeader>
              <CardTitle>Organizador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {partida.organizador
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{partida.organizador}</p>
                  <p className="text-xs text-muted-foreground">
                    Criado em {format(new Date(partida.criadoEm), "dd/MM")}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                Entrar em contato
              </Button>
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex gap-2">
                <span className="font-bold text-primary-sportlink">1.</span>
                <span>Confirme sua presença</span>
              </p>
              <p className="flex gap-2">
                <span className="font-bold text-primary-sportlink">2.</span>
                <span>Chegue com 15 min de antecedência</span>
              </p>
              <p className="flex gap-2">
                <span className="font-bold text-primary-sportlink">3.</span>
                <span>Realize o pagamento da sua parte</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
