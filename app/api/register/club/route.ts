import bcrypt from 'bcrypt';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { NextResponse, NextRequest } from 'next/server';

import { db } from '@/services/firebase';

export async function POST(req: NextRequest) {
  console.log('post')
  try {
    console.log('req', req);
    const { ownerId, password } = await req.json();

    if (!ownerId || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const clubRef = collection(db, 'clubs');
    const q = query(clubRef, where('ownerId', '==', ownerId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ message: 'Club does not exist' }, { status: 404 });
    }

    const clubDoc = snapshot.docs[0];
    const clubData = clubDoc.data();
    const hashedPassword = clubData.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid club password' }, { status: 401 });
    }

    return NextResponse.json(
      {
        message: 'Login success',
        clubId: clubDoc.id,
        ownerId: clubData.ownerId
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
