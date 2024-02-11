'use client'

import { getPosts } from '@/apis/post'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function useMyPosts() {
  const { data: session } = useSession()
  const { data: posts = [], ...res } = useSWR(
    '/api/my/post' + session?.user?.id,
    () => getPosts(session?.user?.id),
  )

  return {
    posts: posts.filter((post) => post.user.id === session?.user?.id),
    ...res,
  }
}
