"use client"

import { initializeApp, getApps } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  Firestore,
} from "firebase/firestore"
import { firebaseConfig } from "./config"
import type {
  UserProfile,
  SmallGroup,
  Member,
  GroupRole,
  SeasonLesson,
  AttendanceRecord,
  AttendanceEntry,
  Sermon,
  Carpool,
  PrayerRequest,
  WeeklyChallenge,
  ReadingPlan,
  Announcement,
  UserRole,
} from "@/lib/types"

let db: Firestore

function getDb(): Firestore {
  if (!db) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    db = getFirestore(app)
  }
  return db
}

const now = () => new Date().toISOString()

// ==========================================
// USER PROFILES
// ==========================================

export async function createUserProfile(uid: string, email: string, name: string, role: UserRole = "member"): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    email,
    name,
    role,
    group_id: null,
    phone: null,
    created_at: now(),
  }
  await setDoc(doc(getDb(), "users", uid), profile)
  return profile
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getDb(), "users", uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(getDb(), "users", uid), data)
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(collection(getDb(), "users"))
  return snap.docs.map((d) => d.data() as UserProfile)
}

// ==========================================
// GROUPS
// ==========================================

export async function getAllGroups(): Promise<SmallGroup[]> {
  const snap = await getDocs(query(collection(getDb(), "groups"), orderBy("name")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SmallGroup))
}

export async function getGroup(id: string): Promise<SmallGroup | null> {
  const snap = await getDoc(doc(getDb(), "groups", id))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as SmallGroup) : null
}

export async function createGroup(data: Omit<SmallGroup, "id" | "created_at" | "updated_at">): Promise<string> {
  const ref = await addDoc(collection(getDb(), "groups"), {
    ...data,
    created_at: now(),
    updated_at: now(),
  })
  return ref.id
}

export async function updateGroup(id: string, data: Partial<SmallGroup>): Promise<void> {
  await updateDoc(doc(getDb(), "groups", id), { ...data, updated_at: now() })
}

export async function deleteGroup(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), "groups", id))
}

// ==========================================
// MEMBERS (subcoleção de groups)
// ==========================================

export async function getMembers(groupId: string): Promise<Member[]> {
  const snap = await getDocs(collection(getDb(), "groups", groupId, "members"))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Member))
}

export async function addMember(groupId: string, data: Omit<Member, "id" | "group_id" | "created_at">): Promise<Member> {
  const ref = await addDoc(collection(getDb(), "groups", groupId, "members"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
  return { id: ref.id, group_id: groupId, created_at: now(), ...data }
}

export async function removeMember(groupId: string, memberId: string): Promise<void> {
  await deleteDoc(doc(getDb(), "groups", groupId, "members", memberId))
}

// ==========================================
// GROUP ROLES (subcoleção)
// ==========================================

export async function getGroupRoles(groupId: string): Promise<GroupRole[]> {
  const snap = await getDocs(collection(getDb(), "groups", groupId, "roles"))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GroupRole))
}

export async function setGroupRoles(groupId: string, roles: Omit<GroupRole, "id" | "group_id" | "created_at">[]): Promise<void> {
  // Limpar existentes
  const existing = await getDocs(collection(getDb(), "groups", groupId, "roles"))
  const deletePromises = existing.docs.map((d) => deleteDoc(d.ref))
  await Promise.all(deletePromises)
  // Criar novos
  const createPromises = roles.map((r) =>
    addDoc(collection(getDb(), "groups", groupId, "roles"), {
      ...r,
      group_id: groupId,
      created_at: now(),
    })
  )
  await Promise.all(createPromises)
}

// ==========================================
// SEASON LESSONS (subcoleção)
// ==========================================

export async function getSeasonLessons(groupId: string): Promise<SeasonLesson[]> {
  const snap = await getDocs(query(collection(getDb(), "groups", groupId, "lessons"), orderBy("week_number")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SeasonLesson))
}

export async function addSeasonLesson(groupId: string, data: Omit<SeasonLesson, "id" | "group_id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(getDb(), "groups", groupId, "lessons"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
  return ref.id
}

export async function deleteSeasonLesson(groupId: string, lessonId: string): Promise<void> {
  await deleteDoc(doc(getDb(), "groups", groupId, "lessons", lessonId))
}

// ==========================================
// ATTENDANCE (subcoleção)
// ==========================================

export async function getAttendance(groupId: string): Promise<AttendanceRecord[]> {
  const snap = await getDocs(query(collection(getDb(), "groups", groupId, "attendance"), orderBy("date", "desc")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AttendanceRecord))
}

export async function saveAttendance(groupId: string, date: string, records: AttendanceEntry[]): Promise<string> {
  const ref = await addDoc(collection(getDb(), "groups", groupId, "attendance"), {
    group_id: groupId,
    date,
    records,
    created_at: now(),
  })
  return ref.id
}

// ==========================================
// SERMONS (subcoleção)
// ==========================================

export async function getSermons(groupId: string): Promise<Sermon[]> {
  const snap = await getDocs(query(collection(getDb(), "groups", groupId, "sermons"), orderBy("date", "desc")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Sermon))
}

export async function addSermon(groupId: string, data: Omit<Sermon, "id" | "group_id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(getDb(), "groups", groupId, "sermons"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
  return ref.id
}

// ==========================================
// CARPOOLS (subcoleção)
// ==========================================

export async function getCarpools(groupId: string): Promise<Carpool[]> {
  const snap = await getDocs(query(collection(getDb(), "groups", groupId, "carpools"), where("is_active", "==", true)))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Carpool))
}

export async function addCarpool(groupId: string, data: Omit<Carpool, "id" | "group_id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(getDb(), "groups", groupId, "carpools"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
  return ref.id
}

export async function removeCarpool(groupId: string, carpoolId: string): Promise<void> {
  await deleteDoc(doc(getDb(), "groups", groupId, "carpools", carpoolId))
}

// ==========================================
// PRAYER REQUESTS (subcoleção)
// ==========================================

export async function getPrayerRequests(groupId: string): Promise<PrayerRequest[]> {
  const snap = await getDocs(query(collection(getDb(), "groups", groupId, "prayer_requests"), orderBy("created_at", "desc")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PrayerRequest))
}

export async function addPrayerRequest(groupId: string, data: Omit<PrayerRequest, "id" | "group_id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(getDb(), "groups", groupId, "prayer_requests"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
  return ref.id
}

export async function togglePrayerAnswered(groupId: string, requestId: string, isAnswered: boolean): Promise<void> {
  await updateDoc(doc(getDb(), "groups", groupId, "prayer_requests", requestId), { is_answered: isAnswered })
}

// ==========================================
// WEEKLY CHALLENGE (doc único por grupo)
// ==========================================

export async function getWeeklyChallenge(groupId: string): Promise<WeeklyChallenge | null> {
  const snap = await getDoc(doc(getDb(), "groups", groupId, "meta", "weekly_challenge"))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as WeeklyChallenge) : null
}

export async function setWeeklyChallenge(groupId: string, data: Omit<WeeklyChallenge, "id" | "group_id" | "created_at">): Promise<void> {
  await setDoc(doc(getDb(), "groups", groupId, "meta", "weekly_challenge"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
}

// ==========================================
// READING PLAN (doc único por grupo)
// ==========================================

export async function getReadingPlan(groupId: string): Promise<ReadingPlan | null> {
  const snap = await getDoc(doc(getDb(), "groups", groupId, "meta", "reading_plan"))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as ReadingPlan) : null
}

export async function setReadingPlan(groupId: string, data: Omit<ReadingPlan, "id" | "group_id" | "created_at">): Promise<void> {
  await setDoc(doc(getDb(), "groups", groupId, "meta", "reading_plan"), {
    ...data,
    group_id: groupId,
    created_at: now(),
  })
}

// ==========================================
// ANNOUNCEMENTS (coleção top-level)
// ==========================================

export async function getAnnouncements(): Promise<Announcement[]> {
  const snap = await getDocs(query(collection(getDb(), "announcements"), orderBy("created_at", "desc")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))
}

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const snap = await getDocs(query(collection(getDb(), "announcements"), where("is_active", "==", true), orderBy("created_at", "desc")))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))
}

export async function createAnnouncement(data: Omit<Announcement, "id" | "created_at">): Promise<string> {
  const ref = await addDoc(collection(getDb(), "announcements"), {
    ...data,
    created_at: now(),
  })
  return ref.id
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<void> {
  await updateDoc(doc(getDb(), "announcements", id), data)
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), "announcements", id))
}

// ==========================================
// LOAD GROUP WITH ALL SUBCOLLECTIONS
// ==========================================

export async function loadGroupFull(groupId: string): Promise<SmallGroup | null> {
  const group = await getGroup(groupId)
  if (!group) return null

  const [members, roles, lessons, attendance, sermons, carpools, prayerRequests, challenge, readingPlan] =
    await Promise.all([
      getMembers(groupId),
      getGroupRoles(groupId),
      getSeasonLessons(groupId),
      getAttendance(groupId),
      getSermons(groupId),
      getCarpools(groupId),
      getPrayerRequests(groupId),
      getWeeklyChallenge(groupId),
      getReadingPlan(groupId),
    ])

  return {
    ...group,
    members,
    roles,
    season_lessons: lessons,
    attendance,
    sermons,
    carpools,
    prayer_requests: prayerRequests,
    weekly_challenge: challenge,
    reading_plan: readingPlan,
  }
}