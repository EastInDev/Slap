'use client'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { getLatestPosts, getCountPosts } from '@/apis/post'
import useInfiniteScroll from 'react-infinite-scroll-hook'

export default function Latest() {
  const { data: count = 0 } = useSWR('api/latest', () => getCountPosts())

  const getKey = useCallback((page, prevData) => {
    if (prevData && !prevData.length) return null
    return `/api/latest?page=${page}`
  }, [])

  const {
    data: posts,
    isValidating,
    setSize: setPage,
  } = useSWRInfinite(getKey, (page) => getLatestPosts({ page }))

  const dataList = useMemo(() => {
    if (!posts) return []

    return posts.flat()
  }, [posts])

  const hasNextPage = useMemo(() => dataList.length < count, [posts])

  const [sentryRef] = useInfiniteScroll({
    loading: isValidating,
    hasNextPage,
    onLoadMore: () => setPage((page) => page + 1),
  })

  return (
    <div
      className="scrollLayout"
      style={{
        overflow: 'auto',
        height: '100%',
        scrollSnapType: 'y mandatory',
        display: 'grid',
      }}
    >
      {dataList.map((post, i) => (
        <div
          key={i}
          className={`card w-full h-[calc(calc(100dvh-100px)*0.8)] bg-base-100 shadow-xl ${
            i === 0 ? ' mt-6' : ' mt-20'
          }`}
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="card-body">
            <h2 className="card-title">{post.title}</h2>
            <p>{post.content}</p>
            {post.votes.map((vote, i) => {
              const votePercentage =
                (parseInt(vote.count) / (parseInt(post.total_count) || 1)) * 100
              return (
                <div key={i} className="mt-2 flex items-center">
                  <button
                    className="btn relative w-full text-left"
                    style={{
                      background: `linear-gradient(to right, #2563eb ${votePercentage}%, #e5e7eb ${votePercentage}%)`,
                    }}
                    onClick={() => handleVote(post.id, vote.id)}
                  >
                    <span>{vote.text}</span>
                    <span className="px-3 py-2 ml-auto text-white bg-blue-500 rounded">
                      {isNaN(votePercentage)
                        ? '0.00'
                        : votePercentage.toFixed(2)}
                      %
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="skeleton mt-20 w-full h-32" ref={sentryRef} />
    </div>
  )
}
