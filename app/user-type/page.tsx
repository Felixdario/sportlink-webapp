"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Building2, Users, MapPin, Calendar, BarChart3, MessageSquare, Star } from "lucide-react"

export default function UserTypePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  const handleUserTypeSelection = (userType: "athlete" | "organizer") => {
    localStorage.setItem("userType", userType)

    if (userType === "athlete") {
      router.push("/complete-profile")
    } else {
      router.push("/organizer/dashboard")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-sportlink/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="h-12 w-12 text-primary-sportlink" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-sportlink to-rose-500">
              SportLink
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bem-vindo ao SportLink!</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Para personalizar sua experiência, nos conte qual é o seu perfil na plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Atleta */}
          <Card className="relative overflow-hidden border-2 hover:border-primary-sportlink/50 transition-all duration-300 hover:shadow-xl group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-sportlink/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-sportlink to-rose-500 rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Sou Atleta</CardTitle>
              <CardDescription className="text-base">
                Quero encontrar quadras, participar de competições e me conectar com outros atletas
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-primary-sportlink" />
                  <span>Encontrar quadras próximas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary-sportlink" />
                  <span>Fazer reservas online</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Trophy className="h-4 w-4 text-primary-sportlink" />
                  <span>Participar de competições</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageSquare className="h-4 w-4 text-primary-sportlink" />
                  <span>Conectar com outros atletas</span>
                </div>
              </div>
              <Button
                onClick={() => handleUserTypeSelection("athlete")}
                className="w-full bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90 text-white font-medium py-3"
              >
                Continuar como Atleta
              </Button>
            </CardContent>
          </Card>

          {/* Organizador */}
          <Card className="relative overflow-hidden border-2 hover:border-primary-sportlink/50 transition-all duration-300 hover:shadow-xl group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-sportlink/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-sportlink to-rose-500 rounded-full flex items-center justify-center">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Tenho Quadras</CardTitle>
              <CardDescription className="text-base">
                Quero cadastrar minhas quadras, gerenciar reservas e aumentar minha receita
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-primary-sportlink" />
                  <span>Cadastrar quadras esportivas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-primary-sportlink" />
                  <span>Gerenciar agenda e reservas</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BarChart3 className="h-4 w-4 text-primary-sportlink" />
                  <span>Acompanhar relatórios financeiros</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Star className="h-4 w-4 text-primary-sportlink" />
                  <span>Receber avaliações dos clientes</span>
                </div>
              </div>
              <Button
                onClick={() => handleUserTypeSelection("organizer")}
                className="w-full bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90 text-white font-medium py-3"
              >
                Continuar como Organizador
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Você poderá alterar seu tipo de conta nas configurações a qualquer momento
          </p>
        </div>
      </div>
    </div>
  )
}
