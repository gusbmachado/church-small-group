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
  // Joined data
  members?: Member[]
  roles?: GroupRole[]
  season_lessons?: SeasonLesson[]
  attendance?: AttendanceRecord[]
  sermons?: Sermon[]
}

export interface Member {
  id: string
  group_id: string
  name: string
  phone: string | null
  email: string | null
  created_at: string
}

export interface GroupRole {
  id: string
  group_id: string
  role_name: string
  member_name: string
  created_at: string
}

export interface SeasonLesson {
  id: string
  group_id: string
  title: string
  week_number: number
  created_at: string
}

export interface AttendanceRecord {
  id: string
  group_id: string
  date: string
  created_at: string
  records?: { member_id: string; present: boolean }[]
}

export interface Sermon {
  id: string
  group_id: string
  date: string
  title: string
  scripture: string | null
  notes: string | null
  created_at: string
}

export const categories = [
  "All Categories",
  "Young Adults",
  "Mens Ministry",
  "Womens Ministry",
  "Senior Ministry",
  "Youth Ministry",
  "Family Ministry",
]

export const genderOptions = [
  { value: "all", label: "All Genders" },
  { value: "mixed", label: "Mixed" },
  { value: "men", label: "Men Only" },
  { value: "women", label: "Women Only" },
]

export const ageRanges = ["All Ages", "13-17", "18-30", "30-50", "40-60", "65+"]
