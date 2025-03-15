import { NextResponse } from "next/server"
import { db } from "@/services/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"

export async function GET() {
  const snapshot = await getDocs(collection(db, "users"))
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const data = await request.json()
  const docRef = await addDoc(collection(db, "users"), data)
  return NextResponse.json({ id: docRef.id })
}
