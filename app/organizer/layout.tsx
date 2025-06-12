"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MapPin, Calendar, BarChart3, Settings, LogOut, Menu, X } from "lucide-react"
import Image from "next/image"
const navigation = [
  { name: "Dashboard", href: "/organizer/dashboard", icon: LayoutDashboard },
  { name: "Minhas Quadras", href: "/organizer/courts", icon: MapPin },
  { name: "Agenda", href: "/organizer/schedule", icon: Calendar },
  { name: "Relatórios", href: "/organizer/reports", icon: BarChart3 },
  { name: "Configurações", href: "/organizer/settings", icon: Settings },
]

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-background border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-primary-sportlink to-rose-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-4 left-4 right-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-background lg:border-r">
        <div className="flex flex-col h-full">
          <div className="flex items-center border-b">
            <Image src="/Logo.png" alt="SportLink" width={140} height={120} />
            <span className="ml-2 text-sm font-semibold bg-gradient-to-r from-primary-sportlink to-rose-900 bg-clip-text text-transparent">
              Organizador
            </span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-primary-sportlink to-rose-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between border-b bg-background">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold"><Image src="/Logo.png" alt="SportLink" width={120} height={120} /></h1>
          <div className="w-8" />
        </div>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
