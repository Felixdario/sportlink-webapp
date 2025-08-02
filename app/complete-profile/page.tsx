"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, Trophy, Clock, Target, Upload, Save, SkipBackIcon as Skip, X } from "lucide-react"

const availableSports = [
  "Futebol",
  "Basquete",
  "Vôlei",
  "Tênis",
  "Padel",
  "Squash",
  "Futsal",
  "Handebol",
  "Beach Tennis",
  "Badminton",
  "Ping Pong",
  "Natação",
]

const skillLevels = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
  { value: "professional", label: "Profissional" },
]

const timeSlots = [
  "06:00 - 08:00",
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
  "20:00 - 22:00",
]

const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export default function CompleteProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Informações Pessoais
    birthDate: "",
    phone: "",
    bio: "",
    profileImage: "",

    // Localização
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Esportes
    favoriteSports: [] as string[],
    skillLevel: "",

    // Disponibilidade
    availableTimes: [] as string[],

    // Objetivos
    goals: "",
  })

  useEffect(() => {
    setMounted(true)
    // Verificar se o usuário está autenticado e é atleta
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userType = localStorage.getItem("userType")

    if (!isAuthenticated) {
      router.push("/login")
    } else if (userType !== "athlete") {
      router.push("/user-type")
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSportToggle = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      favoriteSports: prev.favoriteSports.includes(sport)
        ? prev.favoriteSports.filter((s) => s !== sport)
        : [...prev.favoriteSports, sport],
    }))
  }

  const handleTimeToggle = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes.includes(time)
        ? prev.availableTimes.filter((t) => t !== time)
        : [...prev.availableTimes, time],
    }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Salvar dados do perfil
      localStorage.setItem("athleteProfile", JSON.stringify(formData))
      localStorage.setItem("profileCompleted", "true")

      router.push("/dashboard")
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("profileCompleted", "false")
    router.push("/dashboard")
  }

  if (!mounted) {
    return null
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Conte-nos um pouco sobre você</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você, seus interesses esportivos..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Foto de Perfil</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Clique para adicionar uma foto</p>
                  <Button type="button" variant="outline" size="sm">
                    Selecionar Foto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
              <CardDescription>Onde você está localizado?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    placeholder="00000-000"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Esportes Favoritos
              </CardTitle>
              <CardDescription>Quais esportes você pratica ou tem interesse?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Selecione seus esportes</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableSports.map((sport) => (
                    <div key={sport} className="flex items-center space-x-2">
                      <Checkbox
                        id={sport}
                        checked={formData.favoriteSports.includes(sport)}
                        onCheckedChange={() => handleSportToggle(sport)}
                      />
                      <Label htmlFor={sport} className="text-sm">
                        {sport}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.favoriteSports.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Esportes selecionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.favoriteSports.map((sport) => (
                        <Badge key={sport} variant="secondary">
                          {sport}
                          <button
                            type="button"
                            onClick={() => handleSportToggle(sport)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="skillLevel">Nível de Habilidade Geral</Label>
                <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange("skillLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Disponibilidade e Objetivos
              </CardTitle>
              <CardDescription>Quando você prefere praticar esportes?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Horários Preferenciais</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={formData.availableTimes.includes(time)}
                        onCheckedChange={() => handleTimeToggle(time)}
                      />
                      <Label htmlFor={time} className="text-sm">
                        {time}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="goals" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Objetivos Esportivos
                </Label>
                <Textarea
                  id="goals"
                  placeholder="Quais são seus objetivos? Ex: Melhorar condicionamento, competir, fazer novos amigos..."
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-sportlink/5 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete seu Perfil</h1>
          <p className="text-muted-foreground">Vamos personalizar sua experiência no SportLink</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-muted-foreground">{currentStep}/4</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-sportlink to-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleSkip}>
              <Skip className="h-4 w-4 mr-2" />
              Pular por Agora
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Finalizar
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
