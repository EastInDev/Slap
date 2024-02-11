'use client'

import useSWR from 'swr'
import fetcher from './fetcher'

export default function useCategories() {
  const { data, error, isLoading } = useSWR('/api/post/categories', fetcher, {
    revalidateIfStale: false,
  })

  return {
    categories: data,
    isLoading,
    isError: error,
  }
}
