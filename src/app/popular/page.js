'use client'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { getPopularPosts, getCountPosts } from '@/apis/post'
import useInfiniteScroll from 'react-infinite-scroll-hook'

export default function Popular() {
  const { data: count = 0 } = useSWR('api/popular', () => getCountPosts())

  const getKey = useCallback((page, prevData) => {
    if (prevData && !prevData.length) return null
    return `/api/popular?page=${page}`
  }, [])

  const {
    data,
    isValidating,
    setSize: setPage,
  } = useSWRInfinite(getKey, (page) => getPopularPosts({ page }))

  const dataList = useMemo(() => {
    if (!data) return []

    return data.flat()
  }, [data])

  const hasNextPage = useMemo(() => dataList.length < count, [data])

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage,
    onLoadMore: () => setPage((page) => page + 1),
  })

  return (
    <div className="scrollLayout">
      {data &&
        data.map((page, i) => (
          <div key={i}>
            {page.map((post, post_index) => (
              <div
                key={post.id}
                className={`card w-full h-[calc(calc(100dvh-100px)*0.8)] bg-base-100 shadow-xl ${
                  i === 0 && post_index === 0 ? ' mt-6' : ' mt-20'
                }`}
              >
                <div className="card-body">
                  <h2 className="card-title">{post.title}</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      <div className="skeleton mt-20 w-32 h-32" ref={sentryRef} />
    </div>
  )
}
