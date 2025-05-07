import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { MapPin, Users, Calendar, Trophy, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-primary-sportlink mr-2" />
            <h1 className="text-2xl font-bold text-primary-sportlink">SportLink</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="mr-2">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Conecte-se com atletas e crie competições</h2>
                <p className="text-xl mb-8 text-muted-foreground">
                  SportLink une pessoas que praticam esportes, facilitando a criação de competições em quadras próximas
                  à sua localização.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#como-funciona">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Saiba mais
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-10">
                <div className="relative">
                  <div className="bg-primary-sportlink/10 dark:bg-primary-sportlink/20 rounded-2xl p-2">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="Pessoas praticando esportes"
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="absolute -bottom-5 -left-5 bg-primary-sportlink text-white p-4 rounded-lg shadow-lg">
                    <Trophy className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="bg-primary-sportlink/10 dark:bg-primary-sportlink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary-sportlink" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Encontre quadras</h3>
                <p className="text-muted-foreground text-center">
                  Descubra quadras próximas a você para praticar seu esporte favorito.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="bg-primary-sportlink/10 dark:bg-primary-sportlink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-sportlink" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Conecte-se</h3>
                <p className="text-muted-foreground text-center">
                  Encontre pessoas com interesses esportivos semelhantes aos seus.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="bg-primary-sportlink/10 dark:bg-primary-sportlink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-primary-sportlink" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Agende partidas</h3>
                <p className="text-muted-foreground text-center">Crie eventos e convide outros usuários para jogar.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="bg-primary-sportlink/10 dark:bg-primary-sportlink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary-sportlink" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Crie competições</h3>
                <p className="text-muted-foreground text-center">
                  Organize torneios e campeonatos com seus amigos e outros usuários.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Recursos exclusivos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-4">Encontre quadras próximas</h3>
                <p className="text-muted-foreground mb-4">
                  Localize facilmente quadras e espaços esportivos próximos à sua localização.
                </p>
                <img
                  src="/placeholder.svg?height=200&width=300&text=Mapa"
                  alt="Mapa de quadras"
                  className="rounded-lg w-full"
                />
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-4">Crie e participe de competições</h3>
                <p className="text-muted-foreground mb-4">
                  Organize seus próprios torneios ou participe de competições existentes na sua região.
                </p>
                <img
                  src="/placeholder.svg?height=200&width=300&text=Competições"
                  alt="Competições"
                  className="rounded-lg w-full"
                />
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md border border-border">
                <h3 className="text-xl font-semibold mb-4">Conecte-se com outros atletas</h3>
                <p className="text-muted-foreground mb-4">
                  Encontre parceiros para seus esportes favoritos e expanda sua rede de contatos esportivos.
                </p>
                <img
                  src="/placeholder.svg?height=200&width=300&text=Comunidade"
                  alt="Comunidade"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-sportlink text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de atletas que já estão usando o SportLink para encontrar parceiros e competições.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-primary-sportlink">
                Criar uma conta
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-card py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Trophy className="h-6 w-6 text-primary-sportlink mr-2" />
              <span className="text-xl font-bold text-primary-sportlink">SportLink</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Sobre nós
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Termos de uso
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Privacidade
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Contato
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} SportLink. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
