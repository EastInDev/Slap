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

export const getPosts = async (user_id) => {
  unstable_noStore()
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

    if (!user_id) {
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
            isVote: false,
            votes: post.vote_id
              ? [
                  {
                    id: post.vote_id,
                    text: post.vote_text,
                    count: post.vote_count,
                    thisVote: false,
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
            thisVote: false,
          })
        }
      })

      return result
    }

    const { rows: slaps } = await sql`
      SELECT id, vote_id, post_id, user_id FROM slaps
      WHERE user_id = ${user_id}
    `

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
          isVote: slaps.some((slap) => slap.post_id === post.id),
          votes: post.vote_id
            ? [
                {
                  id: post.vote_id,
                  text: post.vote_text,
                  count: post.vote_count,
                  thisVote: slaps.find((slap) => slap.post_id === post.id)
                    ? slaps.find((slap) => slap.post_id === post.id).vote_id ===
                      post.vote_id
                    : null,
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
          thisVote: slaps.find((slap) => slap.post_id === post.id)
            ? slaps.find((slap) => slap.post_id === post.id).vote_id ===
              post.vote_id
            : null,
        })
      }
    })
    return result
  } catch (error) {
    console.error('포스트 조회 실패:', error)
    return null
  }
}

export const getMyPosts = async (user_id) => {
  unstable_noStore()
  try {
    const { rows } = await sql`
      SELECT * FROM posts
      WHERE user_id = ${user_id}
    `

    return rows
  } catch (error) {
    console.error('내 포스트 조회 실패:', error)
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

export const addLike = async (user_id) => {
  try {
    await sql`
      INSERT INTO likes (is_like, comment_id, user_id)
      VALUES (true, 1, ${user_id})
    `
    return true
  } catch (error) {
    console.error('좋아요 추가 실패:', error)
    return null
  }
}

export const removeLike = async (user_id) => {
  try {
    await sql`
      DELETE FROM likes WHERE user_id = ${user_id}
    `
    return true
  } catch (error) {
    console.error('좋아요 삭제 실패:', error)
    return null
  }
}
