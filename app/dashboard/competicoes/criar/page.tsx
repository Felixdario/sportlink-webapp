"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Trophy, Upload, MapPin, Plus, Minus, AlertCircle, Loader2 } from "lucide-react"
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
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Importar o componente de seleção de localização no mapa dinamicamente
const SelecionarLocalizacaoMapa = dynamic(() => import("@/components/selecionar-localizacao-mapa"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted rounded-lg overflow-hidden h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-primary-sportlink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-medium mb-2">Carregando mapa</h3>
        <p className="text-muted-foreground max-w-md mx-auto">Estamos carregando o mapa para seleção de localização.</p>
      </div>
    </div>
  ),
})

export default function CriarCompeticaoPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMapaAberto, setIsMapaAberto] = useState(false)

  // Dados do formulário
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [esporte, setEsporte] = useState("")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()
  const [local, setLocal] = useState("")
  const [endereco, setEndereco] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [vagas, setVagas] = useState("16")
  const [premio, setPremio] = useState("")
  const [taxaInscricao, setTaxaInscricao] = useState("")
  const [regras, setRegras] = useState<string[]>([""])
  const [isPublica, setIsPublica] = useState(true)
  const [inscricoesAutomaticas, setInscricoesAutomaticas] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleSelecionarLocalizacao = (lat: number, lng: number, endereco: string) => {
    setLatitude(lat)
    setLongitude(lng)
    if (endereco) setEndereco(endereco)
    setIsMapaAberto(false)
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

    if (!dataInicio) {
      setError("A data de início é obrigatória")
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
      // Simulando envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirecionar para a página de competições
      router.push("/dashboard/competicoes")
    } catch (err) {
      setError("Ocorreu um erro ao criar a competição. Tente novamente.")
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local</CardTitle>
                <CardDescription>Informe onde a competição será realizada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="local">Nome do local *</Label>
                  <Input
                    id="local"
                    placeholder="Ex: Quadra Poliesportiva Central"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço completo *</Label>
                  <Input
                    id="endereco"
                    placeholder="Ex: Av. Principal, 123 - Centro"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Dialog open={isMapaAberto} onOpenChange={setIsMapaAberto}>
                  <DialogTrigger asChild>
                    <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        {latitude && longitude
                          ? "Localização selecionada. Clique para alterar."
                          : "Selecione a localização no mapa"}
                      </p>
                      <Button variant="outline" size="sm" type="button" disabled={isLoading}>
                        {latitude && longitude ? "Alterar localização" : "Abrir mapa"}
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Selecionar localização</DialogTitle>
                      <DialogDescription>
                        Clique no mapa para selecionar a localização exata da competição
                      </DialogDescription>
                    </DialogHeader>
                    <div className="h-[500px]">
                      <SelecionarLocalizacaoMapa
                        onSelectLocation={handleSelecionarLocalizacao}
                        initialLocation={
                          latitude && longitude ? { lat: latitude, lng: longitude } : { lat: -23.5505, lng: -46.6333 }
                        }
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regras e premiação</CardTitle>
                <CardDescription>Defina as regras e premiações da competição</CardDescription>
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
                    placeholder="Ex: R$ 50,00 por equipe"
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Imagem da competição</CardTitle>
                <CardDescription>Adicione uma imagem para sua competição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Arraste uma imagem ou clique para fazer upload</p>
                  <p className="text-xs text-muted-foreground mb-4">PNG, JPG ou JPEG (máx. 5MB)</p>
                  <Button variant="outline" size="sm" type="button" disabled={isLoading}>
                    Selecionar arquivo
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                  className="w-full"
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
