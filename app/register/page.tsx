"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Eye, EyeOff, AlertCircle, Loader2, Check, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [esporteFavorito, setEsporteFavorito] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Validação de senha
  const passwordHasMinLength = password.length >= 8
  const passwordHasNumber = /\d/.test(password)
  const passwordHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const validateForm = () => {
    if (!name.trim()) {
      setError("O nome é obrigatório")
      return false
    }

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

    if (!passwordHasMinLength || !passwordHasNumber || !passwordHasSpecial) {
      setError("A senha não atende aos requisitos mínimos")
      return false
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }

    if (!esporteFavorito) {
      setError("Selecione seu esporte favorito")
      return false
    }

    if (!termsAccepted) {
      setError("Você precisa aceitar os termos de uso")
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
      // Simulando registro
      await new Promise((resolve) => setTimeout(resolve, 1500))

      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userName", name)
      router.push("/dashboard")
    } catch (err) {
      setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Link href="/" className="flex items-center mb-8">
        <Trophy className="h-8 w-8 text-primary-sportlink mr-2" />
        <h1 className="text-2xl font-bold text-primary-sportlink">SportLink</h1>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
          <CardDescription className="text-center">Cadastre-se para começar a usar a plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="focus-visible:ring-primary-sportlink"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="focus-visible:ring-primary-sportlink"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-primary-sportlink pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="space-y-2 text-sm mt-2">
                <div className="flex items-center gap-2">
                  {passwordHasMinLength ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={passwordHasMinLength ? "text-green-500" : "text-muted-foreground"}>
                    Mínimo de 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordHasNumber ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={passwordHasNumber ? "text-green-500" : "text-muted-foreground"}>
                    Pelo menos um número
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordHasSpecial ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={passwordHasSpecial ? "text-green-500" : "text-muted-foreground"}>
                    Pelo menos um caractere especial
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="focus-visible:ring-primary-sportlink pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">As senhas não coincidem</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="esporte">Esporte favorito</Label>
              <Select value={esporteFavorito} onValueChange={setEsporteFavorito}>
                <SelectTrigger id="esporte" className="focus-visible:ring-primary-sportlink">
                  <SelectValue placeholder="Selecione seu esporte favorito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="futebol">Futebol</SelectItem>
                  <SelectItem value="basquete">Basquete</SelectItem>
                  <SelectItem value="volei">Vôlei</SelectItem>
                  <SelectItem value="tenis">Tênis</SelectItem>
                  <SelectItem value="natacao">Natação</SelectItem>
                  <SelectItem value="corrida">Corrida</SelectItem>
                  <SelectItem value="ciclismo">Ciclismo</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Eu aceito os{" "}
                <Link href="/terms" className="text-primary-sportlink hover:underline">
                  termos de uso
                </Link>{" "}
                e{" "}
                <Link href="/privacy" className="text-primary-sportlink hover:underline">
                  política de privacidade
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-sportlink hover:bg-primary-sportlink/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary-sportlink hover:underline">
              Entrar
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              Facebook
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
