import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function GET(req, res) {
  noStore()
  try {
    const { rows } = await sql`
      SELECT * FROM slaps
    `

    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.error({
      status: 500,
      message: '포스트 조회 실패',
    })
  }
}
