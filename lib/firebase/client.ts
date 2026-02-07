"use client"

import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { initializeApp, getApps } from "firebase/app"
import { firebaseConfig } from "./config"

let auth: Auth
let firestore: Firestore

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
  }
  return auth
}

export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    firestore = getFirestore(app)
  }
  return firestore
}