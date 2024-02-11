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
          on conflict (text, post_id) do nothing
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
    const { rows: likes } = await sql`
      SELECT post_id, user_id, COUNT(*) as like_count FROM likes
      GROUP BY post_id, user_id
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
            likesCount:
              likes.find((like) => like.post_id === post.id)?.like_count || 0,
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
      console.log(result)
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
          isLiked: likes.some(
            (like) => like.post_id === post.id && like.user_id === user_id,
          ),
          likesCount:
            likes.find((like) => like.post_id === post.id)?.like_count || 0,
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

export const getCountPosts = async () => {
  unstable_noStore()
  try {
    const { rows } = await sql`
      SELECT COUNT(*) FROM posts
    `

    return rows[0].count
  } catch (error) {
    console.error('포스트 수 조회 실패:', error)
    return null
  }
}

export const getPopularPosts = async ({ page }) => {
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
      ORDER BY
        total_vote_count DESC
      LIMIT 10
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
  } catch (error) {
    console.error('인기 포스트 조회 실패:', error)
    return null
  }
}

export const getLatestPosts = async ({ page }) => {
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
      ORDER BY
        posts.created_at DESC
      LIMIT 10
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
  } catch (error) {
    console.error('최신 포스트 조회 실패:', error)
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

export const addLike = async (user_id, post_id) => {
  unstable_noStore()
  try {
    await sql`
      INSERT INTO likes (comment_id, user_id, post_id)
      VALUES (1, ${user_id}, ${post_id})
    `
    return true
  } catch (error) {
    console.error('좋아요 추가 실패:', error)
    return null
  }
}

export const removeLike = async (user_id, post_id) => {
  unstable_noStore()
  try {
    await sql`
      DELETE FROM likes WHERE post_id = ${post_id} AND user_id = ${user_id}
    `
    return true
  } catch (error) {
    console.error('좋아요 삭제 실패:', error)
    return null
  }
}

export const addComment = async (
  content,
  post_id,
  user_id,
  comment_id = null,
) => {
  unstable_noStore()
  try {
    await sql`
      INSERT INTO comments (content, created_at, updated_at, post_id, user_id, comment_id, is_reply)
      VALUES (${content}, NOW(), NOW(), ${post_id}, ${user_id}, ${comment_id}, ${
      comment_id ? true : false
    })
    `
    return true
  } catch (error) {
    console.error('댓글 추가 실패:', error)
    return null
  }
}

export const getCommentsAndReplies = async (post_id) => {
  unstable_noStore()
  try {
    const { rows } = await sql`
      SELECT
        c1.id,
        c1.content,
        c1.created_at,
        c1.updated_at,
        c1.user_id,
        u1.nickname,
        c2.id as reply_id,
        c2.content as reply_content,
        c2.created_at as reply_created_at,
        c2.updated_at as reply_updated_at,
        c2.user_id as reply_user_id,
        u2.nickname as reply_nickname
      FROM
        comments c1
      LEFT JOIN
        users u1
      ON
        c1.user_id = u1.id
      LEFT JOIN
        comments c2
      ON
        c1.id = c2.comment_id AND c2.is_reply = true
      LEFT JOIN
        users u2
      ON
        c2.user_id = u2.id
      WHERE
        c1.post_id = ${post_id} AND c1.is_reply = false
    `

    const comments = []
    const replies = {}

    for (let row of rows) {
      if (!replies[row.id]) {
        replies[row.id] = []
      }

      if (row.reply_id) {
        replies[row.id].push({
          id: row.reply_id,
          content: row.reply_content,
          created_at: row.reply_created_at,
          updated_at: row.reply_updated_at,
          user_id: row.reply_user_id,
          nickname: row.reply_nickname,
        })
      }

      if (!comments.some((comment) => comment.id === row.id)) {
        comments.push({
          id: row.id,
          content: row.content,
          created_at: row.created_at,
          updated_at: row.updated_at,
          user_id: row.user_id,
          nickname: row.nickname,
          replies: replies[row.id],
        })
      }
    }

    return comments
  } catch (error) {
    console.error('댓글 조회 실패:', error)
    return null
  }
}
