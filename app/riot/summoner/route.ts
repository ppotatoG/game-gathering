import { NextResponse } from 'next/server'

import { fetchSummonerData } from '@/services/riot'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  const tag = searchParams.get('tag')

  if (!name || !tag) {
    return NextResponse.json(
      { error: 'Missing name or tag query parameter' },
      { status: 400 }
    )
  }

  try {
    const data = await fetchSummonerData(name, tag)
    console.log('data in api/route.ts:', data)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
