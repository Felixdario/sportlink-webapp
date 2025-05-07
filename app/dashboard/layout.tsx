"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Trophy, Menu, Home, MapPin, Calendar, Users, User, LogOut, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const auth = localStorage.getItem("isAuthenticated")
    const name = localStorage.getItem("userName") || "Usuário"

    if (auth !== "true") {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
      setUserName(name)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userName")
    router.push("/")
  }

  if (!isMounted || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex justify-between items-center h-[10px]">
          <div className="flex items-center">
            <Image src="/logo.png" alt="SportLink" width={140} height={120} />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                      <Trophy className="h-6 w-6 text-primary-sportlink mr-2" />
                      <span className="font-bold text-primary-sportlink">SportLink</span>
                    </div>
                    <ThemeToggle />
                  </div>
                  <div className="py-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={userName} />
                        <AvatarFallback className="bg-primary-sportlink/10 text-primary-sportlink">
                          {userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userName}</p>
                        <p className="text-sm text-muted-foreground">Atleta</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-2 flex-1 py-4">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted">
                      <Home className="h-5 w-5" />
                      <span>Início</span>
                    </Link>
                    <Link
                      href="/dashboard/quadras"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    >
                      <MapPin className="h-5 w-5" />
                      <span>Quadras</span>
                    </Link>
                    <Link
                      href="/dashboard/competicoes"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    >
                      <Calendar className="h-5 w-5" />
                      <span>Competições</span>
                    </Link>
                    <Link
                      href="/dashboard/atletas"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    >
                      <Users className="h-5 w-5" />
                      <span>Atletas</span>
                    </Link>
                    <Link
                      href="/dashboard/perfil"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    >
                      <User className="h-5 w-5" />
                      <span>Meu Perfil</span>
                    </Link>
                    <Link
                      href="/dashboard/configuracoes"
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Configurações</span>
                    </Link>
                  </nav>
                  <div className="py-4 border-t">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2 justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-foreground hover:text-primary-sportlink">
                Início
              </Link>
              <Link href="/dashboard/quadras" className="text-foreground hover:text-primary-sportlink">
                Quadras
              </Link>
              <Link href="/dashboard/competicoes" className="text-foreground hover:text-primary-sportlink">
                Competições
              </Link>
              <Link href="/dashboard/atletas" className="text-foreground hover:text-primary-sportlink">
                Atletas
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={userName} />
                      <AvatarFallback className="bg-primary-sportlink/10 text-primary-sportlink">
                        {userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{userName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/perfil">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/configuracoes">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-card py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SportLink. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
