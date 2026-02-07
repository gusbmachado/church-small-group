"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/firebase/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  getAllGroups, getAllUsers, getAnnouncements,
  createAnnouncement, deleteAnnouncement, updateAnnouncement,
  createGroup, deleteGroup, updateUserProfile,
} from "@/lib/firebase/firestore"
import type { SmallGroup, UserProfile, Announcement, UserRole } from "@/lib/types"
import { categories, genderOptions, ageRanges, daysOfWeek } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import {
  ArrowLeft, Plus, Trash2, Users, Megaphone, Church, Shield, UserCog, Settings, MapPin
} from "lucide-react"

export default function AdminPage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [groups, setGroups] = useState<SmallGroup[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  // Forms
  const [newGroupOpen, setNewGroupOpen] = useState(false)
  const [newAnnOpen, setNewAnnOpen] = useState(false)
  const [groupForm, setGroupForm] = useState({
    name: "", address: "", latitude: 0, longitude: 0,
    day_of_week: "Domingo", time: "19:00",
    leader: "", leader_phone: "", leader_email: "",
    category: "Jovens", gender: "mixed" as "mixed" | "men" | "women",
    age_range: "18-30", current_lesson: "",
    is_church: false,
  })
  const [annForm, setAnnForm] = useState({
    type: "news" as "event" | "alert" | "news",
    title: "", description: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    event_date: "",
    target_audience: "all" as "all" | "leaders" | "specific_groups",
    expires_at: "",
  })

  useEffect(() => {
    async function load() {
      try {
        const [g, u, a] = await Promise.all([getAllGroups(), getAllUsers(), getAnnouncements()])
        setGroups(g)
        setUsers(u)
        setAnnouncements(a)
      } catch (error) {
        console.error(error)
        toast({ title: "Erro ao carregar dados", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCreateGroup = async () => {
    if (!groupForm.name || !groupForm.address) {
      toast({ title: "Preencha nome e endereço", variant: "destructive" })
      return
    }
    try {
      const id = await createGroup(groupForm)
      setGroups([...groups, { id, ...groupForm, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      setGroupForm({
        name: "", address: "", latitude: 0, longitude: 0,
        day_of_week: "Domingo", time: "19:00",
        leader: "", leader_phone: "", leader_email: "",
        category: "Jovens", gender: "mixed",
        age_range: "18-30", current_lesson: "", is_church: false,
      })
      setNewGroupOpen(false)
      toast({ title: "Grupo criado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao criar grupo", variant: "destructive" })
    }
  }

  const handleDeleteGroup = async (id: string) => {
    try {
      await deleteGroup(id)
      setGroups(groups.filter((g) => g.id !== id))
      toast({ title: "Grupo removido" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao remover", variant: "destructive" })
    }
  }

  const handleCreateAnnouncement = async () => {
    if (!annForm.title) {
      toast({ title: "Preencha o título", variant: "destructive" })
      return
    }
    try {
      const id = await createAnnouncement({
        ...annForm,
        event_date: annForm.event_date || null,
        target_group_ids: [],
        created_by_name: profile?.name || "Admin",
        is_active: true,
        expires_at: annForm.expires_at || null,
      })
      setAnnouncements([
        { id, ...annForm, event_date: annForm.event_date || null, target_group_ids: [], created_by_name: profile?.name || "Admin", is_active: true, created_at: new Date().toISOString(), expires_at: annForm.expires_at || null },
        ...announcements,
      ])
      setAnnForm({ type: "news", title: "", description: "", priority: "medium", event_date: "", target_audience: "all", expires_at: "" })
      setNewAnnOpen(false)
      toast({ title: "Aviso publicado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao publicar", variant: "destructive" })
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id)
      setAnnouncements(announcements.filter((a) => a.id !== id))
      toast({ title: "Aviso removido" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao remover", variant: "destructive" })
    }
  }

  const handleChangeUserRole = async (uid: string, newRole: UserRole) => {
    try {
      await updateUserProfile(uid, { role: newRole })
      setUsers(users.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)))
      toast({ title: "Papel atualizado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao atualizar", variant: "destructive" })
    }
  }

  const handleAssignUserGroup = async (uid: string, groupId: string | null) => {
    try {
      await updateUserProfile(uid, { group_id: groupId })
      setUsers(users.map((u) => (u.uid === uid ? { ...u, group_id: groupId } : u)))
      toast({ title: "Grupo atualizado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao atualizar", variant: "destructive" })
    }
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Carregando painel admin...</p></div>
  }

  const roleLabels = { admin: "Admin", leader: "Líder", member: "Membro" }
  const priorityLabels = { low: "Baixa", medium: "Média", high: "Alta", urgent: "Urgente" }
  const typeLabels = { event: "Evento", alert: "Alerta", news: "Notícia" }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-card-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground">Gerenciamento geral da plataforma</p>
        </div>
        <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 p-4">
        <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-primary">{groups.filter((g) => g.is_church).length}</p><p className="text-sm text-muted-foreground">Igrejas</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-primary">{groups.filter((g) => !g.is_church).length}</p><p className="text-sm text-muted-foreground">Células</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-primary">{users.length}</p><p className="text-sm text-muted-foreground">Usuários</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-primary">{announcements.filter((a) => a.is_active).length}</p><p className="text-sm text-muted-foreground">Avisos Ativos</p></CardContent></Card>
      </div>

      <Tabs defaultValue="groups" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="groups" className="gap-2"><Church className="w-4 h-4" />Grupos</TabsTrigger>
            <TabsTrigger value="announcements" className="gap-2"><Megaphone className="w-4 h-4" />Avisos</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><UserCog className="w-4 h-4" />Usuários</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* === GROUPS TAB === */}
          <TabsContent value="groups" className="m-0 space-y-6">
            {/* === SEÇÃO: IGREJAS === */}
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-3"><Church className="w-5 h-5 text-primary" />Igrejas (Sedes)</h2>
              {groups.filter((g) => g.is_church).length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {groups.filter((g) => g.is_church).map((g) => (
                    <Card key={g.id}>
                      <CardContent className="pt-4 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-card-foreground">{g.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{g.address}</p>
                          {g.leader && <p className="text-xs text-muted-foreground mt-1">Pastor: {g.leader}</p>}
                          <p className="text-xs text-muted-foreground">{g.latitude.toFixed(4)}, {g.longitude.toFixed(4)}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(g.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card><CardContent className="pt-6 text-center text-muted-foreground">Nenhuma igreja cadastrada. Use "Novo Grupo" e ative "Cadastrar como Igreja".</CardContent></Card>
              )}
            </div>

            {/* === SEÇÃO: CÉLULAS / PEQUENOS GRUPOS === */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Células / Pequenos Grupos</h2>
              <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />Novo Grupo</Button></DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Criar Novo Grupo</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    {/* Toggle Igreja */}
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Church className="w-4 h-4 text-primary" />
                        <Label htmlFor="is-church">Cadastrar como Igreja (sede)</Label>
                      </div>
                      <Switch id="is-church" checked={groupForm.is_church} onCheckedChange={(checked) => setGroupForm({ ...groupForm, is_church: checked })} />
                    </div>
                    {groupForm.is_church && (
                      <p className="text-xs text-muted-foreground px-1">Igrejas aparecem como ponto central no mapa e não são listadas como célula.</p>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>{groupForm.is_church ? "Nome da Igreja *" : "Nome do Grupo *"}</Label><Input value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} placeholder={groupForm.is_church ? "Igreja Batista Central" : "Jovens Centro"} /></div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Endereço *</Label>
                        <AddressAutocomplete
                          value={groupForm.address}
                          onChange={(val) => setGroupForm(prev => ({ ...prev, address: val }))}
                          onSelect={(place) => setGroupForm(prev => ({ ...prev, address: place.address, latitude: place.latitude, longitude: place.longitude }))}
                          placeholder="Digite o endereço ou nome do local..."
                        />
                        {(groupForm.latitude !== 0 || groupForm.longitude !== 0) && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{groupForm.latitude.toFixed(6)}, {groupForm.longitude.toFixed(6)}</p>
                        )}
                      </div>
                      <div className="space-y-2"><Label>Dia</Label>
                        <Select value={groupForm.day_of_week} onValueChange={(v) => setGroupForm({ ...groupForm, day_of_week: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{daysOfWeek.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Horário</Label><Input value={groupForm.time} onChange={(e) => setGroupForm({ ...groupForm, time: e.target.value })} placeholder="19:00" /></div>
                      <div className="space-y-2"><Label>Líder</Label><Input value={groupForm.leader} onChange={(e) => setGroupForm({ ...groupForm, leader: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Telefone Líder</Label><Input value={groupForm.leader_phone} onChange={(e) => setGroupForm({ ...groupForm, leader_phone: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Email Líder</Label><Input value={groupForm.leader_email} onChange={(e) => setGroupForm({ ...groupForm, leader_email: e.target.value })} /></div>
                      <div className="space-y-2"><Label>Categoria</Label>
                        <Select value={groupForm.category} onValueChange={(v) => setGroupForm({ ...groupForm, category: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{categories.filter((c) => c !== "Todas Categorias").map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Gênero</Label>
                        <Select value={groupForm.gender} onValueChange={(v) => setGroupForm({ ...groupForm, gender: v as "mixed" | "men" | "women" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{genderOptions.filter((g) => g.value !== "all").map((g) => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Faixa Etária</Label>
                        <Select value={groupForm.age_range} onValueChange={(v) => setGroupForm({ ...groupForm, age_range: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{ageRanges.filter((a) => a !== "Todas Idades").map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleCreateGroup}>Criar Grupo</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Nome</TableHead><TableHead>Líder</TableHead><TableHead>Dia/Horário</TableHead><TableHead>Categoria</TableHead><TableHead className="w-[50px]"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {groups.filter((g) => !g.is_church).map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.name}</TableCell>
                    <TableCell>{g.leader}</TableCell>
                    <TableCell>{g.day_of_week} {g.time}</TableCell>
                    <TableCell><Badge variant="secondary">{g.category}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(g.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {groups.filter((g) => !g.is_church).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum grupo cadastrado</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* === ANNOUNCEMENTS TAB === */}
          <TabsContent value="announcements" className="m-0 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Avisos e Comunicados</h2>
              <Dialog open={newAnnOpen} onOpenChange={setNewAnnOpen}>
                <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />Novo Aviso</Button></DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Criar Aviso</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2"><Label>Título *</Label><Input value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} placeholder="Título do aviso" /></div>
                    <div className="space-y-2"><Label>Descrição</Label><Textarea value={annForm.description} onChange={(e) => setAnnForm({ ...annForm, description: e.target.value })} placeholder="Detalhes..." rows={3} /></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>Tipo</Label>
                        <Select value={annForm.type} onValueChange={(v) => setAnnForm({ ...annForm, type: v as "event" | "alert" | "news" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="news">Notícia</SelectItem>
                            <SelectItem value="event">Evento</SelectItem>
                            <SelectItem value="alert">Alerta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Prioridade</Label>
                        <Select value={annForm.priority} onValueChange={(v) => setAnnForm({ ...annForm, priority: v as "low" | "medium" | "high" | "urgent" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Público Alvo</Label>
                        <Select value={annForm.target_audience} onValueChange={(v) => setAnnForm({ ...annForm, target_audience: v as "all" | "leaders" | "specific_groups" })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="leaders">Líderes</SelectItem>
                            <SelectItem value="specific_groups">Grupos Específicos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {annForm.type === "event" && (
                        <div className="space-y-2"><Label>Data do Evento</Label><Input type="date" value={annForm.event_date} onChange={(e) => setAnnForm({ ...annForm, event_date: e.target.value })} /></div>
                      )}
                      <div className="space-y-2"><Label>Expira em</Label><Input type="date" value={annForm.expires_at} onChange={(e) => setAnnForm({ ...annForm, expires_at: e.target.value })} /></div>
                    </div>
                    <Button className="w-full" onClick={handleCreateAnnouncement}>Publicar Aviso</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Título</TableHead><TableHead>Tipo</TableHead><TableHead>Prioridade</TableHead><TableHead>Status</TableHead><TableHead className="w-[50px]"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {announcements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.title}</TableCell>
                    <TableCell><Badge variant="outline">{typeLabels[a.type]}</Badge></TableCell>
                    <TableCell><Badge variant={a.priority === "urgent" || a.priority === "high" ? "destructive" : "secondary"}>{priorityLabels[a.priority]}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={a.is_active ? "default" : "secondary"} className="cursor-pointer" onClick={async () => { await updateAnnouncement(a.id, { is_active: !a.is_active }); setAnnouncements(announcements.map((ann) => ann.id === a.id ? { ...ann, is_active: !ann.is_active } : ann)) }}>
                        {a.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAnnouncement(a.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {announcements.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum aviso publicado</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* === USERS TAB === */}
          <TabsContent value="users" className="m-0 space-y-4">
            <h2 className="text-lg font-semibold">Gerenciar Usuários</h2>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Papel</TableHead><TableHead>Grupo</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.uid}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Select value={u.role} onValueChange={(v) => handleChangeUserRole(u.uid, v as UserRole)}>
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Membro</SelectItem>
                          <SelectItem value="leader">Líder</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={u.group_id || "none"} onValueChange={(v) => handleAssignUserGroup(u.uid, v === "none" ? null : v)}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sem grupo" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem grupo</SelectItem>
                          {groups.filter((g) => !g.is_church).map((g) => (
                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum usuário registrado</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}