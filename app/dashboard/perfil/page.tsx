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
import { useAuthContext } from "@/hooks/AuthProvider"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Mapeamento de níveis de habilidade
const skillLevelMap: Record<string, string> = {
  "beginner": "Iniciante",
  "intermediate": "Intermediário", 
  "advanced": "Avançado",
  "professional": "Profissional"
}

export default function PerfilPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("atividades")
  const [editMode, setEditMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  // Estado para armazenar os dados do login
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
    telefone: "",
    localizacao: "",
    bio: "",
    website: "",
    nivel: "",
    esportePrincipal: ""
  })

  useEffect(() => {
    setMounted(true)
    
    // Verificar autenticação e carregar dados do usuário
    const auth = localStorage.getItem("isAuthenticated")
    if (auth !== "true") {
      router.push("/login")
      return
    }
    
    // Carregar dados do usuário salvos no login
    try {
      const userDataStr = localStorage.getItem("data")
      if (userDataStr) {
        const parsedUserData = JSON.parse(userDataStr)
        console.log("Dados do usuário carregados:", parsedUserData)
        setUserData(parsedUserData)
        
        // Salvar o nome do usuário no localStorage para consistência com o header
        if (parsedUserData.nome && !localStorage.getItem("userName")) {
          localStorage.setItem("userName", parsedUserData.nome)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error)
    }
    
    // Carregar dados do perfil completo caso exista
    try {
      const storedProfile = localStorage.getItem("athleteProfile")
      if (storedProfile) {
        setProfileData(JSON.parse(storedProfile))
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
    }
  }, [router])
  
  // Atualizar o formData quando o usuário ou profileData mudarem
  useEffect(() => {
    // Obter o nome armazenado no localStorage (consistente com o header)
    const storedName = localStorage.getItem("userName");
    
    // Só atualiza quando os estados necessários estiverem disponíveis
    setFormData({
      nome: storedName || userData?.nome || user?.name || "",
      username: storedName ? 
        `@${storedName.toLowerCase().replace(/\s+/g, '')}` : 
        userData?.nome ? 
          `@${userData.nome.toLowerCase().replace(/\s+/g, '')}` : 
          user?.name ? `@${user.name.toLowerCase().replace(/\s+/g, '')}` : "",
      email: userData?.email || user?.email || "",
      telefone: profileData?.phone || "",
      localizacao: profileData ? 
        `${profileData.city}${profileData.state ? `, ${profileData.state}` : ""}` : 
        "",
      bio: profileData?.bio || "",
      website: "",
      nivel: profileData?.skillLevel || "",
      esportePrincipal: profileData?.favoriteSports && profileData.favoriteSports.length > 0 ? 
        profileData.favoriteSports[0] : ""
    })
  }, [user, userData, profileData])
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // Atualizar dados no localStorage (simulando API)
      const updatedProfile = {
        ...profileData,
        bio: formData.bio,
        phone: formData.telefone,
        // Atualizar localização
        city: formData.localizacao.split(',')[0]?.trim() || "",
        state: formData.localizacao.split(',')[1]?.trim() || "",
        skillLevel: formData.nivel,
        favoriteSports: profileData?.favoriteSports || []
      }
      
      // Se houver uma mudança no esporte principal
      if (formData.esportePrincipal && 
          (!updatedProfile.favoriteSports.includes(formData.esportePrincipal))) {
        updatedProfile.favoriteSports = [
          formData.esportePrincipal, 
          ...updatedProfile.favoriteSports.filter((s: string) => s !== formData.esportePrincipal)
        ]
      }
      
      // Atualizar o nome do usuário no localStorage para consistência com o header
      if (formData.nome) {
        localStorage.setItem("userName", formData.nome);
      }
      
      localStorage.setItem("athleteProfile", JSON.stringify(updatedProfile))
      
      // Atualizar dados locais
      setProfileData(updatedProfile)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
        variant: "default"
      })
      
      setEditMode(false)
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Obter o nome do usuário do localStorage como fonte principal (mesma fonte que o header)
  const userName = localStorage.getItem("userName") || "Usuário";
  
  // Combinar dados da autenticação com dados de perfil completo
  const usuario = {
    nome: userName || userData?.nome || user?.name || "Usuário",
    username: `@${(userName || userData?.nome || user?.name || "usuario").toLowerCase().replace(/\s+/g, '')}`,
    email: userData?.email || user?.email || "",
    telefone: profileData?.phone || "(Não informado)",
    localizacao: profileData ? 
      `${profileData.city}${profileData.state ? `, ${profileData.state}` : ""}` : 
      "(Não informada)",
    esportesFavoritos: profileData?.favoriteSports || ["Adicione seus esportes favoritos"],
    nivel: profileData?.skillLevel ? 
      skillLevelMap[profileData.skillLevel] || "Não informado" : 
      "Não informado",
    bio: profileData?.bio || "Edite seu perfil para adicionar uma biografia.",
    avatar: "/placeholder-user.jpg",
    website: "",
    id: userData?.id || user?.id
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
  
  // Verificar se o usuário está autenticado e se os dados estão sendo carregados
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  // Verificar se temos pelo menos o nome do usuário no localStorage
  const hasUserName = !!localStorage.getItem("userName")
  
  // Mostrar loading enquanto os dados estão sendo carregados, apenas se não tivermos nenhum dado
  if (mounted && (!userData && !hasUserName && isAuthenticated)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-pulse rounded-full h-32 w-32 bg-muted"></div>
            <div className="animate-pulse h-8 w-48 bg-muted rounded"></div>
            <div className="animate-pulse h-4 w-32 bg-muted rounded"></div>
            <p className="text-muted-foreground text-center">Carregando dados do perfil...</p>
          </div>
        </Card>
      </div>
    )
  }
  
  // Se não estiver autenticado e já estiver montado, mostrar mensagem ou redirecionar
  if (mounted && !isAuthenticated) {
    router.push("/login")
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
        <CardContent className="px-6 pb-6 pt-20"> {/* Adicionado padding-top para dar mais espaço */}
          <div className="flex flex-col md:flex-row items-start md:items-center -mt-24 mb-4"> {/* Ajustado margin-top e alinhamento */}
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                {usuario.avatar ? (
                  <AvatarImage src={usuario.avatar} alt={usuario.nome} />
                ) : null}
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
              {(user?.isEmailVerified || userData?.email_verificado) ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800 mt-1">
                  Email verificado
                </Badge>
              ) : (userData || user) ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800 mt-1">
                  Email não verificado
                </Badge>
              ) : null}
            </div>
            <Button
              className="mt-4 md:mt-0 md:ml-auto flex items-center gap-2"
              variant={editMode ? "default" : "outline"}
              onClick={() => {
                if (editMode) {
                  // Salvar alterações
                  handleSaveProfile();
                } else {
                  setEditMode(true);
                }
              }}
              disabled={loading}
            >
              {editMode ? (
                <>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? "Salvando..." : "Salvar alterações"}
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
                  <Input 
                    id="nome" 
                    value={usuario.nome} 
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    disabled={(user?.id || userData?.id) ? true : false} // Desabilitar edição do nome se for um usuário real
                  />
                  {(user?.id || userData?.id) && <p className="text-xs text-muted-foreground mt-1">Nome não pode ser alterado</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input 
                    id="username" 
                    value={usuario.username} 
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled // Nome de usuário gerado automaticamente
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={usuario.email} 
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={(user?.id || userData?.id) ? true : false} // Desabilitar edição do email se for um usuário real
                  />
                  {(user?.id || userData?.id) && <p className="text-xs text-muted-foreground mt-1">Email não pode ser alterado</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    value={formData.telefone} 
                    onChange={(e) => handleInputChange("telefone", e.target.value)}
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input 
                    id="localizacao" 
                    value={formData.localizacao} 
                    onChange={(e) => handleInputChange("localizacao", e.target.value)}
                    placeholder="Cidade, UF"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={formData.website} 
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="seusite.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nivel">Nível</Label>
                  <Select 
                    value={formData.nivel} 
                    onValueChange={(value) => handleInputChange("nivel", value)}
                  >
                    <SelectTrigger id="nivel">
                      <SelectValue placeholder="Selecione seu nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                      <SelectItem value="professional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="esporte-principal">Esporte principal</Label>
                  <Select 
                    value={formData.esportePrincipal}
                    onValueChange={(value) => handleInputChange("esportePrincipal", value)}
                  >
                    <SelectTrigger id="esporte-principal">
                      <SelectValue placeholder="Selecione seu esporte principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Futebol">Futebol</SelectItem>
                      <SelectItem value="Basquete">Basquete</SelectItem>
                      <SelectItem value="Vôlei">Vôlei</SelectItem>
                      <SelectItem value="Tênis">Tênis</SelectItem>
                      <SelectItem value="Padel">Padel</SelectItem>
                      <SelectItem value="Squash">Squash</SelectItem>
                      <SelectItem value="Futsal">Futsal</SelectItem>
                      <SelectItem value="Handebol">Handebol</SelectItem>
                      <SelectItem value="Beach Tennis">Beach Tennis</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                      <SelectItem value="Ping Pong">Ping Pong</SelectItem>
                      <SelectItem value="Natação">Natação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea 
                  id="bio" 
                  rows={4} 
                  value={formData.bio} 
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Conte sobre você, seus interesses esportivos..."
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-4 mb-4">
                {usuario.localizacao && usuario.localizacao !== "(Não informada)" && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <p>{usuario.localizacao}</p>
                  </div>
                )}
                {usuario.email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    <p>{usuario.email}</p>
                  </div>
                )}
                {usuario.telefone && usuario.telefone !== "(Não informado)" && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    <p>{usuario.telefone}</p>
                  </div>
                )}
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
                
                {/* Mostrar nível se estiver disponível */}
                {usuario.nivel && usuario.nivel !== "Não informado" && (
                  <div className="flex items-center text-muted-foreground">
                    <Trophy className="w-4 h-4 mr-2" />
                    <p>Nível: {usuario.nivel}</p>
                  </div>
                )}
              </div>
              
              <p className="text-foreground mb-4">
                {usuario.bio || (
                  <span className="text-muted-foreground italic">
                    Clique em "Editar perfil" para adicionar sua biografia.
                  </span>
                )}
              </p>
              
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Esportes favoritos:</p>
                <div className="flex flex-wrap gap-2">
                  {usuario.esportesFavoritos && usuario.esportesFavoritos.length > 0 && 
                   usuario.esportesFavoritos[0] !== "Adicione seus esportes favoritos" ? (
                    usuario.esportesFavoritos.map((esporte, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-primary-sportlink/10 text-primary-sportlink border-primary-sportlink/20"
                      >
                        {esporte}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">
                      Edite seu perfil para adicionar esportes favoritos.
                    </span>
                  )}
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
