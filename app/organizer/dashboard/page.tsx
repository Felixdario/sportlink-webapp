"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, Clock, Star, Plus } from "lucide-react"
import Link from "next/link"
import { getCourts, getReservations } from "@/lib/data/courts"

export default function OrganizerDashboard() {
  const [courts, setCourts] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simular dados do organizador logado
    const organizerId = "org1"
    setCourts(getCourts(organizerId))
    setReservations(getReservations(organizerId))
  }, [])

  if (!mounted) {
    return null
  }

  const totalRevenue = reservations.filter((r) => r.status === "confirmed").reduce((sum, r) => sum + r.totalPrice, 0)

  const todayReservations = reservations.filter((r) => {
    const today = new Date().toISOString().split("T")[0]
    return r.date === today
  })

  const upcomingReservations = reservations
    .filter((r) => new Date(r.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard do Organizador</h1>
          <p className="text-muted-foreground">Gerencie suas quadras e acompanhe suas reservas</p>
        </div>
        <Link href="/organizer/courts/new">
          <Button className="bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Quadra
          </Button>
        </Link>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Quadras</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courts.length}</div>
            <p className="text-xs text-muted-foreground">{courts.filter((c) => c.isActive).length} ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayReservations.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayReservations.filter((r) => r.status === "confirmed").length} confirmadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courts.length > 0 ? (courts.reduce((sum, c) => sum + c.rating, 0) / courts.length).toFixed(1) : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {courts.reduce((sum, c) => sum + c.totalReviews, 0)} avaliações
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximas Reservas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximas Reservas
            </CardTitle>
            <CardDescription>Suas reservas mais próximas</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{reservation.courtName}</h4>
                        <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                          {reservation.status === "confirmed" ? "Confirmada" : "Pendente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reservation.userName} • {reservation.sport}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.date).toLocaleDateString("pt-BR")} • {reservation.startTime} -{" "}
                        {reservation.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ {reservation.totalPrice}</p>
                    </div>
                  </div>
                ))}
                <Link href="/organizer/schedule">
                  <Button variant="outline" className="w-full">
                    Ver Agenda Completa
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma reserva próxima</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Minhas Quadras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Minhas Quadras
            </CardTitle>
            <CardDescription>Suas quadras cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            {courts.length > 0 ? (
              <div className="space-y-4">
                {courts.slice(0, 3).map((court) => (
                  <div key={court.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={court.images[0] || "/placeholder.svg"}
                      alt={court.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{court.name}</h4>
                      <p className="text-sm text-muted-foreground">{court.neighborhood}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{court.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">R$ {court.price}/h</span>
                      </div>
                    </div>
                    <Badge variant={court.isActive ? "default" : "secondary"}>
                      {court.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                ))}
                <Link href="/organizer/courts">
                  <Button variant="outline" className="w-full">
                    Ver Todas as Quadras
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Você ainda não tem quadras cadastradas</p>
                <Link href="/organizer/courts/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Primeira Quadra
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
