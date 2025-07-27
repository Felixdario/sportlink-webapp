"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login as loginUser } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [userType, setUserType] = useState<"athlete" | "organizer">("athlete")

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    if (!email.trim()) {
      setError("O email é obrigatório")
      return false
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Por favor, insira um email válido")
      return false
    }

    if (!password) {
      setError("A senha é obrigatória")
      return false
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const data = await loginUser({ email, senha: password })
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userType", userType)
      if (rememberMe) {
        localStorage.setItem("userEmail", email)
      } else {
        localStorage.removeItem("userEmail")
      }
      // Redirecionar baseado no tipo de usuário
      if (userType === "organizer") {
        router.push("/organizer/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Email ou senha incorretos")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Preencher email se "lembrar-me" estiver ativo
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-sportlink/20 to-rose-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary-sportlink/20 to-rose-500/20 blur-3xl" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="flex items-center text-foreground/80 hover:text-primary-sportlink transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Voltar para o início</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center">
              <Image src="/Logo.png" alt="SportLink" width={260} height={120} />
            </div>
          </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-sportlink to-rose-500 opacity-70 blur-sm"></div>
            <Card className="w-full max-w-md border-none shadow-xl relative overflow-hidden backdrop-blur-sm bg-card/80">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-sportlink/10 to-rose-500/10 opacity-50 pointer-events-none"></div>

          <CardHeader className="relative">
            <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">Entre na sua conta para acessar a plataforma</CardDescription>
          </CardHeader>

          <CardContent className="relative">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-destructive/90 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/90">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary-sportlink focus-visible:border-primary-sportlink/50"
                    autoComplete="email"
                  />
                  <div className="absolute inset-0 rounded-md border border-primary-sportlink/20 pointer-events-none opacity-0 peer-focus-visible:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground/90">
                    Senha
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-sportlink hover:text-primary-sportlink/80 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary-sportlink focus-visible:border-primary-sportlink/50 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <div className="absolute inset-0 rounded-md border border-primary-sportlink/20 pointer-events-none opacity-0 peer-focus-visible:opacity-100 transition-opacity"></div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-primary-sportlink data-[state=checked]:border-primary-sportlink"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lembrar-me
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-sportlink to-rose-500 hover:from-primary-sportlink/90 hover:to-rose-500/90 transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 relative">
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-primary-sportlink hover:text-primary-sportlink/80 transition-colors font-medium"
              >
                Cadastre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SportLink. Todos os direitos reservados.
      </footer>
    </div>
  )
}
