// ==========================================
// User & Roles
// ==========================================
export type UserRole = "admin" | "leader" | "member"

export interface UserProfile {
  uid: string
  email: string
  name: string
  role: UserRole
  group_id: string | null
  phone: string | null
  created_at: string
}

// ==========================================
// Small Group
// ==========================================
export interface SmallGroup {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  day_of_week: string
  time: string
  leader: string
  leader_phone: string | null
  leader_email: string | null
  category: string
  gender: "mixed" | "men" | "women"
  age_range: string
  current_lesson: string | null
  is_church: boolean
  created_at: string
  updated_at: string
  // Dados carregados sob demanda
  members?: Member[]
  roles?: GroupRole[]
  season_lessons?: SeasonLesson[]
  attendance?: AttendanceRecord[]
  sermons?: Sermon[]
  carpools?: Carpool[]
  prayer_requests?: PrayerRequest[]
  weekly_challenge?: WeeklyChallenge | null
  reading_plan?: ReadingPlan | null
}

// ==========================================
// Members
// ==========================================
export interface Member {
  id: string
  group_id: string
  name: string
  phone: string | null
  email: string | null
  neighborhood: string | null
  created_at: string
}

// ==========================================
// Group Roles (funções do grupo)
// ==========================================
export interface GroupRole {
  id: string
  group_id: string
  role_name: string
  member_name: string
  member_id: string | null
  created_at: string
}

// ==========================================
// Lessons
// ==========================================
export interface SeasonLesson {
  id: string
  group_id: string
  title: string
  week_number: number
  created_at: string
}

// ==========================================
// Attendance
// ==========================================
export interface AttendanceRecord {
  id: string
  group_id: string
  date: string
  created_at: string
  records?: AttendanceEntry[]
}

export interface AttendanceEntry {
  member_id: string
  member_name: string
  present: boolean
  type: "member" | "visitor"
}

// ==========================================
// Sermons
// ==========================================
export interface Sermon {
  id: string
  group_id: string
  date: string
  title: string
  scripture: string | null
  notes: string | null
  created_at: string
}

// ==========================================
// Carpool (Carona Solidária)
// ==========================================
export interface Carpool {
  id: string
  group_id: string
  volunteer_name: string
  phone: string
  neighborhood: string
  available_seats: number
  notes: string | null
  is_active: boolean
  created_at: string
}

// ==========================================
// Prayer Requests (Pedidos de Oração)
// ==========================================
export interface PrayerRequest {
  id: string
  group_id: string
  requester_name: string
  title: string
  description: string
  is_answered: boolean
  created_at: string
}

// ==========================================
// Weekly Challenge (Desafio da Semana)
// ==========================================
export interface WeeklyChallenge {
  id: string
  group_id: string
  title: string
  description: string
  week_start: string
  created_at: string
}

// ==========================================
// Reading Plan (Plano de Leitura)
// ==========================================
export interface ReadingPlan {
  id: string
  group_id: string
  plan_name: string
  entries: ReadingEntry[]
  created_at: string
}

export interface ReadingEntry {
  date: string
  scripture: string
  completed: boolean
}

// ==========================================
// Announcements (Avisos)
// ==========================================
export interface Announcement {
  id: string
  type: "event" | "alert" | "news"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  event_date: string | null
  target_audience: "all" | "leaders" | "specific_groups"
  target_group_ids: string[]
  created_by_name: string
  is_active: boolean
  created_at: string
  expires_at: string | null
}

// ==========================================
// Constants
// ==========================================
export const categories = [
  "Todas Categorias",
  "Jovens",
  "Ministério Masculino",
  "Ministério Feminino",
  "Ministério Sênior",
  "Ministério Jovem",
  "Ministério Familiar",
]

export const genderOptions = [
  { value: "all", label: "Todos" },
  { value: "mixed", label: "Misto" },
  { value: "men", label: "Somente Homens" },
  { value: "women", label: "Somente Mulheres" },
]

export const ageRanges = ["Todas Idades", "13-17", "18-30", "30-50", "40-60", "65+"]

export const daysOfWeek = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
]