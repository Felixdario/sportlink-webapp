"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  Star,
  Share2,
  Heart,
  ChevronLeft,
  AlertCircle,
  CheckCircle,
  Play,
  Award,
  Target,
  Flag,
  UserCheck,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
}

interface Participante {
  id: number
  nome: string
  avatar?: string
  equipe?: string
  posicao?: number
  pontos?: number
}

interface Partida {
  id: number
  fase: string
  participante1: string
  participante2: string
  resultado1?: number
  resultado2?: number
  data: string
  status: "agendada" | "andamento" | "finalizada"
}

export default function CompeticaoDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [competicao, setCompeticao] = useState<Competicao | null>(null)
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [isInscrito, setIsInscrito] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isInscrevendo, setIsInscrevendo] = useState(false)
  const [isFavorito, setIsFavorito] = useState(false)

  useEffect(() => {
    const carregarCompeticao = () => {
      try {
        // Simular carregamento da competição
        const competicoes = JSON.parse(localStorage.getItem("competicoes") || "[]")
        const competicaoEncontrada = competicoes.find((c: Competicao) => c.id === Number(params.id))

        if (competicaoEncontrada) {
          setCompeticao(competicaoEncontrada)

          // Simular participantes
          const participantesMock: Participante[] = [
            { id: 1, nome: "Carlos Silva", avatar: "/images/avatars/carlos-silva.jpg", equipe: "Equipe A", pontos: 15 },
            { id: 2, nome: "Ana Oliveira", avatar: "/images/avatars/ana-oliveira.jpg", equipe: "Equipe B", pontos: 12 },
            { id: 3, nome: "Pedro Santos", avatar: "/images/avatars/pedro-santos.jpg", equipe: "Equipe C", pontos: 10 },
            {
              id: 4,
              nome: "Mariana Costa",
              avatar: "/images/avatars/mariana-costa.jpg",
              equipe: "Equipe D",
              pontos: 8,
            },
          ]
          setParticipantes(participantesMock.slice(0, competicaoEncontrada.participantes))

          // Simular partidas baseadas no status
          if (competicaoEncontrada.status === "andamento" || competicaoEncontrada.status === "finalizado") {
            const partidasMock: Partida[] = [
              {
                id: 1,
                fase: "Quartas de Final",
                participante1: "Equipe A",
                participante2: "Equipe B",
                resultado1: competicaoEncontrada.status === "finalizado" ? 2 : undefined,
                resultado2: competicaoEncontrada.status === "finalizado" ? 1 : undefined,
                data: "2025-01-15T14:00:00",
                status: competicaoEncontrada.status === "finalizado" ? "finalizada" : "andamento",
              },
              {
                id: 2,
                fase: "Quartas de Final",
                participante1: "Equipe C",
                participante2: "Equipe D",
                resultado1: competicaoEncontrada.status === "finalizado" ? 3 : undefined,
                resultado2: competicaoEncontrada.status === "finalizado" ? 0 : undefined,
                data: "2025-01-15T16:00:00",
                status: competicaoEncontrada.status === "finalizado" ? "finalizada" : "agendada",
              },
            ]
            setPartidas(partidasMock)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar competição:", error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarCompeticao()
  }, [params.id])

  const handleInscrever = async () => {
    setIsInscrevendo(true)
    try {
      // Simular inscrição
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsInscrito(true)

      if (competicao) {
        const novaCompeticao = { ...competicao, participantes: competicao.participantes + 1 }
        setCompeticao(novaCompeticao)

        // Atualizar no localStorage
        const competicoes = JSON.parse(localStorage.getItem("competicoes") || "[]")
        const index = competicoes.findIndex((c: Competicao) => c.id === competicao.id)
        if (index !== -1) {
          competicoes[index] = novaCompeticao
          localStorage.setItem("competicoes", JSON.stringify(competicoes))
        }
      }
    } catch (error) {
      console.error("Erro ao se inscrever:", error)
    } finally {
      setIsInscrevendo(false)
    }
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
      case "cancelado":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando competição...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!competicao) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Competição não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A competição que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => router.push("/dashboard/competicoes")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para competições
          </Button>
        </div>
      </div>
    )
  }

  const progressoInscricoes = (competicao.participantes / competicao.vagas) * 100
  const podeSeInscrever =
    competicao.status === "inscricoes" &&
    competicao.participantes < competicao.vagas &&
    new Date() < new Date(competicao.dataLimiteInscricao) &&
    !isInscrito

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
            {getStatusIcon(competicao.status)}
            {getStatusBadge(competicao.status)}
            <Badge variant="outline">{competicao.esporte}</Badge>
            <Badge variant="outline">{competicao.categoria}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{competicao.nome}</h1>
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
          {/* Imagem e Descrição */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-r from-primary-sportlink/20 to-pink-500/20 rounded-t-lg flex items-center justify-center">
                <Trophy className="h-16 w-16 text-primary-sportlink" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Sobre a competição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {competicao.descricao || "Participe desta emocionante competição e mostre suas habilidades!"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Informações Detalhadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Detalhes da Competição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Data de início</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(competicao.dataInicio), "PPP", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                {competicao.dataFim && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Data de término</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(competicao.dataFim), "PPP", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Limite para inscrições</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(competicao.dataLimiteInscricao), "PPP", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{competicao.local}</p>
                    <p className="text-sm text-muted-foreground">{competicao.endereco}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-sportlink">{competicao.formato}</p>
                  <p className="text-sm text-muted-foreground">Formato</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-sportlink">{competicao.minParticipantes}</p>
                  <p className="text-sm text-muted-foreground">Mín. participantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-sportlink">
                    {competicao.permitirEquipes ? `${competicao.tamanhoEquipe} por equipe` : "Individual"}
                  </p>
                  <p className="text-sm text-muted-foreground">Modalidade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Conteúdo */}
          <Tabs defaultValue="regras" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="regras">Regras</TabsTrigger>
              <TabsTrigger value="participantes">Participantes</TabsTrigger>
              <TabsTrigger value="partidas" disabled={competicao.status === "inscricoes"}>
                Partidas
              </TabsTrigger>
              <TabsTrigger value="resultados" disabled={competicao.status !== "finalizado"}>
                Resultados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regras" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Regras e Requisitos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {competicao.regras.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Regras da competição:</h4>
                      <ul className="space-y-1">
                        {competicao.regras.map((regra, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{regra}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {competicao.requisitos.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Requisitos para participação:</h4>
                      <ul className="space-y-1">
                        {competicao.requisitos.map((requisito, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{requisito}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {competicao.taxaInscricao && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Taxa de inscrição:</strong> {competicao.taxaInscricao}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participantes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Participantes Inscritos</CardTitle>
                  <CardDescription>
                    {competicao.participantes} de {competicao.vagas} vagas preenchidas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {participantes.map((participante) => (
                      <div key={participante.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>
                            {participante.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{participante.nome}</p>
                          {participante.equipe && (
                            <p className="text-sm text-muted-foreground">{participante.equipe}</p>
                          )}
                        </div>
                        {participante.pontos !== undefined && (
                          <div className="text-right">
                            <p className="font-bold text-primary-sportlink">{participante.pontos}</p>
                            <p className="text-xs text-muted-foreground">pontos</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partidas" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Partidas</CardTitle>
                  <CardDescription>Acompanhe o andamento das partidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {partidas.map((partida) => (
                      <div key={partida.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{partida.fase}</Badge>
                          <Badge variant={partida.status === "finalizada" ? "default" : "secondary"}>
                            {partida.status === "finalizada"
                              ? "Finalizada"
                              : partida.status === "andamento"
                                ? "Em andamento"
                                : "Agendada"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-center">
                            <p className="font-medium">{partida.participante1}</p>
                            {partida.resultado1 !== undefined && (
                              <p className="text-2xl font-bold text-primary-sportlink">{partida.resultado1}</p>
                            )}
                          </div>
                          <div className="px-4">
                            <span className="text-muted-foreground">VS</span>
                          </div>
                          <div className="flex-1 text-center">
                            <p className="font-medium">{partida.participante2}</p>
                            {partida.resultado2 !== undefined && (
                              <p className="text-2xl font-bold text-primary-sportlink">{partida.resultado2}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-center mt-2">
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(partida.data), "PPP 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resultados" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Classificação Final
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {participantes
                      .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
                      .map((participante, index) => (
                        <div key={participante.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-sportlink/10 text-primary-sportlink font-bold">
                            {index + 1}
                          </div>
                          <Avatar>
                            <AvatarImage src={participante.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {participante.nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{participante.nome}</p>
                            {participante.equipe && (
                              <p className="text-sm text-muted-foreground">{participante.equipe}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary-sportlink">{participante.pontos}</p>
                            <p className="text-xs text-muted-foreground">pontos</p>
                          </div>
                          {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Card de Inscrição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{competicao.participantes} participantes</span>
                  <span>{competicao.vagas} vagas</span>
                </div>
                <Progress value={progressoInscricoes} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(progressoInscricoes)}% das vagas preenchidas
                </p>
              </div>

              {competicao.status === "inscricoes" && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Inscrições até: {format(new Date(competicao.dataLimiteInscricao), "PPP", { locale: ptBR })}
                  </p>

                  {podeSeInscrever ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full" disabled={isInscrevendo}>
                          {isInscrevendo ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Inscrevendo...
                            </>
                          ) : (
                            "Inscrever-se"
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Inscrição</DialogTitle>
                          <DialogDescription>
                            Você está prestes a se inscrever na competição "{competicao.nome}".
                            {competicao.taxaInscricao && (
                              <span className="block mt-2 font-medium">
                                Taxa de inscrição: {competicao.taxaInscricao}
                              </span>
                            )}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline">Cancelar</Button>
                          <Button onClick={handleInscrever} disabled={isInscrevendo}>
                            {isInscrevendo ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Confirmando...
                              </>
                            ) : (
                              "Confirmar Inscrição"
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : isInscrito ? (
                    <Button className="w-full" disabled>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Inscrito
                    </Button>
                  ) : competicao.participantes >= competicao.vagas ? (
                    <Button className="w-full" disabled>
                      Vagas Esgotadas
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      Inscrições Encerradas
                    </Button>
                  )}
                </div>
              )}

              {competicao.status === "andamento" && (
                <Alert>
                  <Play className="h-4 w-4" />
                  <AlertDescription>
                    A competição está em andamento. Acompanhe as partidas na aba "Partidas".
                  </AlertDescription>
                </Alert>
              )}

              {competicao.status === "finalizado" && (
                <Alert>
                  <Flag className="h-4 w-4" />
                  <AlertDescription>Competição finalizada. Confira os resultados na aba "Resultados".</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Informações do Organizador */}
          <Card>
            <CardHeader>
              <CardTitle>Organizador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {competicao.organizador
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{competicao.organizador}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <Star className="h-3 w-3 fill-muted text-muted" />
                    <span className="text-xs text-muted-foreground ml-1">4.2</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                Entrar em contato
              </Button>
            </CardContent>
          </Card>

          {/* Premiação */}
          {competicao.premio && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Premiação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center font-medium text-primary-sportlink">{competicao.premio}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
