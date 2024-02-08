'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { addVote, getPosts } from '@/apis/post'
import { produce } from 'immer'
import Post from '@/features/post/MainPost/Post'
import NotLoginDialog from '@/components/Dialog/NotLoginDialog'

const MainPost = () => {
  const { data: session } = useSession()
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPosts(session?.user?.id)

      setPosts(res)
    }

    fetchData()
  }, [session])

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

    setPosts(newPosts)

    await addVote(postId, voteId, session.user.id)
  }

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
