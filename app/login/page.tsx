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
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

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
        if (rememberMe) {
          localStorage.setItem("userEmail", email)
        } else {
          localStorage.removeItem("userEmail")
        }
        router.push("/dashboard")
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
              <Image src="/logo.png" alt="SportLink" width={260} height={120} />
            </div>
          </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-sportlink to-rose-500 opacity-70 blur-sm"></div>
            <Card className="relative bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Entrar</CardTitle>
                <CardDescription className="text-center">
                  Entre com seu email e senha para acessar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        className="focus-visible:ring-primary-sportlink pl-4 h-11"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Link href="/forgot-password" className="text-sm text-primary-sportlink hover:underline">
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
                        className="focus-visible:ring-primary-sportlink pr-10 h-11"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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
                    className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity"
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

                <div className="mt-4 text-center text-sm p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-1">Credenciais de teste:</p>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>Email:</div>
                    <div className="font-mono">teste@exemplo.com</div>
                    <div>Senha:</div>
                    <div className="font-mono">senha123</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  Não tem uma conta?{" "}
                  <Link href="/register" className="text-primary-sportlink hover:underline font-medium">
                    Cadastre-se
                  </Link>
                </div>
                <div className="relative">
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2">Ou continue com</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
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
                  <Button variant="outline" className="h-11">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
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
