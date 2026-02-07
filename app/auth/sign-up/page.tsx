"use client"

import type React from "react"
import { getFirebaseAuth } from "@/lib/firebase/client"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { createUserProfile } from "@/lib/firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Church } from "lucide-react"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("As senhas não correspondem")
      setIsLoading(false)
      return
    }

    if (!name.trim()) {
      setError("Por favor, informe seu nome")
      setIsLoading(false)
      return
    }

    try {
      const auth = getFirebaseAuth()
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(credential.user, { displayName: name })
      // Criar perfil no Firestore com role "member" por padrão
      await createUserProfile(credential.user.uid, email, name, "member")
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocorreu um erro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Church className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Pequenos Grupos</h1>
              <p className="text-xs text-muted-foreground">Plataforma da Igreja</p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Criar Conta</CardTitle>
              <CardDescription>Registre-se para participar da comunidade</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Repetir Senha</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Já tem uma conta?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4 text-primary">
                    Entrar
                  </Link>
                </div>
                <div className="mt-2 text-center">
                  <Link href="/" className="text-sm text-muted-foreground hover:underline">
                    Continuar como visitante
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}