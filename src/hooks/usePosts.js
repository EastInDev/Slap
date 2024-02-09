import { getPosts } from '@/apis/post'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

export default function usePosts() {
  const { data: session } = useSession()
  const { data: posts = [], ...res } = useSWR('/api/post', () =>
    getPosts(session?.user?.id),
  )

  return {
    posts,
    ...res,
  }
}
