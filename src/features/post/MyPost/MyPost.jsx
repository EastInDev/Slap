'use client'

import useMyPosts from '@/hooks/useMyPosts'
import { useSession } from 'next-auth/react'
import Post from '../MainPost/Post'
import NotLoginDialog from '@/components/Dialog/NotLoginDialog'
import { produce } from 'immer'
import { addVote } from '@/apis/post'

const MyPost = () => {
  const { data: session } = useSession()
  const { posts, isLoading, error, mutate } = useMyPosts()

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
  if (error) return <div>에러 발생</div>

  return (
    <div>
      <NotLoginDialog />
      {posts.map((post) => (
        <div
          key={post.id}
          className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">{post.title}</div>
          <div className="collapse-content">
            <Post post={post} handleVote={handleVote} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyPost
