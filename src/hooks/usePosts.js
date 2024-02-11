'use client'

import { getPosts, getCategoriesPosts } from '@/apis/post'

import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function usePosts(categoryId) {
  const { data: session } = useSession()
  const fetcher = categoryId
    ? () => getCategoriesPosts(categoryId)
    : () => getPosts(session?.user?.id)

  const swrKey = categoryId
    ? ['/api/post', session?.user?.id, categoryId]
    : ['/api/post', session?.user?.id]

  const { data: posts = [], ...res } = useSWR(swrKey, fetcher, {
    revalidateIfStale: false,
  })

  const getPost = (id) => {
    return posts.find((post) => post.id === id)
  }

  return {
    posts,
    ...res,
    getPost,
  }
}
