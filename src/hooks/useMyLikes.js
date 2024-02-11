'use client'

import { getMyLikes } from '@/apis/post'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function useMyLikes() {
  const { data: session } = useSession()
  const { data: likes = [], ...res } = useSWR(
    '/api/my/like' + session?.user?.id,
    () => getMyLikes(session?.user?.id),
  )

  return {
    likes,
    ...res,
  }
}
