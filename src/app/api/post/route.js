import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function GET(req, res) {
  noStore()
  try {
    let result = []
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

    // const { rows } = await sql`
    //   SELECT * FROM posts
    // `

    rows.forEach((post) => {
      const index = result.findIndex((r) => r.id === post.id)

      if (index === -1) {
        result.push({
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          updated_at: post.updated_at,
          category_id: post.category_id,
          user: {
            id: post.user_id,
            nickname: post.nickname,
          },
          votes: post.vote_id
            ? [
                {
                  id: post.vote_id,
                  text: post.vote_text,
                  count: post.vote_count,
                },
              ]
            : [],
          total_count: post.total_vote_count,
        })
      } else {
        result[index].votes.push({
          id: post.vote_id,
          text: post.vote_text,
          count: post.vote_count,
        })
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.error({
      status: 500,
      message: '포스트 조회 실패',
    })
  }
}
