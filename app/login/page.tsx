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
      // Simulando autenticação
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Verificação simulada de credenciais
      if (email === "teste@exemplo.com" && password === "senha123") {
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
      } else if (email === "organizador@exemplo.com" && password === "senha123") {
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userType", "organizer")
        if (rememberMe) {
          localStorage.setItem("userEmail", email)
        }
        router.push("/organizer/dashboard")
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
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

            {/* Adicionar seletor de tipo de usuário */}
            <div className="mt-4">
              <Label className="text-sm font-medium">Tipo de conta</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={userType === "athlete" ? "default" : "outline"}
                  className={`flex-1 ${userType === "athlete" ? "bg-gradient-to-r from-primary-sportlink to-rose-500" : ""}`}
                  onClick={() => setUserType("athlete")}
                >
                  Atleta
                </Button>
                <Button
                  type="button"
                  variant={userType === "organizer" ? "default" : "outline"}
                  className={`flex-1 ${userType === "organizer" ? "bg-gradient-to-r from-primary-sportlink to-rose-500" : ""}`}
                  onClick={() => setUserType("organizer")}
                >
                  Organizador
                </Button>
              </div>
            </div>
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

            <div className="mt-4 text-center text-sm p-3 rounded-md bg-foreground/5">
              <p>
                <span className="font-medium text-foreground/80">Credenciais de teste:</span> <br />
                <span className="font-medium">Atleta:</span> teste@exemplo.com / senha123 <br />
                <span className="font-medium">Organizador:</span> organizador@exemplo.com / senha123
              </p>
            </div>
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

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/80 backdrop-blur-sm px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                </svg>
                Facebook
              </Button>
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
