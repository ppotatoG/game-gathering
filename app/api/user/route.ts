import { collection, addDoc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

import { db } from '@/services/firebase';

export async function POST() {
  try {
    const userRef = collection(db, 'users');
    await addDoc(userRef, { name: 'name', year: 99, password: '1234', createdAt: new Date() });

    return NextResponse.json({ message: 'User registered successfully' });
  } catch (error) {
    return NextResponse.json({ message: error as string }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userRef = collection(db, 'users');
    const snapshot = await getDocs(userRef);
    const users = snapshot.docs.map(doc => doc.data());
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: error as string }, { status: 500 });
  }
}
