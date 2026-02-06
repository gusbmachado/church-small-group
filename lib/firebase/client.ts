"use client"

import { getAuth, Auth } from "firebase/auth"
import { initializeApp, getApps } from "firebase/app"
import { firebaseConfig } from "./config"

let auth: Auth

export function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
  }
  return auth
}
