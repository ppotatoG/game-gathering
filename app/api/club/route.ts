import bcrypt from 'bcrypt';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { NextResponse, NextRequest } from 'next/server';

import { db } from '@/services/firebase';

const COLLECTION_NAME = 'clubs';

export async function POST(req: NextRequest) {
  console.log('post')
  try {
    console.log('req', req);
    const { clubName, ownerId, password } = await req.json();

    if (!clubName || !ownerId || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const clubRef = collection(db, COLLECTION_NAME);
    const q = query(clubRef, where('clubName', '==', clubName));
    const existingClubs = await getDocs(q);

    if (!existingClubs.empty) {
      return NextResponse.json({ message: 'Club already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await addDoc(clubRef, {
      clubName,
      ownerId,
      password: hashedPassword,
      createdAt: new Date()
    });

    return NextResponse.json({
      result: true,
      message: 'Club created successfully',
    }, {status: 200});
  } catch (error) {
    return NextResponse.json({ message: error as string }, { status: 500 });
  }
}
