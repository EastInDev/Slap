import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(req, res) {
  const { rows } = await sql`
    SELECT * FROM categories
  `

  return NextResponse.json(rows)
}
