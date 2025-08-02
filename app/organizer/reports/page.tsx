"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, DollarSign, Calendar, Users, Trophy, Download, Filter } from "lucide-react"
import { getCourts, getReservations } from "@/lib/data/courts"

export default function ReportsPage() {
  const [courts, setCourts] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [timeFilter, setTimeFilter] = useState("month")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const organizerId = "org1"
    setCourts(getCourts(organizerId))
    setReservations(getReservations(organizerId))
  }, [])

  if (!mounted) {
    return null
  }

  const confirmedReservations = reservations.filter((r) => r.status === "confirmed")
  const totalRevenue = confirmedReservations.reduce((sum, r) => sum + r.totalPrice, 0)
  const totalReservations = confirmedReservations.length
  const averageReservationValue = totalReservations > 0 ? totalRevenue / totalReservations : 0

  // Estatísticas por esporte
  const sportStats = confirmedReservations.reduce(
    (acc, reservation) => {
      const sport = reservation.sport
      if (!acc[sport]) {
        acc[sport] = { count: 0, revenue: 0 }
      }
      acc[sport].count += 1
      acc[sport].revenue += reservation.totalPrice
      return acc
    },
    {} as Record<string, { count: number; revenue: number }>,
  )

  const topSports = Object.entries(sportStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)

  // Performance por quadra
  const courtPerformance = courts
    .map((court) => {
      const courtReservations = confirmedReservations.filter((r) => r.courtId === court.id)
      const revenue = courtReservations.reduce((sum, r) => sum + r.totalPrice, 0)
      return {
        ...court,
        reservationCount: courtReservations.length,
        revenue,
        occupancyRate: Math.min((courtReservations.length / 30) * 100, 100), // Simulado
      }
    })
    .sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Relatórios</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu negócio</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageReservationValue.toFixed(2)}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Esportes Mais Populares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Esportes Mais Populares
            </CardTitle>
            <CardDescription>Ranking por número de reservas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSports.map(([sport, stats], index) => (
                <div key={sport} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-sportlink to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{sport}</h4>
                      <p className="text-sm text-muted-foreground">{stats.count} reservas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">R$ {stats.revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {((stats.count / totalReservations) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance por Quadra */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance por Quadra
            </CardTitle>
            <CardDescription>Receita e ocupação das suas quadras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courtPerformance.map((court) => (
                <div key={court.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{court.name}</h4>
                    <Badge variant={court.isActive ? "default" : "secondary"}>
                      {court.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Reservas</p>
                      <p className="font-medium">{court.reservationCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Receita</p>
                      <p className="font-medium text-green-600">R$ {court.revenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ocupação</p>
                      <p className="font-medium">{court.occupancyRate.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-sportlink to-rose-500 h-2 rounded-full"
                        style={{ width: `${court.occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Receita (Simulado) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Receita
          </CardTitle>
          <CardDescription>Receita ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 p-4">
            {[120, 150, 180, 200, 170, 220, 250].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="bg-gradient-to-t from-primary-sportlink to-rose-500 rounded-t-sm min-w-8"
                  style={{ height: `${(value / 250) * 200}px` }}
                />
                <span className="text-xs text-muted-foreground">
                  {new Date(2024, 11, index + 9).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
