import { getPosts, getCategoriesPosts } from '@/apis/post'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function usePosts(categoryId) {
  const { data: session } = useSession()
  const fetcher = categoryId
    ? () => getCategoriesPosts(categoryId)
    : () => getPosts(session?.user?.id)
  const { data: posts = [], ...res } = useSWR(
    '/api/post' + session?.user?.id,
    fetcher,
    {
      revalidateIfStale: false,
    },
  )

  return {
    posts,
    ...res,
  }
}
