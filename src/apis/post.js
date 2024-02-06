'use server'

import { sql } from '@vercel/postgres'
import { unstable_noStore } from 'next/cache'

export const createPost = async ({
  voteText,
  voteOptions,
  category,
  content,
  userId,
}) => {
  try {
    console.time('포스트 생성 시간')
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
    console.timeEnd('포스트 생성 시간')
  } catch (error) {
    console.error('포스트 생성 실패:', error)
    return null
  }
}

export const getPosts = async () => {
  try {
    console.time('포스트 조회 시간')
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
    console.timeEnd('포스트 조회 시간')
    console.log(rows.length)
    return rows
  } catch (error) {
    console.error('포스트 조회 실패:', error)
    return null
  }
}

export const addVote = async (post_id, vote_id, user_id) => {
  unstable_noStore()
  try {
    console.time('투표 추가 시간')
    await sql`
      INSERT INTO slaps (post_id, vote_id, user_id, updated_at)
      VALUES (${post_id}, ${vote_id}, ${user_id}, NOW())
      on conflict (post_id, user_id) do update set vote_id = ${vote_id}, updated_at = NOW()
    `
    console.timeEnd('투표 추가 시간')
    return true
  } catch (error) {
    console.error('투표 추가 실패:', error)
    return null
  }
}

export const getSlaps = async (user_id) => {
  try {
    const { rows } = await sql`
      SELECT * FROM slaps WHERE user_id = ${user_id}
    `

    return rows
  } catch (error) {
    console.error('슬랩 조회 실패:', error)
    return null
  }
}
