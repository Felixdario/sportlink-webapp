"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, AlertCircle, Loader2, Check, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { register as registerUser } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("atleta")
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
      const payload = { nome: name, email, senha: password }
      console.log("Enviando para registro:", payload)
      await registerUser(payload)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userName", name)
      router.push("/user-type")
    } catch (err: any) {
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err?.response?.data) {
        setError(JSON.stringify(err.response.data))
      } else {
        setError("Ocorreu um erro ao criar sua conta. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
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
          <Card className="relative bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Criar conta</CardTitle>
              <CardDescription className="text-center">Escolha o tipo de conta que deseja criar</CardDescription>
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
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="focus-visible:ring-primary-sportlink h-11"
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
                    className="focus-visible:ring-primary-sportlink h-11"
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
                      className="focus-visible:ring-primary-sportlink pr-10 h-11"
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
                      className="focus-visible:ring-primary-sportlink pr-10 h-11"
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
                  className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity"
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
                <Link href="/login" className="text-primary-sportlink hover:underline font-medium">
                  Entrar
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
  );
}
