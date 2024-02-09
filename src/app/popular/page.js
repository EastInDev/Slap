'use client'
import { useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import { getPopularPosts } from '@/apis/post'
import useInfiniteScroll from 'react-infinite-scroll-hook'

export default function Popular() {
  const getKey = useCallback((page, prevData) => {
    if (prevData && !prevData.length) return null
    return `/api/popular?page=${page}`
  }, [])

  const {
    data,
    isValidating,
    setSize: setPage,
  } = useSWRInfinite(getKey, (page) => getPopularPosts({ page }))

  console.log(data)

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage: data && data[data.length - 1].length === 10,
    onLoadMore: () => setPage((prev) => prev + 1),
  })

  return (
    <div className="scrollLayout">
      {data &&
        data.map((page, i) => (
          <div key={i}>
            {page.map((post) => (
              <div key={post.id}>{post.title}</div>
            ))}
          </div>
        ))}
      <div className="skeleton w-32 h-32" ref={sentryRef} />
    </div>
  )
}
