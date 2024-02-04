'use server'

import { sql } from '@vercel/postgres'

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
      VALUES (${voteText}, ${content}, NOW(), NOW(), ${category}, ${userId})
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

export const getPosts = async () => {
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
    return rows
  } catch (error) {
    console.error('포스트 조회 실패:', error)
    return null
  }
}

export const addVote = async (post_id, vote_id, user_id) => {
  try {
    const { rows } = await sql`
      SELECT * FROM slaps
      WHERE post_id = ${post_id} AND user_id = ${user_id}
    `

    if (rows.length > 0) {
      console.log('이전 투표를 삭제하고 새로운 투표를 추가합니다.')

      await sql`
        DELETE FROM slaps
        WHERE post_id = ${post_id} AND user_id = ${user_id}
      `
    }

    await sql`
      INSERT INTO slaps (post_id, vote_id, user_id, updated_at)
      VALUES (${post_id}, ${vote_id}, ${user_id}, NOW())
    `

    console.log('투표에 성공하였습니다.')
    return true
  } catch (error) {
    console.error('투표 추가 실패:', error)
    return null
  }
}
