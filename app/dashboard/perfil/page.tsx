"use client"

import { useState, useEffect } from "react"
import { Calendar, Edit, MapPin, Settings, Trophy, Camera, Mail, Phone, Globe, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PerfilPage() {
  const [activeTab, setActiveTab] = useState("atividades")
  const [editMode, setEditMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const usuario = {
    nome: "Carlos Silva",
    username: "@carlossilva",
    email: "carlos.silva@exemplo.com",
    telefone: "(11) 98765-4321",
    localizacao: "São Paulo, SP",
    esportesFavoritos: ["Futebol", "Basquete", "Tênis"],
    nivel: "Avançado",
    bio: "Apaixonado por esportes e sempre em busca de novos desafios. Jogo futebol desde criança e recentemente comecei a praticar basquete e tênis.",
    avatar: "/placeholder.svg?height=150&width=150",
    website: "carlossilva.com.br",
  }

  const atividades = [
    {
      id: 1,
      tipo: "competicao",
      nome: "Torneio de Futebol Amador",
      data: "15/06/2025",
      local: "Quadra Poliesportiva Central",
      status: "confirmado",
    },
    {
      id: 2,
      tipo: "partida",
      nome: "Partida de Basquete",
      data: "10/06/2025",
      local: "Ginásio Municipal",
      status: "pendente",
    },
    {
      id: 3,
      tipo: "competicao",
      nome: "Copa Basquete 3x3",
      data: "22/06/2025",
      local: "Ginásio Municipal",
      status: "confirmado",
    },
  ]

  const conquistas = [
    {
      id: 1,
      nome: "Campeão - Torneio de Futebol Regional",
      data: "10/03/2025",
      icone: "🏆",
    },
    {
      id: 2,
      nome: "2º Lugar - Campeonato de Basquete 3x3",
      data: "15/02/2025",
      icone: "🥈",
    },
    {
      id: 3,
      nome: "Participação em 10 competições",
      data: "01/01/2025",
      icone: "🎖️",
    },
  ]

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-sportlink/80 to-primary-sportlink/30 relative">
          {editMode && (
            <Button size="sm" variant="secondary" className="absolute right-4 top-4 flex items-center gap-1">
              <Camera className="h-4 w-4" />
              <span>Alterar capa</span>
            </Button>
          )}
        </div>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-4">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                <AvatarFallback>
                  {usuario.nome
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <h2 className="text-2xl font-bold">{usuario.nome}</h2>
              <p className="text-muted-foreground">{usuario.username}</p>
            </div>
            <Button
              className="mt-4 md:mt-0 md:ml-auto flex items-center gap-2"
              variant={editMode ? "default" : "outline"}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? (
                <>
                  <Save className="w-4 h-4" />
                  Salvar alterações
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Editar perfil
                </>
              )}
            </Button>
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" defaultValue={usuario.nome} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input id="username" defaultValue={usuario.username} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={usuario.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue={usuario.telefone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input id="localizacao" defaultValue={usuario.localizacao} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={usuario.website} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nível</Label>
                  <Select defaultValue={usuario.nivel}>
                    <SelectTrigger id="nivel">
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esporte-principal">Esporte principal</Label>
                  <Select defaultValue={usuario.esportesFavoritos[0]}>
                    <SelectTrigger id="esporte-principal">
                      <SelectValue placeholder="Selecione seu esporte principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Futebol">Futebol</SelectItem>
                      <SelectItem value="Basquete">Basquete</SelectItem>
                      <SelectItem value="Vôlei">Vôlei</SelectItem>
                      <SelectItem value="Tênis">Tênis</SelectItem>
                      <SelectItem value="Natação">Natação</SelectItem>
                      <SelectItem value="Corrida">Corrida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea id="bio" rows={4} defaultValue={usuario.bio} />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <p>{usuario.localizacao}</p>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  <p>{usuario.email}</p>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  <p>{usuario.telefone}</p>
                </div>
                {usuario.website && (
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="w-4 h-4 mr-2" />
                    <a
                      href={`https://${usuario.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {usuario.website}
                    </a>
                  </div>
                )}
              </div>
              <p className="text-foreground mb-4">{usuario.bio}</p>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Esportes favoritos:</p>
                <div className="flex flex-wrap gap-2">
                  {usuario.esportesFavoritos.map((esporte, index) => (
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
            </>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="atividades" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Atividades</span>
          </TabsTrigger>
          <TabsTrigger value="conquistas" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            <span>Conquistas</span>
          </TabsTrigger>
          <TabsTrigger value="configuracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="atividades" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximas atividades</CardTitle>
              <CardDescription>Suas atividades agendadas para os próximos dias</CardDescription>
            </CardHeader>
            <CardContent>
              {atividades.length > 0 ? (
                <div className="space-y-4">
                  {atividades.map((atividade) => (
                    <div key={atividade.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="flex items-center mb-1">
                          <Badge
                            variant="outline"
                            className={`mr-2 ${
                              atividade.tipo === "competicao"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            }`}
                          >
                            {atividade.tipo === "competicao" ? "Competição" : "Partida"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${
                              atividade.status === "confirmado"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                            }`}
                          >
                            {atividade.status === "confirmado" ? "Confirmado" : "Pendente"}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{atividade.nome}</h4>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {atividade.data}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {atividade.local}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Você não tem atividades agendadas.</p>
              )}
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  Ver todas as atividades
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="conquistas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Suas conquistas</CardTitle>
              <CardDescription>Troféus e medalhas que você conquistou</CardDescription>
            </CardHeader>
            <CardContent>
              {conquistas.length > 0 ? (
                <div className="space-y-4">
                  {conquistas.map((conquista) => (
                    <div key={conquista.id} className="border rounded-lg p-4 flex items-center">
                      <div className="text-3xl mr-4">{conquista.icone}</div>
                      <div>
                        <h4 className="font-medium">{conquista.nome}</h4>
                        <p className="text-sm text-muted-foreground">{conquista.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Você ainda não tem conquistas.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="configuracoes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da conta</CardTitle>
              <CardDescription>Gerencie suas preferências e configurações de privacidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notif-competicoes">Novas competições</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações sobre novas competições na sua região
                      </p>
                    </div>
                    <Switch id="notif-competicoes" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notif-convites">Convites para partidas</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações quando alguém te convidar para uma partida
                      </p>
                    </div>
                    <Switch id="notif-convites" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notif-mensagens">Mensagens</Label>
                      <p className="text-sm text-muted-foreground">Receba notificações de novas mensagens</p>
                    </div>
                    <Switch id="notif-mensagens" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacidade</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="privacidade-perfil">Perfil público</Label>
                      <p className="text-sm text-muted-foreground">Permitir que outros usuários vejam seu perfil</p>
                    </div>
                    <Switch id="privacidade-perfil" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="privacidade-localizacao">Mostrar localização</Label>
                      <p className="text-sm text-muted-foreground">Mostrar sua localização para outros usuários</p>
                    </div>
                    <Switch id="privacidade-localizacao" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="privacidade-atividades">Atividades públicas</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir que outros usuários vejam suas atividades
                      </p>
                    </div>
                    <Switch id="privacidade-atividades" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Segurança</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Alterar senha
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Configurar autenticação em dois fatores
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conta</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Exportar meus dados
                  </Button>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Excluir minha conta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
