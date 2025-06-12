"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Search,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
  Star,
  DollarSign,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { getCourts, updateCourt, deleteCourt } from "@/lib/data/courts"

export default function CourtsPage() {
  const [courts, setCourts] = useState<any[]>([])
  const [filteredCourts, setFilteredCourts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const organizerId = "org1"
    const courtsData = getCourts(organizerId)
    setCourts(courtsData)
    setFilteredCourts(courtsData)
  }, [])

  useEffect(() => {
    let filtered = courts

    if (searchTerm) {
      filtered = filtered.filter(
        (court) =>
          court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          court.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
          court.sports.some((sport: string) => sport.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      filtered = filtered.filter((court) => court.isActive === isActive)
    }

    setFilteredCourts(filtered)
  }, [courts, searchTerm, statusFilter])

  const handleToggleStatus = (courtId: string, currentStatus: boolean) => {
    const updatedCourt = updateCourt(courtId, { isActive: !currentStatus })
    if (updatedCourt) {
      setCourts((prev) => prev.map((court) => (court.id === courtId ? updatedCourt : court)))
    }
  }

  const handleDeleteCourt = (courtId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta quadra?")) {
      const success = deleteCourt(courtId)
      if (success) {
        setCourts((prev) => prev.filter((court) => court.id !== courtId))
      }
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Minhas Quadras</h1>
          <p className="text-muted-foreground">Gerencie suas quadras esportivas</p>
        </div>
        <Link href="/organizer/courts/new">
          <Button className="bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Quadra
          </Button>
        </Link>
      </div>

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, bairro ou esporte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Quadras */}
      {filteredCourts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourts.map((court) => (
            <Card key={court.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={court.images[0] || "/placeholder.svg"}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={court.isActive ? "default" : "secondary"}>
                    {court.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{court.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{court.neighborhood}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{court.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(court.id, court.isActive)}>
                        {court.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4 mr-2" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4 mr-2" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCourt(court.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Esportes */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {court.sports.slice(0, 3).map((sport: string) => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                    {court.sports.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{court.sports.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">R$ {court.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">por hora</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{court.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{court.totalReviews} avaliações</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <p className="text-xs text-muted-foreground">reservas/mês</p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || statusFilter !== "all"
                ? "Nenhuma quadra encontrada"
                : "Você ainda não tem quadras cadastradas"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Cadastre sua primeira quadra para começar a receber reservas"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Link href="/organizer/courts/new">
                <Button className="bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeira Quadra
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      {filteredCourts.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Mostrando {filteredCourts.length} de {courts.length} quadras
              </span>
              <span>
                {courts.filter((c) => c.isActive).length} ativas • {courts.filter((c) => !c.isActive).length} inativas
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
