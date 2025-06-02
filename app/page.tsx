import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { MapPin, Users, Calendar, Trophy, ArrowRight, Star, CheckCircle, ChevronRight, Play, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-20 border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md flex items-center">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center h-full">
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-44" />
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#como-funciona" className="text-foreground/80 hover:text-primary-sportlink transition-colors">
                Como funciona
              </Link>
              <Link href="#recursos" className="text-foreground/80 hover:text-primary-sportlink transition-colors">
                Recursos
              </Link>
              <Link href="#depoimentos" className="text-foreground/80 hover:text-primary-sportlink transition-colors">
                Depoimentos
              </Link>
            </nav>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline" className="mr-2 hidden sm:inline-flex">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button className="gradient-primary hover:opacity-90 transition-opacity">Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-sportlink/20 to-rose-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary-sportlink/20 to-rose-500/20 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-up">
                <Badge className="mb-4 gradient-primary text-white px-3 py-1">Novo: Competições em tempo real</Badge>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Conecte-se com atletas e crie <span className="gradient-text">competições</span>
                </h2>
                <p className="text-xl mb-8 text-muted-foreground">
                  SportLink une pessoas que praticam esportes, facilitando a criação de competições em quadras próximas
                  à sua localização.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="w-full sm:w-auto gradient-primary hover:opacity-90 transition-opacity">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#como-funciona">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gradient-border">
                      <Play className="mr-2 h-4 w-4" />
                      Como funciona
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar key={i} className="border-2 border-background w-8 h-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                        <AvatarFallback className="bg-primary-sportlink/10 text-primary-sportlink text-xs">
                          U{i}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">+2.500 atletas</span> já estão conectados
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      ))}
                      <span className="text-xs ml-1 text-muted-foreground">(4.9/5)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 md:pl-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-sportlink to-rose-500 opacity-70 blur-sm"></div>
                  <div className="relative bg-card rounded-2xl p-2 shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center"
                      alt="Pessoas praticando esportes"
                      className="rounded-xl shadow-lg"
                    />

                    <div
                      className="absolute -top-4 -right-4 bg-primary-sportlink p-3 rounded-lg shadow-lg animate-float"
                      style={{ animationDelay: "1s" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">15 partidas agora</span>
                      </div>
                    </div>

                    <div
                      className="absolute bottom-4 right-4 bg-primary-sportlink p-3 rounded-lg shadow-lg animate-float"
                      style={{ animationDelay: "2s" }}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-white" />
                        <span className="text-sm font-medium">12 quadras próximas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section id="como-funciona" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-radial from-primary-sportlink/5 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4 gradient-primary text-white px-3 py-1">Simples e intuitivo</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Como funciona</h2>
              <p className="text-lg text-muted-foreground">
                Em apenas alguns passos, você pode encontrar quadras, conectar-se com outros atletas e participar de
                competições.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <MapPin className="w-8 h-8 text-white" />,
                  title: "Encontre quadras",
                  description: "Descubra quadras próximas a você para praticar seu esporte favorito.",
                },
                {
                  icon: <Users className="w-8 h-8 text-white" />,
                  title: "Conecte-se",
                  description: "Encontre pessoas com interesses esportivos semelhantes aos seus.",
                },
                {
                  icon: <Calendar className="w-8 h-8 text-white" />,
                  title: "Agende partidas",
                  description: "Crie eventos e convide outros usuários para jogar.",
                },
                {
                  icon: <Trophy className="w-8 h-8 text-white" />,
                  title: "Crie competições",
                  description: "Organize torneios e campeonatos com seus amigos e outros usuários.",
                },
              ].map((item, index) => (
                <div key={index} className="hover-lift rounded-xl overflow-hidden">
                  <div className="h-full flex flex-col bg-card border rounded-xl overflow-hidden">
                    <div className="gradient-primary p-6 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center">{item.icon}</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground flex-1">{item.description}</p>
                      <Link
                        href="/register"
                        className="mt-4 text-primary-sportlink font-medium inline-flex items-center group"
                      >
                        Começar agora
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="recursos" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4 gradient-primary text-white px-3 py-1">Recursos exclusivos</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Tudo que você precisa</h2>
              <p className="text-lg text-muted-foreground">
                Nossa plataforma oferece recursos exclusivos para melhorar sua experiência esportiva.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                  title: "Encontre quadras próximas",
                  description: "Localize facilmente quadras e espaços esportivos próximos à sua localização.",
                  image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop&crop=center",
                  alt: "Mapa de quadras esportivas",
                  features: ["Filtros avançados", "Avaliações de usuários", "Reservas online"],
                },
                {
                  title: "Crie e participe de competições",
                  description: "Organize seus próprios torneios ou participe de competições existentes na sua região.",
                  image: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&h=400&fit=crop&crop=center",
                  alt: "Competições esportivas",
                  features: ["Tabelas automáticas", "Sistema de pontuação", "Premiações"],
                },
                {
                  title: "Conecte-se com outros atletas",
                  description:
                    "Encontre parceiros para seus esportes favoritos e expanda sua rede de contatos esportivos.",
                  image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop&crop=center",
                  alt: "Comunidade esportiva",
                  features: ["Perfis detalhados", "Chat integrado", "Grupos por esporte"],
                },
              ].map((item, index) => (
                <div key={index} className="hover-lift">
                  <div className="h-full gradient-card rounded-xl overflow-hidden border shadow-sm">
                    <div className="p-1">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.alt}
                        className="rounded-t-lg w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-primary-sportlink mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 -translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-sportlink/10 to-rose-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary-sportlink/10 to-rose-500/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4 gradient-primary text-white px-3 py-1">Depoimentos</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">O que nossos usuários dizem</h2>
              <p className="text-lg text-muted-foreground">
                Veja o que os atletas estão falando sobre sua experiência com o SportLink.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Carlos Silva",
                  role: "Jogador de Futebol",
                  avatar: "/placeholder.svg?height=60&width=60&text=CS",
                  quote:
                    "O SportLink revolucionou a forma como eu pratico esportes. Agora consigo encontrar partidas e competições facilmente na minha região.",
                },
                {
                  name: "Ana Oliveira",
                  role: "Tenista Amadora",
                  avatar: "/placeholder.svg?height=60&width=60&text=AO",
                  quote:
                    "Graças ao SportLink, encontrei parceiros de tênis do meu nível. As competições são organizadas de forma profissional e divertida.",
                },
                {
                  name: "Pedro Santos",
                  role: "Organizador de Torneios",
                  avatar: "/placeholder.svg?height=60&width=60&text=PS",
                  quote:
                    "Como organizador, o SportLink me ajuda a gerenciar torneios de forma eficiente. A plataforma é intuitiva e os participantes adoram.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="hover-lift">
                  <div className="h-full bg-card rounded-xl p-6 border relative">
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <div className="text-primary-sportlink/10 dark:text-primary-sportlink/20">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mb-4 mt-6">
                      <p className="text-muted-foreground">{testimonial.quote}</p>
                    </div>

                    <div className="flex items-center mt-6">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary-sportlink/10 text-primary-sportlink">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 gradient-primary-soft"></div>

          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Pronto para começar sua jornada esportiva?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Junte-se a milhares de atletas que já estão usando o SportLink para encontrar parceiros e competições.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="text-primary-sportlink font-medium">
                    Criar uma conta
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white/10"
                  >
                    Já tenho uma conta
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-white/20">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">2,500+</p>
                    <p className="text-white/80">Atletas ativos</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-white/20">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">500+</p>
                    <p className="text-white/80">Competições realizadas</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-white/20">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-white">300+</p>
                    <p className="text-white/80">Quadras cadastradas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/logo.png" alt="Logo" className="w-44 h-32" />
              </div>
              <p className="text-muted-foreground mb-4">Conectando atletas e criando competições em um só lugar.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-primary-sportlink transition-colors">
                    Licenças
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SportLink. Todos os direitos reservados.
            </p>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Feito com</span>
              <Heart className="h-4 w-4 text-primary-sportlink" />
              <span className="text-sm text-muted-foreground ml-2">no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
