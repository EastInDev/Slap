'use client'

import { useSession } from 'next-auth/react'
import { addVote } from '@/apis/post'
import { produce } from 'immer'
import Post from '@/features/post/MainPost/Post'
import NotLoginDialog from '@/components/Dialog/NotLoginDialog'
import usePosts from '@/hooks/usePosts'
import { useState } from 'react'

const MainPost = ({ selectedCategoryId }) => {
  const { data: session } = useSession()
  const { posts, isLoading, isError, mutate } = usePosts(selectedCategoryId) // 선택된 카테고리의 id를 usePosts 훅의 인자로 전달합니다.

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

  if (isLoading) return <div>로딩 중...</div>
  if (isError) return <div>에러 발생</div>

  return (
    <div className="grid grid-cols-2 gap-4">
      <NotLoginDialog />
      {posts.map((post, index) => (
        <Post key={post.id} post={post} handleVote={handleVote} />
      ))}
    </div>
  )
}

export default MainPost
