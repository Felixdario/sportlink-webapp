"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ChevronLeft, ChevronRight, Filter, User, MapPin } from "lucide-react"
import { getCourts, getReservations } from "@/lib/data/courts"

const timeSlots = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
]

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export default function SchedulePage() {
  const [courts, setCourts] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [selectedCourt, setSelectedCourt] = useState<string>("all")
  const [currentDate, setCurrentDate] = useState(new Date())
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

  const filteredReservations =
    selectedCourt === "all" ? reservations : reservations.filter((r) => r.courtId === selectedCourt)

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentDate)

  const getReservationForSlot = (date: Date, time: string, courtId?: string) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredReservations.find(
      (r) => r.date === dateStr && r.startTime === time && (!courtId || r.courtId === courtId),
    )
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agenda</h1>
          <p className="text-muted-foreground">Gerencie suas reservas e horários</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedCourt} onValueChange={setSelectedCourt}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
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

      {/* Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Hoje
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header with days */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-4 font-medium text-center border-r">Horário</div>
                {weekDates.map((date, index) => (
                  <div key={index} className="p-4 text-center border-r last:border-r-0">
                    <div className="font-medium">{weekDays[index]}</div>
                    <div className="text-sm text-muted-foreground">{date.getDate().toString().padStart(2, "0")}</div>
                  </div>
                ))}
              </div>

              {/* Time slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-3 text-center border-r font-medium text-sm">{time}</div>
                  {weekDates.map((date, dayIndex) => {
                    const reservation = getReservationForSlot(date, time)
                    return (
                      <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[60px]">
                        {reservation ? (
                          <div className={`p-2 rounded-md border text-xs ${getStatusColor(reservation.status)}`}>
                            <div className="font-medium truncate">{reservation.userName}</div>
                            <div className="truncate">{reservation.sport}</div>
                            <div className="truncate">{reservation.courtName}</div>
                          </div>
                        ) : (
                          <div className="h-full opacity-50 hover:opacity-100 hover:bg-muted/50 rounded-md transition-all cursor-pointer" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reservas de Hoje
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReservations
              .filter((r) => r.date === new Date().toISOString().split("T")[0])
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border rounded-lg mb-3 last:mb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{reservation.userName}</h4>
                      <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                        {reservation.status === "confirmed" ? "Confirmada" : "Pendente"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {reservation.courtName}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reservation.sport} • R$ {reservation.totalPrice}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm">
                      <User className="h-3 w-3 mr-1" />
                      Contato
                    </Button>
                  </div>
                </div>
              ))}
            {filteredReservations.filter((r) => r.date === new Date().toISOString().split("T")[0]).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma reserva para hoje</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Reservas
            </CardTitle>
            <CardDescription>Reservas dos próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredReservations
              .filter((r) => new Date(r.date) > new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border rounded-lg mb-3 last:mb-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{reservation.userName}</h4>
                      <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                        {reservation.status === "confirmed" ? "Confirmada" : "Pendente"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{new Date(reservation.date).toLocaleDateString("pt-BR")}</span>
                      <span>
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reservation.courtName} • {reservation.sport}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">R$ {reservation.totalPrice}</p>
                  </div>
                </div>
              ))}
            {filteredReservations.filter((r) => new Date(r.date) > new Date()).length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma reserva próxima</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
