'use client'
import { useCallback, useMemo } from 'react'
import usePosts from '@/hooks/usePosts'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { getLatestPosts, getCountPosts } from '@/apis/post'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import Post from '@/features/post/MainPost/Post'

export default function Latest() {
  const { data: count = 0 } = useSWR('api/latest', () => getCountPosts())
  const { getPost, mutate } = usePosts()

  const handleVote = async (postId, voteId) => {
    if (!session || !session.user.id) {
      document.getElementById('NotLoginDialog').showModal()
      return
    }

    const newPosts = produce(posts, (draft) => {
      draft.forEach((post) => {
        if (post.id === postId) {
          if (!post.isVote) {
            post.total_count++
            post.isVote = true
          }
          post.votes.forEach((vote) => {
            if (vote.id === voteId) {
              if (!vote.thisVote) {
                vote.count++
                vote.thisVote = true
              }
            } else {
              if (vote.thisVote) {
                vote.count--
                vote.thisVote = false
              }
            }
          })
        }
      })
    })

    mutate(newPosts, { revalidate: false })

    await addVote(postId, voteId, session.user.id)
  }

  const getKey = useCallback((page, prevData) => {
    if (prevData && !prevData.length) return null
    return { keyword: `/api/popular`, page: page }
  }, [])

  const {
    data: posts,
    isValidating,
    size: page,
    setSize: setPage,
  } = useSWRInfinite(getKey, ({ keyword, page }) => getPopularPosts({ page }), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
    revalidateFirstPage: false,
  })

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
          <Post post={post} handleVote={handleVote} />
        </div>
      ))}

      <div
        className="skeleton mt-20 w-full h-[calc(calc(100dvh-100px)*0.8)]"
        ref={sentryRef}
      />
    </div>
  )
}
