'use client'

import { getMySlaps } from '@/apis/post'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function useMyLikes() {
  const { data: session } = useSession()
  const { data: slaps = [], ...res } = useSWR(
    '/api/my/slap' + session?.user?.id,
    () => getMySlaps(session?.user?.id),
  )

  return {
    slaps,
    ...res,
  }
}
