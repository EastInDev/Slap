'use client'

import { useSession } from 'next-auth/react'
import usePosts from '@/hooks/usePosts'
import NotLoginDialog from '@/components/Dialog/NotLoginDialog'
import { addVote } from '@/apis/post'
import useSlaps from '@/hooks/useSlaps'
import { produce } from 'immer'

const Post = ({ post, handleVote }) => {
  return (
    <div className="p-4 border rounded shadow">
      <p className="text-sm text-gray-500">작성자: {post.user.nickname}</p>
      <p className="text-sm text-gray-500">
        생성 시간: {new Date(post.created_at).toLocaleString()}
      </p>
      <h2 className="mt-2 text-xl font-bold">{post.title}</h2>
      <p className="mt-2">{post.content}</p>
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
                {isNaN(votePercentage) ? '0.00' : votePercentage.toFixed(2)}%
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

const MainPost = () => {
  const { slaps } = useSlaps()
  const { posts, isLoading, isError, mutate } = usePosts()
  const { data: session } = useSession()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>

  const handleVote = async (postId, voteId) => {
    if (!session || !session.user.id) {
      document.getElementById('NotLoginDialog').showModal()
      return
    }

    const nextPosts = produce(posts, (draft) => {
      let isSlapCheck = false
      draft.forEach((post) => {
        if (post.id === postId) {
          post.votes.forEach((vote) => {
            if (vote.id === voteId) {
              vote.count++
            }
          })

          slaps.forEach((slap) => {
            if (slap.post_id === postId) {
              isSlapCheck = true
              post.votes.forEach((vote) => {
                if (vote.id === slap.vote_id) {
                  vote.count--
                }
              })
            }
          })

          if (!isSlapCheck) {
            post.total_count++
          }
        }
      })
    })

    console.log('nextPosts', nextPosts)

    mutate(nextPosts)

    await addVote(postId, voteId, session.user.id)

    console.log(`투표 항목 ${voteId}에 투표하였습니다.`)
  }

  console.log('posts', posts)

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
