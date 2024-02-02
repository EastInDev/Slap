import useSWR from 'swr'
import fetcher from './fetcher'

export default function useCategories() {
  const { data, error, isLoading } = useSWR('/api/post/categories', fetcher)

  return {
    categories: data,
    isLoading,
    isError: error,
  }
}
