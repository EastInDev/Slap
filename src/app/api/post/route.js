import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(req, res) {
  try {
    const { rows } = await sql`
      SELECT 
        posts.id,
        posts.title,
        posts.content,
        posts.created_at,
        posts.updated_at,
        posts.category_id,
        posts.user_id,
        users.nickname,
        votes.id AS vote_id,
        votes.text AS vote_text,
        votes.post_id,
        COUNT(slaps.id) OVER (PARTITION BY votes.id) AS vote_count,
        COUNT(slaps.id) OVER (PARTITION BY posts.id) AS total_vote_count
      FROM 
        posts
      LEFT JOIN 
        votes
      ON 
        posts.id = votes.post_id
      LEFT JOIN 
        users
      ON 
        posts.user_id = users.id
      LEFT JOIN
        slaps
      ON
        votes.id = slaps.vote_id
    `

    console.log(rows)

    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.error({
      status: 500,
      message: '포스트 조회 실패',
    })
  }
}
