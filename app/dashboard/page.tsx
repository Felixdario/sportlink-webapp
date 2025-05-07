import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Trophy, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const proximasAtividades = [
    {
      id: 1,
      tipo: "competicao",
      nome: "Torneio de Futebol Amador",
      data: "15/06/2025",
      local: "Quadra Poliesportiva Central",
      status: "confirmado",
    },
    {
      id: 2,
      tipo: "partida",
      nome: "Partida de Basquete",
      data: "10/06/2025",
      local: "Ginásio Municipal",
      status: "pendente",
    },
  ]

  const quadrasProximas = [
    {
      id: 1,
      nome: "Quadra Poliesportiva Central",
      endereco: "Av. Principal, 123 - Centro",
      distancia: "1.2 km",
      esportes: ["Futebol", "Basquete", "Vôlei"],
    },
    {
      id: 2,
      nome: "Complexo Esportivo Municipal",
      endereco: "Rua das Flores, 456 - Jardim",
      distancia: "2.5 km",
      esportes: ["Tênis", "Futebol", "Natação"],
    },
    {
      id: 3,
      nome: "Arena Esportiva Zona Sul",
      endereco: "Av. Sul, 789 - Zona Sul",
      distancia: "3.8 km",
      esportes: ["Futsal", "Handebol", "Basquete"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bem-vindo ao SportLink</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quadras próximas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Em um raio de 5km</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Competições ativas</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Disponíveis para participação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Próximas atividades</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Nos próximos 7 dias</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Atletas conectados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Na sua região</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Próximas atividades</CardTitle>
            <CardDescription>Suas atividades agendadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            {proximasAtividades.length > 0 ? (
              <div className="space-y-4">
                {proximasAtividades.map((atividade) => (
                  <div key={atividade.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center mb-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full mr-2 ${
                            atividade.tipo === "competicao"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          }`}
                        >
                          {atividade.tipo === "competicao" ? "Competição" : "Partida"}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            atividade.status === "confirmado"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          }`}
                        >
                          {atividade.status === "confirmado" ? "Confirmado" : "Pendente"}
                        </span>
                      </div>
                      <h4 className="font-medium">{atividade.nome}</h4>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {atividade.data}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {atividade.local}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Você não tem atividades agendadas.</p>
            )}
            <div className="mt-4">
              <Link href="/dashboard/competicoes">
                <Button variant="outline" className="w-full">
                  Ver todas as atividades
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quadras próximas a você</CardTitle>
            <CardDescription>Quadras disponíveis na sua região</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quadrasProximas.map((quadra) => (
                <div key={quadra.id} className="border rounded-lg p-4">
                  <h4 className="font-medium">{quadra.nome}</h4>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <p>{quadra.endereco}</p>
                    <span className="mx-2">•</span>
                    <p>{quadra.distancia}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {quadra.esportes.map((esporte, index) => (
                      <span
                        key={index}
                        className="bg-primary-sportlink/10 text-primary-sportlink text-xs px-2 py-1 rounded-full"
                      >
                        {esporte}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/quadras">
                <Button variant="outline" className="w-full">
                  Ver todas as quadras
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
