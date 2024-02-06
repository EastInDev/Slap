import useSWR from 'swr'
import fetcher from './fetcher'
import { useSession } from 'next-auth/react'

export default function useSlaps() {
  const { data: session } = useSession()
  const { data, error, isLoading } = useSWR('/api/slap', fetcher)

  let slaps = []
  data?.forEach((slap) => {
    if (session?.user?.id === slap.user_id) {
      slaps.push(slap)
    }
  })

  return {
    slaps: slaps,
    isLoading,
    isError: error,
  }
}
