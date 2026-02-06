"use client"

import { useState, useEffect } from "react"
import type { SmallGroup } from "@/lib/types"
import { ArrowLeft, Users, BookOpen, ClipboardCheck, Settings, Plus, Trash2, Edit, Save, X } from "lucide-react"
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
import { categories, genderOptions, ageRanges } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface ManagementDashboardProps {
  group: SmallGroup
  onBack: () => void
  onUpdateGroup: (group: SmallGroup) => void
}

export function ManagementDashboard({ group, onBack, onUpdateGroup }: ManagementDashboardProps) {
  const { toast } = useToast()
  const [editedGroup, setEditedGroup] = useState<SmallGroup>(group)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", phone: "", email: "" })
  const [newSermon, setNewSermon] = useState({ title: "", scripture: "", notes: "" })
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [presentMembers, setPresentMembers] = useState<string[]>([])
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [addSermonOpen, setAddSermonOpen] = useState(false)

  // Note: Database operations removed - using local state only
  // To persist data, you would need to implement Firestore operations

  useEffect(() => {
    setEditedGroup(group)
  }, [group])

  const handleSaveDetails = async () => {
    setIsSaving(true)
    try {
      // Note: Using local state only - implement Firestore for persistence
      onUpdateGroup(editedGroup)
      setIsEditing(false)
      toast({ title: "Group updated successfully" })
    } catch (error) {
      console.error("Error updating group:", error)
      toast({ title: "Error updating group", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMember.name) return
    setIsSaving(true)
    try {
      // Note: Using local state only - implement Firestore for persistence
      const newMemberData = {
        id: Date.now().toString(),
        ...newMember,
      }

      const updatedMembers = [...(editedGroup.members || []), newMemberData]
      const updated = { ...editedGroup, members: updatedMembers }
      setEditedGroup(updated)
      onUpdateGroup(updated)
      setNewMember({ name: "", phone: "", email: "" })
      setAddMemberOpen(false)
      toast({ title: "Member added successfully" })
    } catch (error) {
      console.error("Error adding member:", error)
      toast({ title: "Error adding member", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    setIsSaving(true)
    try {
      // Note: Using local state only - implement Firestore for persistence
      const updatedMembers = editedGroup.members?.filter((m) => m.id !== memberId) || []
      const updated = { ...editedGroup, members: updatedMembers }
      setEditedGroup(updated)
      onUpdateGroup(updated)
      toast({ title: "Member removed" })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({ title: "Error removing member", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAttendance = async () => {
    setIsSaving(true)
    try {
      // Note: Using local state only - implement Firestore for persistence
      const attendanceRecord = {
        id: Date.now().toString(),
        date: attendanceDate,
        presentIds: presentMembers,
      }

      const updatedAttendance = [...(editedGroup.attendance || []), attendanceRecord]
      const updated = { ...editedGroup, attendance: updatedAttendance }
      setEditedGroup(updated)
      onUpdateGroup(updated)
      setPresentMembers([])
      toast({ title: "Attendance saved successfully" })
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast({ title: "Error saving attendance", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSermon = async () => {
    if (!newSermon.title) return
    setIsSaving(true)
    try {
      // Note: Using local state only - implement Firestore for persistence
      const sermonData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split("T")[0],
        ...newSermon,
      }

      const updatedSermons = [...(editedGroup.sermons || []), sermonData]
      const updated = { ...editedGroup, sermons: updatedSermons }
      setEditedGroup(updated)
      onUpdateGroup(updated)
      setNewSermon({ title: "", scripture: "", notes: "" })
      setAddSermonOpen(false)
      toast({ title: "Sermon/Homily added successfully" })
    } catch (error) {
      console.error("Error adding sermon:", error)
      toast({ title: "Error adding sermon", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center gap-4 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-card-foreground">{group.name}</h1>
          <p className="text-sm text-muted-foreground">Management Dashboard</p>
        </div>
        <Badge variant="secondary">{group.category}</Badge>
      </div>

      <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-4">
          <TabsList className="bg-transparent">
            <TabsTrigger value="details" className="gap-2">
              <Settings className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="members" className="gap-2">
              <Users className="w-4 h-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="lessons" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Lessons
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          {/* Details Tab */}
          <TabsContent value="details" className="m-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Group Information</CardTitle>
                    <CardDescription>Basic details about the small group</CardDescription>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false)
                          setEditedGroup(group)
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveDetails} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Group Name</Label>
                  <Input
                    value={editedGroup.name}
                    onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={editedGroup.address}
                    onChange={(e) => setEditedGroup({ ...editedGroup, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={editedGroup.day_of_week}
                    onValueChange={(v) => setEditedGroup({ ...editedGroup, day_of_week: v })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    value={editedGroup.time}
                    onChange={(e) => setEditedGroup({ ...editedGroup, time: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editedGroup.category}
                    onValueChange={(v) => setEditedGroup({ ...editedGroup, category: v })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c !== "All Categories")
                        .map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={editedGroup.gender}
                    onValueChange={(v) => setEditedGroup({ ...editedGroup, gender: v as "mixed" | "men" | "women" })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions
                        .filter((g) => g.value !== "all")
                        .map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <Select
                    value={editedGroup.age_range}
                    onValueChange={(v) => setEditedGroup({ ...editedGroup, age_range: v })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ageRanges
                        .filter((a) => a !== "All Ages")
                        .map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Lesson</Label>
                  <Input
                    value={editedGroup.current_lesson || ""}
                    onChange={(e) => setEditedGroup({ ...editedGroup, current_lesson: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Week 3: Community Living"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leader Information</CardTitle>
                <CardDescription>Contact details for the group leader</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Leader Name</Label>
                  <Input
                    value={editedGroup.leader}
                    onChange={(e) => setEditedGroup({ ...editedGroup, leader: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editedGroup.leader_phone || ""}
                    onChange={(e) => setEditedGroup({ ...editedGroup, leader_phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Email</Label>
                  <Input
                    value={editedGroup.leader_email || ""}
                    onChange={(e) => setEditedGroup({ ...editedGroup, leader_email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Roles</CardTitle>
                <CardDescription>Assign responsibilities to members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {editedGroup.roles?.map((role, idx) => (
                    <div key={role.id || idx} className="flex items-center gap-3">
                      <Input
                        placeholder="Role name"
                        value={role.role_name}
                        onChange={(e) => {
                          const roles = [...(editedGroup.roles || [])]
                          roles[idx] = { ...role, role_name: e.target.value }
                          setEditedGroup({ ...editedGroup, roles })
                        }}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Member name"
                        value={role.member_name}
                        onChange={(e) => {
                          const roles = [...(editedGroup.roles || [])]
                          roles[idx] = { ...role, member_name: e.target.value }
                          setEditedGroup({ ...editedGroup, roles })
                        }}
                        disabled={!isEditing}
                        className="flex-1"
                      />
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const roles = editedGroup.roles?.filter((_, i) => i !== idx) || []
                            setEditedGroup({ ...editedGroup, roles })
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditedGroup({
                          ...editedGroup,
                          roles: [
                            ...(editedGroup.roles || []),
                            { id: "", group_id: group.id, role_name: "", member_name: "", created_at: "" },
                          ],
                        })
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Role
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Group Members</CardTitle>
                    <CardDescription>{editedGroup.members?.length || 0} registered members</CardDescription>
                  </div>
                  <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            placeholder="Full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={newMember.phone}
                            onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            placeholder="email@example.com"
                          />
                        </div>
                        <Button className="w-full" onClick={handleAddMember} disabled={isSaving}>
                          {isSaving ? "Adding..." : "Add Member"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedGroup.members?.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.phone || "-"}</TableCell>
                        <TableCell>{member.email || "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.id)}
                            disabled={isSaving}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!editedGroup.members || editedGroup.members.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No members yet. Add your first member!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Take Attendance</CardTitle>
                <CardDescription>Record who attended the meeting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => {
                        setAttendanceDate(e.target.value)
                        setPresentMembers([])
                      }}
                    />
                  </div>
                  <Button onClick={handleSaveAttendance} disabled={isSaving}>
                    <Save className="w-4 h-4 mr-1" />
                    {isSaving ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
                <div className="border rounded-lg divide-y">
                  {editedGroup.members?.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3">
                      <Checkbox
                        checked={presentMembers.includes(member.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPresentMembers([...presentMembers, member.id])
                          } else {
                            setPresentMembers(presentMembers.filter((id) => id !== member.id))
                          }
                        }}
                      />
                      <span className="font-medium">{member.name}</span>
                    </div>
                  ))}
                  {(!editedGroup.members || editedGroup.members.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">No members to track attendance for</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Past attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                {editedGroup.attendance && editedGroup.attendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editedGroup.attendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.records?.length || 0} members</TableCell>
                          <TableCell>
                            {editedGroup.members && editedGroup.members.length > 0
                              ? Math.round(((record.records?.length || 0) / editedGroup.members.length) * 100)
                              : 0}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No attendance records yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="m-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Season Lessons</CardTitle>
                <CardDescription>Curriculum for this season</CardDescription>
              </CardHeader>
              <CardContent>
                {editedGroup.season_lessons && editedGroup.season_lessons.length > 0 ? (
                  <div className="space-y-2">
                    {editedGroup.season_lessons
                      .sort((a, b) => a.week_number - b.week_number)
                      .map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`p-3 rounded-lg border ${
                            editedGroup.current_lesson?.includes(lesson.title)
                              ? "border-primary bg-primary/10"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              Week {lesson.week_number}: {lesson.title}
                            </span>
                            {editedGroup.current_lesson?.includes(lesson.title) && <Badge>Current</Badge>}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No season lessons defined</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sermon/Homily Notes</CardTitle>
                    <CardDescription>Record teachings and discussions</CardDescription>
                  </div>
                  <Dialog open={addSermonOpen} onOpenChange={setAddSermonOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Notes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Sermon/Homily Notes</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={newSermon.title}
                            onChange={(e) => setNewSermon({ ...newSermon, title: e.target.value })}
                            placeholder="Lesson title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Scripture Reference</Label>
                          <Input
                            value={newSermon.scripture}
                            onChange={(e) => setNewSermon({ ...newSermon, scripture: e.target.value })}
                            placeholder="e.g., John 3:16-21"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={newSermon.notes}
                            onChange={(e) => setNewSermon({ ...newSermon, notes: e.target.value })}
                            placeholder="Key takeaways and discussion points..."
                            rows={4}
                          />
                        </div>
                        <Button className="w-full" onClick={handleAddSermon} disabled={isSaving}>
                          {isSaving ? "Adding..." : "Add Notes"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {editedGroup.sermons && editedGroup.sermons.length > 0 ? (
                  <div className="space-y-4">
                    {editedGroup.sermons
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((sermon) => (
                        <div key={sermon.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{sermon.title}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(sermon.date).toLocaleDateString()}
                            </span>
                          </div>
                          {sermon.scripture && <p className="text-sm text-primary mb-2">{sermon.scripture}</p>}
                          {sermon.notes && <p className="text-sm text-muted-foreground">{sermon.notes}</p>}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No sermon notes yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )
}
