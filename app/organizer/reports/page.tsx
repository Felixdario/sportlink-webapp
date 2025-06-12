"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Calendar, DollarSign, MapPin, Users, Target, Download } from "lucide-react"
import { getCourts, getReservations } from "@/lib/data/courts"

export default function ReportsPage() {
  const [courts, setCourts] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCourt, setSelectedCourt] = useState("all")
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

  // Filtrar reservas por período
  const getFilteredReservations = () => {
    const now = new Date()
    const startDate = new Date()

    switch (selectedPeriod) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    let filtered = reservations.filter((r) => new Date(r.date) >= startDate)

    if (selectedCourt !== "all") {
      filtered = filtered.filter((r) => r.courtId === selectedCourt)
    }

    return filtered
  }

  const filteredReservations = getFilteredReservations()
  const confirmedReservations = filteredReservations.filter((r) => r.status === "confirmed")

  // Cálculos de estatísticas
  const totalRevenue = confirmedReservations.reduce((sum, r) => sum + r.totalPrice, 0)
  const totalReservations = filteredReservations.length
  const occupancyRate = courts.length > 0 ? (totalReservations / (courts.length * 30)) * 100 : 0
  const averageReservationValue = totalReservations > 0 ? totalRevenue / confirmedReservations.length : 0

  // Dados para gráficos
  const revenueByDay = () => {
    const days = {}
    confirmedReservations.forEach((r) => {
      const date = new Date(r.date).toLocaleDateString("pt-BR")
      days[date] = (days[date] || 0) + r.totalPrice
    })
    return Object.entries(days).slice(-7)
  }

  const reservationsBySport = () => {
    const sports = {}
    filteredReservations.forEach((r) => {
      sports[r.sport] = (sports[r.sport] || 0) + 1
    })
    return Object.entries(sports)
  }

  const reservationsByStatus = () => {
    const status = {}
    filteredReservations.forEach((r) => {
      status[r.status] = (status[r.status] || 0) + 1
    })
    return Object.entries(status)
  }

  const courtPerformance = () => {
    return courts.map((court) => {
      const courtReservations = filteredReservations.filter((r) => r.courtId === court.id)
      const courtRevenue = courtReservations
        .filter((r) => r.status === "confirmed")
        .reduce((sum, r) => sum + r.totalPrice, 0)

      return {
        ...court,
        reservations: courtReservations.length,
        revenue: courtRevenue,
        occupancyRate: (courtReservations.length / 30) * 100,
      }
    })
  }

  const revenueData = revenueByDay()
  const sportsData = reservationsBySport()
  const statusData = reservationsByStatus()
  const performanceData = courtPerformance()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmadas"
      case "pending":
        return "Pendentes"
      case "cancelled":
        return "Canceladas"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho das suas quadras</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="year">Último Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Quadra</label>
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Quadras</SelectItem>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground">{confirmedReservations.length} confirmadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Média das quadras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {averageReservationValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por reserva confirmada</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Receita por Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Receita por Dia
            </CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.map(([date, revenue], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{date}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-sportlink to-rose-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min((revenue / Math.max(...revenueData.map(([, r]) => r))) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">R$ {revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservas por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Reservas por Status
            </CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusData.map(([status, count], index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                    <span className="text-sm">{getStatusText(status)}</span>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Esportes Mais Populares */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Esportes Mais Populares
          </CardTitle>
          <CardDescription>Reservas por modalidade esportiva</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sportsData.map(([sport, count], index) => (
              <div key={index} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary-sportlink">{count}</div>
                <div className="text-sm text-muted-foreground">{sport}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance por Quadra */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Performance por Quadra
          </CardTitle>
          <CardDescription>Análise detalhada de cada quadra</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((court) => (
              <div key={court.id} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{court.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Reservas</p>
                        <p className="font-medium">{court.reservations}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Receita</p>
                        <p className="font-medium">R$ {court.revenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Ocupação</p>
                        <p className="font-medium">{court.occupancyRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avaliação</p>
                        <p className="font-medium">{court.rating} ⭐</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-sportlink to-rose-500 h-2 rounded-full"
                        style={{ width: `${Math.min(court.occupancyRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
