"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Building2, Calendar, BarChart3, Settings, LogOut, Menu, Trophy, Plus, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
const navigation = [
  {
    name: "Dashboard",
    href: "/organizer/dashboard",
    icon: Home,
  },
  {
    name: "Minhas Quadras",
    href: "/organizer/courts",
    icon: Building2,
  },
  {
    name: "Agenda",
    href: "/organizer/schedule",
    icon: Calendar,
  },
  {
    name: "Relatórios",
    href: "/organizer/reports",
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: "/organizer/settings",
    icon: Settings,
  },
]

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Verificar se o usuário está autenticado e é organizador
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    const userType = localStorage.getItem("userType")

    if (!isAuthenticated) {
      router.push("/login")
    } else if (userType !== "organizer") {
      router.push("/user-type")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    router.push("/")
  }

  if (!mounted) {
    return null
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-4" : ""}`}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-6">
        <div>
          <h1 className="text-muted-foreground ml-2">Organizador</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => mobile && setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-sportlink text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <p className="text-xs font-medium text-muted-foreground mb-3 px-3">AÇÕES RÁPIDAS</p>
          <div className="space-y-2">
            <Link
              href="/organizer/courts/new"
              onClick={() => mobile && setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nova Quadra
            </Link>
          </div>
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="px-4 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-sportlink to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">João Silva</p>
              <p className="text-xs text-muted-foreground truncate">Organizador</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        {/* Top Bar (Mobile Trigger) */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8 md:hidden">
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir sidebar</span>
            </Button>
          </SheetTrigger>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
            </div>
          </div>
        </div>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full bg-card">
            <Sidebar mobile />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Top Bar (Desktop) */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8 hidden md:flex">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1">
              <Image src="/Logo.png" alt="SportLink" width={120} height={180} /></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
