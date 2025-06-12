"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Mail, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { getCourts, getReservations } from "@/lib/data/courts"

export default function SchedulePage() {
  const [courts, setCourts] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [filteredReservations, setFilteredReservations] = useState<any[]>([])
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const organizerId = "org1"
    const courtsData = getCourts(organizerId)
    const reservationsData = getReservations(organizerId)

    setCourts(courtsData)
    setReservations(reservationsData)
    setFilteredReservations(reservationsData)
  }, [])

  useEffect(() => {
    let filtered = reservations

    if (selectedCourt !== "all") {
      filtered = filtered.filter((r) => r.courtId === selectedCourt)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus)
    }

    setFilteredReservations(filtered)
  }, [reservations, selectedCourt, selectedStatus])

  const getWeekDays = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day

    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }

    return week
  }

  const weekDays = getWeekDays(currentWeek)

  const getReservationsForDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredReservations.filter((r) => r.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() - 7)
    setCurrentWeek(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + 7)
    setCurrentWeek(newDate)
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const timeSlots: string[] = []
  for (let hour = 12; hour <= 23; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`)
  }

  const getReservationForTimeSlot = (date: Date, timeSlot: string) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredReservations.find((r) => {
      if (r.date !== dateStr) return false
      const startHour = Number.parseInt(r.startTime.split(":")[0])
      const endHour = Number.parseInt(r.endTime.split(":")[0])
      const slotHour = Number.parseInt(timeSlot.split(":")[0])
      return slotHour >= startHour && slotHour < endHour
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda de Reservas</h1>
          <p className="text-muted-foreground">Visualize e gerencie todas as reservas das suas quadras</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendário
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <Eye className="h-4 w-4 mr-2" />
            Lista
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Quadra</label>
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as quadras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as quadras</SelectItem>
                  {courts.map((court) => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="confirmed">Confirmadas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "calendar" ? (
        <>
          {/* Navegação da Semana */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda Semanal por Horário
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Hoje
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                {weekDays[0].toLocaleDateString("pt-BR")} - {weekDays[6].toLocaleDateString("pt-BR")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Cabeçalho dos dias */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-2 text-center font-medium text-sm">Horário</div>
                {weekDays.map((day, index) => {
                  const isToday = day.toDateString() === new Date().toDateString()
                  return (
                    <div
                      key={index}
                      className={`p-2 text-center border rounded-lg ${
                        isToday ? "border-primary-sportlink bg-primary-sportlink/5" : ""
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {day.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase()}
                      </p>
                      <p className={`text-lg font-bold ${isToday ? "text-primary-sportlink" : ""}`}>{day.getDate()}</p>
                    </div>
                  )
                })}
              </div>

              {/* Grade de horários */}
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 gap-2">
                    <div className="p-2 text-center text-sm font-medium bg-muted rounded">{timeSlot}</div>
                    {weekDays.map((day, dayIndex) => {
                      const dateStr = day.toISOString().split("T")[0]
                      const reservation = getReservationForTimeSlot(day, timeSlot)
                      const mockReservation = filteredReservations.find(
                        (r) => r.date === dateStr && r.startTime === timeSlot
                      )
                      return (
                        <div key={dayIndex} className="p-1">
                          {reservation ? (
                            <div
                              className={`p-2 h-[133px] rounded text-xs border ${getStatusColor(reservation.status)}`}
                              title={`${reservation.courtName} - ${reservation.userName} - ${reservation.sport}`}
                            >
                              <div className="font-medium truncate">{reservation.userName}</div>
                              <div className="text-xs opacity-75 truncate">{reservation.sport}</div>
                              <div className="text-xs opacity-75">{reservation.courtName}</div>
                              <div className="text-xs opacity-75">
                                {reservation.startTime}-{reservation.endTime}
                              </div>
                              <div className="text-xs font-semibold text-right mt-1">
                                R$ {reservation.totalPrice}
                              </div>
                            </div>
                          ) : mockReservation ? (
                            <div
                              className={`p-2 rounded h-[133px] text-xs border ${getStatusColor(mockReservation.status)}`}
                              title={`${mockReservation.courtName} - ${mockReservation.userName} - ${mockReservation.sport}`}
                            >
                              <div className="font-medium truncate">{mockReservation.userName}</div>
                              <div className="text-xs opacity-75 truncate">{mockReservation.sport}</div>
                              <div className="text-xs opacity-75">{mockReservation.courtName}</div>
                              <div className="text-xs opacity-75">
                                {mockReservation.startTime}-{mockReservation.endTime}
                              </div>
                              <div className="text-xs font-semibold text-right mt-1">
                                R$ {mockReservation.totalPrice}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 h-[133px] border border-dashed border-gray-200 rounded opacity-50"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Legenda */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30"></div>
                  <span className="text-xs">Confirmada</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
                  <span className="text-xs">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30"></div>
                  <span className="text-xs">Cancelada</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Lista Detalhada */
        <Card>
          <CardHeader>
            <CardTitle>Todas as Reservas</CardTitle>
            <CardDescription>Lista completa das reservas filtradas</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReservations.length > 0 ? (
              <div className="space-y-4">
                {filteredReservations
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{reservation.courtName}</h3>
                            <Badge className={getStatusColor(reservation.status)}>
                              {getStatusText(reservation.status)}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{reservation.userName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{reservation.userEmail}</span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(reservation.date).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {reservation.startTime} - {reservation.endTime}
                                </span>
                              </div>
                            </div>
                          </div>

                          {reservation.notes && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Observações:</strong> {reservation.notes}
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold">R$ {reservation.totalPrice}</p>
                          <p className="text-sm text-muted-foreground">{reservation.sport}</p>
                          <p className="text-sm text-muted-foreground">{reservation.duration}h</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma reserva encontrada</h3>
                <p className="text-muted-foreground">Não há reservas que correspondam aos filtros selecionados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
