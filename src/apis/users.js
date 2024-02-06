'use server'

import { sql } from '@vercel/postgres'

export const getUser = async (id, type) => {
  try {
    const { rows } = await sql`
      SELECT * FROM users WHERE sns_id = ${id} AND sns_type = ${type}
    `

    return rows[0]
  } catch (error) {
    throw new Error(error.message)
  }
}

export const createUser = async (user, account) => {
  try {
    await sql`
      INSERT INTO users (sns_id, sns_type, nickname, role)
      VALUES (${user.id}, ${account.provider}, ${user.name}, '사용자')
    `
  } catch (error) {
    throw new Error(error.message)
  }
}

export const loginUser = async (user, account) => {
  try {
    await sql`
      UPDATE users 
      set last_login_time = now(), refresh_token = ${account.refresh_token} 
      WHERE sns_id = ${user.id} and sns_type = ${account.provider}
    `
  } catch (error) {
    throw new Error(error.message)
  }
}

export const updateProfile = async (id, nickname) => {
  try {
    await sql`
      UPDATE users 
      set nickname = ${nickname}
      WHERE id = ${id}
    `
  } catch (error) {
    throw new Error(error.message)
  }
}
