"use client"

import { useState, useEffect } from "react"
import type {
  SmallGroup, UserProfile, Member, Carpool, PrayerRequest,
  WeeklyChallenge, ReadingPlan, AttendanceEntry, GroupRole, Sermon
} from "@/lib/types"
import {
  ArrowLeft, Users, BookOpen, ClipboardCheck, Settings, Plus, Trash2,
  Edit, Save, X, Car, Heart, Target, BookMarked, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddressAutocomplete } from "@/components/address-autocomplete"
import { categories, genderOptions, ageRanges, daysOfWeek } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import {
  loadGroupFull, updateGroup, addMember, removeMember, setGroupRoles,
  saveAttendance, addSermon, addCarpool, removeCarpool,
  addPrayerRequest, togglePrayerAnswered, setWeeklyChallenge, setReadingPlan,
  getMembers, getGroupRoles, getAttendance, getSermons, getCarpools,
  getPrayerRequests, getWeeklyChallenge, getReadingPlan,
} from "@/lib/firebase/firestore"

interface ManagementDashboardProps {
  group: SmallGroup
  profile: UserProfile | null
  onBack: () => void
  onUpdateGroup: (group: SmallGroup) => void
}

export function ManagementDashboard({ group, profile, onBack, onUpdateGroup }: ManagementDashboardProps) {
  const { toast } = useToast()
  const [editedGroup, setEditedGroup] = useState<SmallGroup>(group)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Formulários
  const [newMember, setNewMember] = useState({ name: "", phone: "", email: "", neighborhood: "" })
  const [newSermon, setNewSermon] = useState({ title: "", scripture: "", notes: "" })
  const [newCarpool, setNewCarpool] = useState({ volunteer_name: "", phone: "", neighborhood: "", available_seats: 1, notes: "" })
  const [newPrayer, setNewPrayer] = useState({ requester_name: "", title: "", description: "" })
  const [challengeForm, setChallengeForm] = useState({ title: "", description: "", week_start: new Date().toISOString().split("T")[0] })
  const [readingForm, setReadingForm] = useState({ plan_name: "", entries: [{ date: "", scripture: "", completed: false }] })

  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, boolean>>(new Map())

  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addSermonOpen, setAddSermonOpen] = useState(false)
  const [addCarpoolOpen, setAddCarpoolOpen] = useState(false)
  const [addPrayerOpen, setAddPrayerOpen] = useState(false)

  const isLeader = profile?.role === "leader" || profile?.role === "admin"
  const isMember = !!profile

  // Carregar dados completos do Firestore
  useEffect(() => {
    async function load() {
      setIsLoading(true)
      try {
        const [members, roles, attendance, sermons, carpools, prayers, challenge, reading] = await Promise.all([
          getMembers(group.id),
          getGroupRoles(group.id),
          getAttendance(group.id),
          getSermons(group.id),
          getCarpools(group.id),
          getPrayerRequests(group.id),
          getWeeklyChallenge(group.id),
          getReadingPlan(group.id),
        ])
        setEditedGroup({
          ...group,
          members,
          roles,
          attendance,
          sermons,
          carpools,
          prayer_requests: prayers,
          weekly_challenge: challenge,
          reading_plan: reading,
        })
        if (challenge) {
          setChallengeForm({ title: challenge.title, description: challenge.description, week_start: challenge.week_start })
        }
        if (reading) {
          setReadingForm({ plan_name: reading.plan_name, entries: reading.entries })
        }
      } catch (error) {
        console.error("Error loading group data:", error)
        toast({ title: "Erro ao carregar dados", variant: "destructive" })
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [group.id])

  // === Handlers ===

  const handleSaveDetails = async () => {
    setIsSaving(true)
    try {
      const { members, roles, season_lessons, attendance, sermons, carpools, prayer_requests, weekly_challenge, reading_plan, ...groupData } = editedGroup
      await updateGroup(group.id, groupData)
      if (roles) {
        await setGroupRoles(group.id, roles.map(({ id, group_id, created_at, ...r }) => r))
      }
      onUpdateGroup(editedGroup)
      setIsEditing(false)
      toast({ title: "Grupo atualizado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMember.name) return
    setIsSaving(true)
    try {
      const member = await addMember(group.id, {
        name: newMember.name,
        phone: newMember.phone || null,
        email: newMember.email || null,
        neighborhood: newMember.neighborhood || null,
      })
      const updated = { ...editedGroup, members: [...(editedGroup.members || []), member] }
      setEditedGroup(updated)
      onUpdateGroup(updated)
      setNewMember({ name: "", phone: "", email: "", neighborhood: "" })
      setAddMemberOpen(false)
      toast({ title: "Membro adicionado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao adicionar membro", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    setIsSaving(true)
    try {
      await removeMember(group.id, memberId)
      const updatedMembers = editedGroup.members?.filter((m) => m.id !== memberId) || []
      const updated = { ...editedGroup, members: updatedMembers }
      setEditedGroup(updated)
      onUpdateGroup(updated)
      toast({ title: "Membro removido" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao remover", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAttendance = async () => {
    setIsSaving(true)
    try {
      const records: AttendanceEntry[] = (editedGroup.members || []).map((m) => ({
        member_id: m.id,
        member_name: m.name,
        present: attendanceRecords.get(m.id) || false,
        type: "member" as const,
      }))
      await saveAttendance(group.id, attendanceDate, records)
      const newRecord = { id: Date.now().toString(), group_id: group.id, date: attendanceDate, records, created_at: new Date().toISOString() }
      const updated = { ...editedGroup, attendance: [newRecord, ...(editedGroup.attendance || [])] }
      setEditedGroup(updated)
      setAttendanceRecords(new Map())
      toast({ title: "Presença registrada!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao salvar presença", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSermon = async () => {
    if (!newSermon.title) return
    setIsSaving(true)
    try {
      const id = await addSermon(group.id, {
        date: new Date().toISOString().split("T")[0],
        title: newSermon.title,
        scripture: newSermon.scripture || null,
        notes: newSermon.notes || null,
      })
      const sermon = { id, group_id: group.id, date: new Date().toISOString().split("T")[0], ...newSermon, scripture: newSermon.scripture || null, notes: newSermon.notes || null, created_at: new Date().toISOString() }
      const updated = { ...editedGroup, sermons: [sermon, ...(editedGroup.sermons || [])] }
      setEditedGroup(updated)
      setNewSermon({ title: "", scripture: "", notes: "" })
      setAddSermonOpen(false)
      toast({ title: "Lição adicionada!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao adicionar", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCarpool = async () => {
    if (!newCarpool.volunteer_name) return
    setIsSaving(true)
    try {
      const id = await addCarpool(group.id, {
        volunteer_name: newCarpool.volunteer_name,
        phone: newCarpool.phone,
        neighborhood: newCarpool.neighborhood,
        available_seats: newCarpool.available_seats,
        notes: newCarpool.notes || null,
        is_active: true,
      })
      const carpool = { id, group_id: group.id, ...newCarpool, is_active: true, notes: newCarpool.notes || null, created_at: new Date().toISOString() }
      const updated = { ...editedGroup, carpools: [...(editedGroup.carpools || []), carpool] }
      setEditedGroup(updated)
      setNewCarpool({ volunteer_name: "", phone: "", neighborhood: "", available_seats: 1, notes: "" })
      setAddCarpoolOpen(false)
      toast({ title: "Carona adicionada!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao adicionar carona", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddPrayer = async () => {
    if (!newPrayer.title) return
    setIsSaving(true)
    try {
      const id = await addPrayerRequest(group.id, {
        requester_name: newPrayer.requester_name || profile?.name || "Anônimo",
        title: newPrayer.title,
        description: newPrayer.description,
        is_answered: false,
      })
      const prayer = { id, group_id: group.id, ...newPrayer, requester_name: newPrayer.requester_name || profile?.name || "Anônimo", is_answered: false, created_at: new Date().toISOString() }
      const updated = { ...editedGroup, prayer_requests: [prayer, ...(editedGroup.prayer_requests || [])] }
      setEditedGroup(updated)
      setNewPrayer({ requester_name: "", title: "", description: "" })
      setAddPrayerOpen(false)
      toast({ title: "Pedido de oração adicionado!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao adicionar", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTogglePrayer = async (prayerId: string, current: boolean) => {
    try {
      await togglePrayerAnswered(group.id, prayerId, !current)
      const updated = {
        ...editedGroup,
        prayer_requests: editedGroup.prayer_requests?.map((p) =>
          p.id === prayerId ? { ...p, is_answered: !current } : p
        ),
      }
      setEditedGroup(updated)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveChallenge = async () => {
    setIsSaving(true)
    try {
      await setWeeklyChallenge(group.id, challengeForm)
      toast({ title: "Desafio da semana salvo!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveReadingPlan = async () => {
    setIsSaving(true)
    try {
      await setReadingPlan(group.id, readingForm)
      toast({ title: "Plano de leitura salvo!" })
    } catch (error) {
      console.error(error)
      toast({ title: "Erro ao salvar", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando dados do grupo...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-card-foreground">{group.name}</h1>
          <p className="text-sm text-muted-foreground">Painel de Gerenciamento</p>
        </div>
        <Badge variant="secondary">{group.category}</Badge>
      </div>

      <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-2 overflow-x-auto">
          <TabsList className="bg-transparent flex-wrap">
            <TabsTrigger value="details" className="gap-1 text-xs"><Settings className="w-3 h-3" />Dados</TabsTrigger>
            <TabsTrigger value="members" className="gap-1 text-xs"><Users className="w-3 h-3" />Membros</TabsTrigger>
            {isLeader && (
              <TabsTrigger value="attendance" className="gap-1 text-xs"><ClipboardCheck className="w-3 h-3" />Presença</TabsTrigger>
            )}
            <TabsTrigger value="lessons" className="gap-1 text-xs"><BookOpen className="w-3 h-3" />Lições</TabsTrigger>
            <TabsTrigger value="carpools" className="gap-1 text-xs"><Car className="w-3 h-3" />Caronas</TabsTrigger>
            {isMember && (
              <TabsTrigger value="community" className="gap-1 text-xs"><Heart className="w-3 h-3" />Comunhão</TabsTrigger>
            )}
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* === DETAILS TAB === */}
          <TabsContent value="details" className="m-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informações do Grupo</CardTitle>
                    <CardDescription>Dados básicos - visíveis para todos</CardDescription>
                  </div>
                  {isLeader && (
                    isEditing ? (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditedGroup(group) }}>
                          <X className="w-4 h-4 mr-1" />Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSaveDetails} disabled={isSaving}>
                          <Save className="w-4 h-4 mr-1" />{isSaving ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-1" />Editar
                      </Button>
                    )
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome do Grupo</Label>
                  <Input value={editedGroup.name} onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  {isEditing ? (
                    <AddressAutocomplete
                      value={editedGroup.address}
                      onChange={(val) => setEditedGroup(prev => ({ ...prev, address: val }))}
                      onSelect={(place) => setEditedGroup(prev => ({ ...prev, address: place.address, latitude: place.latitude, longitude: place.longitude }))}
                    />
                  ) : (
                    <Input value={editedGroup.address} disabled />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Dia da Semana</Label>
                  <Select value={editedGroup.day_of_week} onValueChange={(v) => setEditedGroup({ ...editedGroup, day_of_week: v })} disabled={!isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (<SelectItem key={day} value={day}>{day}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Horário</Label>
                  <Input value={editedGroup.time} onChange={(e) => setEditedGroup({ ...editedGroup, time: e.target.value })} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={editedGroup.category} onValueChange={(v) => setEditedGroup({ ...editedGroup, category: v })} disabled={!isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "Todas Categorias").map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gênero</Label>
                  <Select value={editedGroup.gender} onValueChange={(v) => setEditedGroup({ ...editedGroup, gender: v as "mixed" | "men" | "women" })} disabled={!isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {genderOptions.filter((g) => g.value !== "all").map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Faixa Etária</Label>
                  <Select value={editedGroup.age_range} onValueChange={(v) => setEditedGroup({ ...editedGroup, age_range: v })} disabled={!isEditing}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ageRanges.filter((a) => a !== "Todas Idades").map((age) => (<SelectItem key={age} value={age}>{age}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lição Atual</Label>
                  <Input value={editedGroup.current_lesson || ""} onChange={(e) => setEditedGroup({ ...editedGroup, current_lesson: e.target.value })} disabled={!isEditing} placeholder="Ex: Semana 3 - Vida em Comunidade" />
                </div>
              </CardContent>
            </Card>

            {/* Líder */}
            <Card>
              <CardHeader><CardTitle>Informações do Líder</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><Label>Nome</Label><Input value={editedGroup.leader} onChange={(e) => setEditedGroup({ ...editedGroup, leader: e.target.value })} disabled={!isEditing} /></div>
                <div className="space-y-2"><Label>Telefone</Label><Input value={editedGroup.leader_phone || ""} onChange={(e) => setEditedGroup({ ...editedGroup, leader_phone: e.target.value })} disabled={!isEditing} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Email</Label><Input value={editedGroup.leader_email || ""} onChange={(e) => setEditedGroup({ ...editedGroup, leader_email: e.target.value })} disabled={!isEditing} /></div>
              </CardContent>
            </Card>

            {/* Funções - Visível para membros + líder */}
            {isMember && (
              <Card>
                <CardHeader><CardTitle>Funções do Grupo</CardTitle><CardDescription>Responsabilidades atribuídas</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {editedGroup.roles?.map((role, idx) => (
                      <div key={role.id || idx} className="flex items-center gap-3">
                        <Input placeholder="Função" value={role.role_name} onChange={(e) => { const roles = [...(editedGroup.roles || [])]; roles[idx] = { ...role, role_name: e.target.value }; setEditedGroup({ ...editedGroup, roles }) }} disabled={!isEditing} className="flex-1" />
                        <Input placeholder="Responsável" value={role.member_name} onChange={(e) => { const roles = [...(editedGroup.roles || [])]; roles[idx] = { ...role, member_name: e.target.value }; setEditedGroup({ ...editedGroup, roles }) }} disabled={!isEditing} className="flex-1" />
                        {isEditing && (<Button variant="ghost" size="icon" onClick={() => { const roles = editedGroup.roles?.filter((_, i) => i !== idx) || []; setEditedGroup({ ...editedGroup, roles }) }}><Trash2 className="w-4 h-4 text-destructive" /></Button>)}
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setEditedGroup({ ...editedGroup, roles: [...(editedGroup.roles || []), { id: "", group_id: group.id, role_name: "", member_name: "", member_id: null, created_at: "" }] })}>
                        <Plus className="w-4 h-4 mr-1" />Adicionar Função
                      </Button>
                    )}
                    {(!editedGroup.roles || editedGroup.roles.length === 0) && !isEditing && (
                      <p className="text-center text-muted-foreground py-4">Nenhuma função definida</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* === MEMBERS TAB === */}
          <TabsContent value="members" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Membros do Grupo</CardTitle>
                    <CardDescription>{editedGroup.members?.length || 0} membros registrados</CardDescription>
                  </div>
                  {isLeader && (
                    <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Adicionar</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Novo Membro</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2"><Label>Nome</Label><Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Nome completo" /></div>
                          <div className="space-y-2"><Label>Telefone</Label><Input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="(11) 99999-9999" /></div>
                          <div className="space-y-2"><Label>Email</Label><Input value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="email@exemplo.com" /></div>
                          <div className="space-y-2"><Label>Bairro</Label><Input value={newMember.neighborhood} onChange={(e) => setNewMember({ ...newMember, neighborhood: e.target.value })} placeholder="Bairro" /></div>
                          <Button className="w-full" onClick={handleAddMember} disabled={isSaving}>{isSaving ? "Adicionando..." : "Adicionar Membro"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Nome</TableHead><TableHead>Telefone</TableHead><TableHead>Bairro</TableHead>
                    {isLeader && <TableHead className="w-[50px]"></TableHead>}
                  </TableRow></TableHeader>
                  <TableBody>
                    {editedGroup.members?.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.phone || "-"}</TableCell>
                        <TableCell>{member.neighborhood || "-"}</TableCell>
                        {isLeader && (
                          <TableCell><Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)} disabled={isSaving}><Trash2 className="w-4 h-4 text-destructive" /></Button></TableCell>
                        )}
                      </TableRow>
                    ))}
                    {(!editedGroup.members || editedGroup.members.length === 0) && (
                      <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Nenhum membro ainda.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === ATTENDANCE TAB (líder only) === */}
          {isLeader && (
            <TabsContent value="attendance" className="m-0 space-y-4">
              <Card>
                <CardHeader><CardTitle>Registrar Presença</CardTitle><CardDescription>Marque quem esteve presente na reunião</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 items-end">
                    <div className="space-y-2 flex-1"><Label>Data</Label><Input type="date" value={attendanceDate} onChange={(e) => { setAttendanceDate(e.target.value); setAttendanceRecords(new Map()) }} /></div>
                    <Button onClick={handleSaveAttendance} disabled={isSaving}><Save className="w-4 h-4 mr-1" />{isSaving ? "Salvando..." : "Salvar Presença"}</Button>
                  </div>
                  <div className="border rounded-lg divide-y">
                    {editedGroup.members?.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3">
                        <Checkbox checked={attendanceRecords.get(member.id) || false} onCheckedChange={(checked) => { const m = new Map(attendanceRecords); m.set(member.id, !!checked); setAttendanceRecords(m) }} />
                        <span className="font-medium">{member.name}</span>
                      </div>
                    ))}
                    {(!editedGroup.members || editedGroup.members.length === 0) && (<div className="p-8 text-center text-muted-foreground">Nenhum membro para registrar</div>)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Histórico de Presença</CardTitle></CardHeader>
                <CardContent>
                  {editedGroup.attendance && editedGroup.attendance.length > 0 ? (
                    <Table>
                      <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Presentes</TableHead><TableHead>Taxa</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {editedGroup.attendance.map((record) => {
                          const present = record.records?.filter((r) => r.present).length || 0
                          const total = editedGroup.members?.length || 1
                          return (
                            <TableRow key={record.id}>
                              <TableCell>{new Date(record.date).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>{present} membros</TableCell>
                              <TableCell>{Math.round((present / total) * 100)}%</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  ) : (<div className="text-center py-8 text-muted-foreground">Nenhum registro ainda</div>)}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* === LESSONS TAB === */}
          <TabsContent value="lessons" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Lições / Homilias</CardTitle><CardDescription>Registro de estudos e reflexões</CardDescription></div>
                  {isLeader && (
                    <Dialog open={addSermonOpen} onOpenChange={setAddSermonOpen}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Adicionar</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Nova Lição</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2"><Label>Título</Label><Input value={newSermon.title} onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })} placeholder="Título da lição" /></div>
                          <div className="space-y-2"><Label>Referência Bíblica</Label><Input value={newSermon.scripture} onChange={(e) => setNewSermon({ ...newSermon, scripture: e.target.value })} placeholder="Ex: João 3:16-21" /></div>
                          <div className="space-y-2"><Label>Notas</Label><Textarea value={newSermon.notes} onChange={(e) => setNewSermon({ ...newSermon, notes: e.target.value })} placeholder="Pontos principais..." rows={4} /></div>
                          <Button className="w-full" onClick={handleAddSermon} disabled={isSaving}>{isSaving ? "Adicionando..." : "Adicionar Lição"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {editedGroup.sermons && editedGroup.sermons.length > 0 ? (
                  <div className="space-y-4">
                    {editedGroup.sermons.map((sermon) => (
                      <div key={sermon.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{sermon.title}</h4>
                          <span className="text-xs text-muted-foreground">{new Date(sermon.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                        {sermon.scripture && <p className="text-sm text-primary mb-2">{sermon.scripture}</p>}
                        {sermon.notes && <p className="text-sm text-muted-foreground">{sermon.notes}</p>}
                      </div>
                    ))}
                  </div>
                ) : (<div className="text-center py-8 text-muted-foreground">Nenhuma lição registrada</div>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === CARPOOLS TAB === */}
          <TabsContent value="carpools" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle>Carona Solidária</CardTitle><CardDescription>Voluntários oferecendo carona - visível para todos</CardDescription></div>
                  <Dialog open={addCarpoolOpen} onOpenChange={setAddCarpoolOpen}>
                    <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Oferecer Carona</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Oferecer Carona</DialogTitle></DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2"><Label>Seu Nome</Label><Input value={newCarpool.volunteer_name} onChange={(e) => setNewCarpool({ ...newCarpool, volunteer_name: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Telefone / WhatsApp</Label><Input value={newCarpool.phone} onChange={(e) => setNewCarpool({ ...newCarpool, phone: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Bairro de Partida</Label><Input value={newCarpool.neighborhood} onChange={(e) => setNewCarpool({ ...newCarpool, neighborhood: e.target.value })} /></div>
                        <div className="space-y-2"><Label>Vagas Disponíveis</Label><Input type="number" min={1} max={8} value={newCarpool.available_seats} onChange={(e) => setNewCarpool({ ...newCarpool, available_seats: parseInt(e.target.value) || 1 })} /></div>
                        <div className="space-y-2"><Label>Observações</Label><Input value={newCarpool.notes} onChange={(e) => setNewCarpool({ ...newCarpool, notes: e.target.value })} placeholder="Ex: Saio às 18h45" /></div>
                        <Button className="w-full" onClick={handleAddCarpool} disabled={isSaving}>{isSaving ? "Salvando..." : "Oferecer Carona"}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {editedGroup.carpools && editedGroup.carpools.length > 0 ? (
                  <div className="space-y-3">
                    {editedGroup.carpools.map((c) => (
                      <div key={c.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{c.volunteer_name}</p>
                          <p className="text-sm text-muted-foreground">📍 {c.neighborhood} • 📞 {c.phone}</p>
                          <p className="text-sm text-muted-foreground">🚗 {c.available_seats} vaga(s) {c.notes && `• ${c.notes}`}</p>
                        </div>
                        {isLeader && (
                          <Button variant="ghost" size="icon" onClick={async () => { await removeCarpool(group.id, c.id); setEditedGroup({ ...editedGroup, carpools: editedGroup.carpools?.filter((cp) => cp.id !== c.id) }) }}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (<div className="text-center py-8 text-muted-foreground">Nenhuma carona oferecida ainda</div>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* === COMMUNITY TAB (membros + líder) === */}
          {isMember && (
            <TabsContent value="community" className="m-0 space-y-4">
              {/* Pedidos de Oração */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div><CardTitle>Pedidos de Oração</CardTitle><CardDescription>Ore uns pelos outros</CardDescription></div>
                    <Dialog open={addPrayerOpen} onOpenChange={setAddPrayerOpen}>
                      <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" />Novo Pedido</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Novo Pedido de Oração</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2"><Label>Seu Nome</Label><Input value={newPrayer.requester_name} onChange={(e) => setNewPrayer({ ...newPrayer, requester_name: e.target.value })} placeholder={profile?.name || ""} /></div>
                          <div className="space-y-2"><Label>Título</Label><Input value={newPrayer.title} onChange={(e) => setNewPrayer({ ...newPrayer, title: e.target.value })} placeholder="Motivo do pedido" /></div>
                          <div className="space-y-2"><Label>Descrição</Label><Textarea value={newPrayer.description} onChange={(e) => setNewPrayer({ ...newPrayer, description: e.target.value })} placeholder="Detalhes..." rows={3} /></div>
                          <Button className="w-full" onClick={handleAddPrayer} disabled={isSaving}>{isSaving ? "Adicionando..." : "Adicionar Pedido"}</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {editedGroup.prayer_requests && editedGroup.prayer_requests.length > 0 ? (
                    <div className="space-y-3">
                      {editedGroup.prayer_requests.map((p) => (
                        <div key={p.id} className={`p-4 border rounded-lg ${p.is_answered ? "border-green-500/30 bg-green-500/5" : "border-border"}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{p.title}</p>
                                {p.is_answered && <Badge variant="outline" className="text-green-500 border-green-500">Respondido</Badge>}
                              </div>
                              <p className="text-xs text-muted-foreground">por {p.requester_name} • {new Date(p.created_at).toLocaleDateString("pt-BR")}</p>
                              {p.description && <p className="text-sm text-muted-foreground mt-2">{p.description}</p>}
                            </div>
                            {isLeader && (
                              <Button variant="ghost" size="sm" onClick={() => handleTogglePrayer(p.id, p.is_answered)}>
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (<div className="text-center py-8 text-muted-foreground">Nenhum pedido de oração</div>)}
                </CardContent>
              </Card>

              {/* Desafio da Semana */}
              <Card>
                <CardHeader><CardTitle><Target className="w-5 h-5 inline mr-2" />Desafio da Semana</CardTitle></CardHeader>
                <CardContent>
                  {isLeader ? (
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Título</Label><Input value={challengeForm.title} onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })} placeholder="Prática de Gratidão" /></div>
                      <div className="space-y-2"><Label>Descrição</Label><Textarea value={challengeForm.description} onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })} placeholder="Durante esta semana, liste 3 coisas..." rows={3} /></div>
                      <div className="space-y-2"><Label>Início da Semana</Label><Input type="date" value={challengeForm.week_start} onChange={(e) => setChallengeForm({ ...challengeForm, week_start: e.target.value })} /></div>
                      <Button onClick={handleSaveChallenge} disabled={isSaving}><Save className="w-4 h-4 mr-1" />{isSaving ? "Salvando..." : "Salvar Desafio"}</Button>
                    </div>
                  ) : editedGroup.weekly_challenge ? (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold text-lg">{editedGroup.weekly_challenge.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{editedGroup.weekly_challenge.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Semana de {new Date(editedGroup.weekly_challenge.week_start).toLocaleDateString("pt-BR")}</p>
                    </div>
                  ) : (<p className="text-center text-muted-foreground py-4">Nenhum desafio definido esta semana</p>)}
                </CardContent>
              </Card>

              {/* Plano de Leitura */}
              <Card>
                <CardHeader><CardTitle><BookMarked className="w-5 h-5 inline mr-2" />Plano de Leitura</CardTitle></CardHeader>
                <CardContent>
                  {isLeader ? (
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Nome do Plano</Label><Input value={readingForm.plan_name} onChange={(e) => setReadingForm({ ...readingForm, plan_name: e.target.value })} placeholder="Plano: Salmos - Fevereiro 2026" /></div>
                      <div className="space-y-2">
                        <Label>Leituras Diárias</Label>
                        {readingForm.entries.map((entry, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input type="date" value={entry.date} onChange={(e) => { const entries = [...readingForm.entries]; entries[idx] = { ...entry, date: e.target.value }; setReadingForm({ ...readingForm, entries }) }} className="w-40" />
                            <Input value={entry.scripture} onChange={(e) => { const entries = [...readingForm.entries]; entries[idx] = { ...entry, scripture: e.target.value }; setReadingForm({ ...readingForm, entries }) }} placeholder="Salmos 23" className="flex-1" />
                            <Button variant="ghost" size="icon" onClick={() => { const entries = readingForm.entries.filter((_, i) => i !== idx); setReadingForm({ ...readingForm, entries }) }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => setReadingForm({ ...readingForm, entries: [...readingForm.entries, { date: "", scripture: "", completed: false }] })}><Plus className="w-4 h-4 mr-1" />Adicionar Dia</Button>
                      </div>
                      <Button onClick={handleSaveReadingPlan} disabled={isSaving}><Save className="w-4 h-4 mr-1" />{isSaving ? "Salvando..." : "Salvar Plano"}</Button>
                    </div>
                  ) : editedGroup.reading_plan ? (
                    <div className="space-y-2">
                      <h4 className="font-semibold">{editedGroup.reading_plan.plan_name}</h4>
                      {editedGroup.reading_plan.entries.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 border border-border rounded">
                          <span className="text-sm font-medium w-24">{entry.date ? new Date(entry.date).toLocaleDateString("pt-BR") : "-"}</span>
                          <span className="text-sm flex-1">{entry.scripture}</span>
                        </div>
                      ))}
                    </div>
                  ) : (<p className="text-center text-muted-foreground py-4">Nenhum plano de leitura definido</p>)}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  )
}