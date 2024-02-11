'use client'

import useMyComments from '@/hooks/useMyComments'
import { useSession } from 'next-auth/react'
import Post from '../../post/MainPost/Post'
import NotLoginDialog from '@/components/Dialog/NotLoginDialog'
import { produce } from 'immer'
import { addVote } from '@/apis/post'
import usePosts from '@/hooks/usePosts'

const MyComments = () => {
  const { data: session } = useSession()
  const { comments, isLoading, error } = useMyComments()
  const { getPost } = usePosts()

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
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            {comment.content}
            <span className="text-sm text-base-content ml-4">
              ({comment.title})
            </span>
          </div>
          <div className="collapse-content">
            <Post post={getPost(comment.post_id)} handleVote={handleVote} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyComments
