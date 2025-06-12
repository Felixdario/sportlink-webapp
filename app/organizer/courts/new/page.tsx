"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MapPin, Upload, X, Save } from "lucide-react"
import { addCourt } from "@/lib/data/courts"

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
]

const availableAmenities = [
  "Vestiário",
  "Estacionamento",
  "Iluminação LED",
  "Arquibancada",
  "Lanchonete",
  "Wi-Fi",
  "Ar Condicionado",
  "Chuveiro",
  "Armários",
  "Som Ambiente",
  "Placar Eletrônico",
  "Cobertura",
]

export default function NewCourtPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    neighborhood: "",
    price: "",
    sports: [] as string[],
    amenities: [] as string[],
    images: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSportToggle = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport) ? prev.sports.filter((s) => s !== sport) : [...prev.sports, sport],
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newCourt = addCourt({
        name: formData.name,
        description: formData.description,
        address: formData.address,
        neighborhood: formData.neighborhood,
        sports: formData.sports,
        price: Number.parseFloat(formData.price),
        images: formData.images.length > 0 ? formData.images : ["/images/features/map-courts.png"],
        amenities: formData.amenities,
        organizerId: "org1",
        organizerName: "João Silva",
        rating: 0,
        totalReviews: 0,
        latitude: -23.5505,
        longitude: -46.6333,
        isActive: true,
      })

      router.push("/organizer/courts")
    } catch (error) {
      console.error("Erro ao cadastrar quadra:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Cadastrar Nova Quadra</h1>
          <p className="text-muted-foreground">Preencha as informações da sua quadra esportiva</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais da quadra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Quadra *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: Quadra Poliesportiva Central"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço por Hora (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="80.00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva sua quadra, suas características e diferenciais..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </CardTitle>
              <CardDescription>Endereço da quadra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Endereço Completo *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Av. Principal, 123 - Centro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  placeholder="Centro"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Esportes */}
          <Card>
            <CardHeader>
              <CardTitle>Esportes Disponíveis</CardTitle>
              <CardDescription>Selecione os esportes que podem ser praticados na quadra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableSports.map((sport) => (
                  <div key={sport} className="flex items-center space-x-2">
                    <Checkbox
                      id={sport}
                      checked={formData.sports.includes(sport)}
                      onCheckedChange={() => handleSportToggle(sport)}
                    />
                    <Label htmlFor={sport} className="text-sm">
                      {sport}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.sports.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Esportes selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.sports.map((sport) => (
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
            </CardContent>
          </Card>

          {/* Comodidades */}
          <Card>
            <CardHeader>
              <CardTitle>Comodidades</CardTitle>
              <CardDescription>Selecione as comodidades disponíveis na quadra</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.amenities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Comodidades selecionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Imagens da Quadra
              </CardTitle>
              <CardDescription>Adicione fotos da sua quadra (opcional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Arraste e solte suas imagens aqui</p>
                <p className="text-sm text-muted-foreground mb-4">ou</p>
                <Button type="button" variant="outline">
                  Selecionar Arquivos
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Formatos aceitos: JPG, PNG, WebP (máx. 5MB cada)</p>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col md:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || !formData.name || !formData.address || !formData.neighborhood || !formData.price
              }
              className="bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cadastrar Quadra
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
