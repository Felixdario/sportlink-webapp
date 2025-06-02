"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, AlertCircle, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

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
      // Simulando envio de email de recuperação
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (err) {
      setError("Ocorreu um erro ao enviar o email de recuperação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

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
        <Link
          href="/login"
          className="flex items-center text-foreground/80 hover:text-primary-sportlink transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Voltar para o login</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center">
                <Image src="/Logo.png" alt="SportLink" width={260} height={120} />
              </div>
            </Link>
            <p className="mt-2 text-muted-foreground">Recupere o acesso à sua conta</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-sportlink to-rose-500 opacity-70 blur-sm"></div>
            <Card className="relative bg-card/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Recuperar senha</CardTitle>
                <CardDescription className="text-center">Enviaremos um link para redefinir sua senha</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4 animate-fade-in">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success ? (
                  <div className="text-center space-y-4 animate-fade-in">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-medium">Email enviado!</h3>
                    <p className="text-muted-foreground">
                      Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e
                      siga as instruções para redefinir sua senha.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSuccess(false)
                        setEmail("")
                      }}
                    >
                      Enviar para outro email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Button
                      type="submit"
                      className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar link de recuperação"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href="/login" className="flex items-center text-sm text-primary-sportlink hover:underline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
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
