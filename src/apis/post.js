'use server'

import { sql } from '@vercel/postgres'
import { useSession } from 'next-auth/react'

export const createPost = async ({
  voteText,
  voteOptions,
  category,
  content,
  userId,
}) => {
  try {
    const { rows } = await sql`
      INSERT INTO posts (title, content, created_at, updated_at, category_id, user_id)
      VALUES (${voteText}, ${content}, NOW(), NOW(), ${category}, 1)
      RETURNING id, title, content, created_at, updated_at
    `

    voteOptions.forEach(async (option) => {
      await sql`
          INSERT INTO votes (text, post_id)
          VALUES (${option}, ${rows[0].id})
        `
    })
  } catch (error) {
    console.error('포스트 생성 실패:', error)
    return null
  }
}
