"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createCompeticao } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Trophy, Upload, MapPin, Plus, Minus, AlertCircle, Loader2, Search, Check } from "lucide-react"
import { getCourts } from "@/lib/data/courts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import format from "date-fns/format"
import ptBR from "date-fns/locale/pt-BR"
import { cn } from "@/lib/utils"

export default function CriarCompeticaoPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isQuadraDialogAberto, setIsQuadraDialogAberto] = useState(false)
  const [quadrasDisponiveis, setQuadrasDisponiveis] = useState<any[]>([])
  const [quadraSelecionada, setQuadraSelecionada] = useState<any | null>(null)
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [esporte, setEsporte] = useState("")
  const [categoria, setCategoria] = useState("")
  const [formato, setFormato] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [dataLimiteInscricao, setDataLimiteInscricao] = useState<Date>()
  const [local, setLocal] = useState("")
  const [endereco, setEndereco] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [vagas, setVagas] = useState("16")
  const [minParticipantes, setMinParticipantes] = useState("8")
  const [premio, setPremio] = useState("")
  const [taxaInscricao, setTaxaInscricao] = useState("")
  const [regras, setRegras] = useState<string[]>([""])
  const [requisitos, setRequisitos] = useState<string[]>([""])
  const [isPublica, setIsPublica] = useState(true)
  const [inscricoesAutomaticas, setInscricoesAutomaticas] = useState(true)
  const [permitirEquipes, setPermitirEquipes] = useState(false)
  const [tamanhoEquipe, setTamanhoEquipe] = useState("5")

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
    setLocal(quadra.name)
    setEndereco(quadra.address)
    setLatitude(quadra.latitude)
    setLongitude(quadra.longitude)
    setIsQuadraDialogAberto(false)
  }

  const abrirSeletorQuadras = () => {
    setIsQuadraDialogAberto(true)
  }

  const adicionarRegra = () => {
    setRegras([...regras, ""])
  }

  const removerRegra = (index: number) => {
    const novasRegras = [...regras]
    novasRegras.splice(index, 1)
    setRegras(novasRegras)
  }

  const atualizarRegra = (index: number, valor: string) => {
    const novasRegras = [...regras]
    novasRegras[index] = valor
    setRegras(novasRegras)
  }

  const adicionarRequisito = () => {
    setRequisitos([...requisitos, ""])
  }

  const removerRequisito = (index: number) => {
    const novosRequisitos = [...requisitos]
    novosRequisitos.splice(index, 1)
    setRequisitos(novosRequisitos)
  }

  const atualizarRequisito = (index: number, valor: string) => {
    const novosRequisitos = [...requisitos]
    novosRequisitos[index] = valor
    setRequisitos(novosRequisitos)
  }

  const validarFormulario = () => {
    if (!nome.trim()) {
      setError("O nome da competição é obrigatório")
      return false
    }

    if (!esporte) {
      setError("Selecione um esporte para a competição")
      return false
    }

    if (!categoria) {
      setError("Selecione uma categoria para a competição")
      return false
    }

    if (!formato) {
      setError("Selecione o formato da competição")
      return false
    }

    if (!dataInicio) {
      setError("A data de início é obrigatória")
      return false
    }

    if (!dataLimiteInscricao) {
      setError("A data limite para inscrições é obrigatória")
      return false
    }

    if (dataLimiteInscricao >= dataInicio) {
      setError("A data limite para inscrições deve ser anterior à data de início")
      return false
    }

    if (!local.trim()) {
      setError("O local da competição é obrigatório")
      return false
    }

    if (!endereco.trim()) {
      setError("O endereço do local é obrigatório")
      return false
    }

    if (!vagas || Number.parseInt(vagas) <= 0) {
      setError("O número de vagas deve ser maior que zero")
      return false
    }

    if (!minParticipantes || Number.parseInt(minParticipantes) <= 0) {
      setError("O número mínimo de participantes deve ser maior que zero")
      return false
    }

    if (Number.parseInt(minParticipantes) > Number.parseInt(vagas)) {
      setError("O número mínimo de participantes não pode ser maior que o número de vagas")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validarFormulario()) {
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para API
      const competicaoData = {
        nome,
        descricao,
        esporte,
        categoria,
        formato,
        dataInicio: dataInicio?.toISOString() || "",
        dataFim: dataFim?.toISOString(),
        dataLimiteInscricao: dataLimiteInscricao?.toISOString() || "",
        local,
        endereco,
        latitude,
        longitude,
        vagas: Number.parseInt(vagas),
        minParticipantes: Number.parseInt(minParticipantes),
        premio,
        taxaInscricao,
        regras: regras.filter((r) => r.trim()),
        requisitos: requisitos.filter((r) => r.trim()),
        isPublica,
        inscricoesAutomaticas,
        permitirEquipes,
        tamanhoEquipe: permitirEquipes ? Number.parseInt(tamanhoEquipe) : null,
        organizador_id: 1 // ID fixo para testes, em produção viria de um contexto de autenticação
      };

      // Para debug: mostra os dados que serão enviados
      console.log("Enviando dados da competição:", competicaoData);

      // Tentar criar a competição na API
      try {
        const responseData = await createCompeticao(competicaoData);
        console.log("Competição criada com sucesso:", responseData);
        
        // Identificar o ID da competição criada
        const competicaoId = responseData.id || Date.now();
        
        // Também salvar no localStorage para compatibilidade com o mock atual
        const novaCompeticao = {
          ...competicaoData,
          id: competicaoId,
          participantes: 0,
          status: "inscricoes",
          organizador: "Usuário Atual",
          criadoEm: new Date().toISOString(),
        };
        
        const competicoes = JSON.parse(localStorage.getItem("competicoes") || "[]");
        competicoes.push(novaCompeticao);
        localStorage.setItem("competicoes", JSON.stringify(competicoes));
        
        // Redirecionar para a página da competição criada com parâmetro de sucesso
        router.push(`/dashboard/competicoes/${competicaoId}?recemCriada=true`);
      } catch (apiError: any) {
        console.error("Erro na API:", apiError);
        
        // Fallback para mock local se a API falhar
        console.log("Usando fallback local...");
        
        const novaCompeticao = {
          ...competicaoData,
          id: Date.now(),
          participantes: 0,
          status: "inscricoes",
          organizador: "Usuário Atual",
          criadoEm: new Date().toISOString(),
        };
        
        const competicoes = JSON.parse(localStorage.getItem("competicoes") || "[]");
        competicoes.push(novaCompeticao);
        localStorage.setItem("competicoes", JSON.stringify(competicoes));
        
        
        // Esperar um pouco para o usuário ver a mensagem
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Redirecionar para a página da competição criada com parâmetro de sucesso
        router.push(`/dashboard/competicoes/${novaCompeticao.id}?recemCriada=true&localMode=true`);
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a competição. Tente novamente.")
      console.error("Erro ao criar competição:", err);
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Trophy className="h-8 w-8 text-primary-sportlink mr-3" />
        <h1 className="text-3xl font-bold">Criar nova competição</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações básicas</CardTitle>
                <CardDescription>Defina os detalhes principais da sua competição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da competição *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Torneio de Futebol Amador"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva os detalhes da sua competição"
                    rows={4}
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="esporte">Esporte *</Label>
                    <Select value={esporte} onValueChange={setEsporte} disabled={isLoading}>
                      <SelectTrigger id="esporte">
                        <SelectValue placeholder="Selecione um esporte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="futebol">Futebol</SelectItem>
                        <SelectItem value="futsal">Futsal</SelectItem>
                        <SelectItem value="basquete">Basquete</SelectItem>
                        <SelectItem value="volei">Vôlei</SelectItem>
                        <SelectItem value="volei-praia">Vôlei de Praia</SelectItem>
                        <SelectItem value="tenis">Tênis</SelectItem>
                        <SelectItem value="natacao">Natação</SelectItem>
                        <SelectItem value="corrida">Corrida</SelectItem>
                        <SelectItem value="ciclismo">Ciclismo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={categoria} onValueChange={setCategoria} disabled={isLoading}>
                      <SelectTrigger id="categoria">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amador">Amador</SelectItem>
                        <SelectItem value="semi-profissional">Semi-profissional</SelectItem>
                        <SelectItem value="profissional">Profissional</SelectItem>
                        <SelectItem value="juvenil">Juvenil</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="formato">Formato *</Label>
                    <Select value={formato} onValueChange={setFormato} disabled={isLoading}>
                      <SelectTrigger id="formato">
                        <SelectValue placeholder="Formato da competição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eliminacao-simples">Eliminação Simples</SelectItem>
                        <SelectItem value="eliminacao-dupla">Eliminação Dupla</SelectItem>
                        <SelectItem value="pontos-corridos">Pontos Corridos</SelectItem>
                        <SelectItem value="grupos-eliminatorias">Grupos + Eliminatórias</SelectItem>
                        <SelectItem value="suico">Sistema Suíço</SelectItem>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vagas">Número de vagas *</Label>
                    <Input
                      id="vagas"
                      type="number"
                      min="2"
                      value={vagas}
                      onChange={(e) => setVagas(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minParticipantes">Mínimo de participantes *</Label>
                    <Input
                      id="minParticipantes"
                      type="number"
                      min="2"
                      value={minParticipantes}
                      onChange={(e) => setMinParticipantes(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="permitirEquipes"
                      checked={permitirEquipes}
                      onCheckedChange={setPermitirEquipes}
                      disabled={isLoading}
                    />
                    <Label htmlFor="permitirEquipes">Permitir equipes</Label>
                  </div>

                  {permitirEquipes && (
                    <div className="space-y-2">
                      <Label htmlFor="tamanhoEquipe">Tamanho da equipe</Label>
                      <Input
                        id="tamanhoEquipe"
                        type="number"
                        min="2"
                        max="11"
                        value={tamanhoEquipe}
                        onChange={(e) => setTamanhoEquipe(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Data de início *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataInicio && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataInicio ? format(dataInicio, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Data de término</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataFim && "text-muted-foreground",
                          )}
                          disabled={isLoading || !dataInicio}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataFim ? format(dataFim, "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataFim}
                          onSelect={setDataFim}
                          disabled={(date) => (dataInicio ? date < dataInicio : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Limite para inscrições *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dataLimiteInscricao && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataLimiteInscricao
                            ? format(dataLimiteInscricao, "PPP", { locale: ptBR })
                            : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dataLimiteInscricao}
                          onSelect={setDataLimiteInscricao}
                          disabled={(date) => (dataInicio ? date >= dataInicio : false)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local</CardTitle>
                <CardDescription>Selecione uma das suas quadras cadastradas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Nome do local *</Label>
                  <div className="relative">
                    <Input
                      id="local"
                      placeholder="Selecione uma quadra cadastrada..."
                      value={local}
                      readOnly
                      onClick={abrirSeletorQuadras}
                      className="cursor-pointer"
                      disabled={isLoading}
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
                        disabled={isLoading}
                      >
                        Alterar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Dialog para seleção de quadras */}
                <Dialog open={isQuadraDialogAberto} onOpenChange={setIsQuadraDialogAberto}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <DialogTitle>Selecionar Quadra</DialogTitle>
                          <DialogDescription>
                            Escolha uma das suas quadras cadastradas para a competição
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
                              variant="outline"
                              size="sm"
                              onClick={() => window.open("/organizer/courts/new", "_blank")}
                              className="mr-2"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Nova Quadra
                            </Button>
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
                          Você precisa cadastrar pelo menos uma quadra para criar uma competição.
                        </p>
                        <div className="space-y-2">
                          <Button
                            onClick={() => window.open("/organizer/courts/new", "_blank")}
                            className="w-full bg-gradient-to-r from-primary-sportlink to-rose-500"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Cadastrar Nova Quadra
                          </Button>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regras e requisitos</CardTitle>
                <CardDescription>Defina as regras e requisitos para participação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="premio">Premiação</Label>
                  <Input
                    id="premio"
                    placeholder="Ex: Troféu + Medalhas + R$ 1.000,00"
                    value={premio}
                    onChange={(e) => setPremio(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxa">Taxa de inscrição</Label>
                  <Input
                    id="taxa"
                    placeholder="Ex: R$ 50,00 por participante"
                    value={taxaInscricao}
                    onChange={(e) => setTaxaInscricao(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Regras da competição</Label>
                    <Button type="button" variant="outline" size="sm" onClick={adicionarRegra} disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar regra
                    </Button>
                  </div>

                  {regras.map((regra, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Regra ${index + 1}`}
                        value={regra}
                        onChange={(e) => atualizarRegra(index, e.target.value)}
                        disabled={isLoading}
                      />
                      {regras.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerRegra(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Requisitos para participação</Label>
                    <Button type="button" variant="outline" size="sm" onClick={adicionarRequisito} disabled={isLoading}>
                      <Plus className="h-4 w-4 mr-1" /> Adicionar requisito
                    </Button>
                  </div>

                  {requisitos.map((requisito, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Requisito ${index + 1}`}
                        value={requisito}
                        onChange={(e) => atualizarRequisito(index, e.target.value)}
                        disabled={isLoading}
                      />
                      {requisitos.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removerRequisito(index)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Defina as configurações da competição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publica">Competição pública</Label>
                    <p className="text-sm text-muted-foreground">Qualquer pessoa pode visualizar esta competição</p>
                  </div>
                  <Switch id="publica" checked={isPublica} onCheckedChange={setIsPublica} disabled={isLoading} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inscricoes">Aprovar inscrições automaticamente</Label>
                    <p className="text-sm text-muted-foreground">Inscrições serão aprovadas sem revisão</p>
                  </div>
                  <Switch
                    id="inscricoes"
                    checked={inscricoesAutomaticas}
                    onCheckedChange={setInscricoesAutomaticas}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publicar</CardTitle>
                <CardDescription>Revise e publique sua competição</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Ao publicar, sua competição ficará visível para todos os usuários e as inscrições serão abertas
                  conforme suas configurações.
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando competição...
                    </>
                  ) : (
                    "Publicar competição"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/dashboard/competicoes")}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
