'use client'

import { getMyComments } from '@/apis/post'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function useMyComments() {
  const { data: session } = useSession()
  const { data: comments = [], ...res } = useSWR(
    '/api/my/comment' + session?.user?.id,
    () => getMyComments(session?.user?.id),
  )

  return {
    comments,
    ...res,
  }
}
