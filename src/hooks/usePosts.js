import useSWR from 'swr'
import fetcher from './fetcher'

export default function usePosts() {
  const { data, error, isLoading } = useSWR('/api/post', fetcher)
  console.log(data)

  return {
    posts: data,
    isLoading,
    isError: error,
  }
}
