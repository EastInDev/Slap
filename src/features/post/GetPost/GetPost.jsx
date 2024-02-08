'use client'

import { useEffect, useState } from 'react'
import { getPosts, addVote, getSlaps } from '@/apis/post'
import { useSession } from 'next-auth/react'

const Post = ({ postGroup, index, handleVote }) => {
  return (
    <div key={index} className="p-4 border rounded shadow">
      <p className="text-sm text-gray-500">작성자: {postGroup[0].nickname}</p>
      <p className="text-sm text-gray-500">
        생성 시간: {new Date(postGroup[0].created_at).toLocaleString()}
      </p>
      <h2 className="mt-2 text-xl font-bold">{postGroup[0].title}</h2>
      <p className="mt-2">{postGroup[0].content}</p>
      {postGroup.map((post, i) => {
        const votePercentage =
          (post.vote_count / (post.total_vote_count || 1)) * 100
        return (
          <div key={i} className="mt-2 flex items-center">
            <button
              className="btn relative w-full text-left"
              style={{
                background: `linear-gradient(to right, #2563eb ${votePercentage}%, #e5e7eb ${votePercentage}%)`,
              }}
              onClick={() => handleVote(postGroup[0].id, post.vote_id)}
            >
              <span>{post.vote_text}</span>
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

const GetPost = () => {
  const [posts, setPosts] = useState([])
  const [alertVisible, setAlertVisible] = useState(false)
  const { data: session } = useSession()
  const [votes, setVotes] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const data = await getPosts()
    const groupedData = data.reduce((acc, cur) => {
      if (!acc[cur.post_id]) {
        acc[cur.post_id] = [cur]
      } else {
        const index = acc[cur.post_id].findIndex(
          (item) => item.vote_id === cur.vote_id,
        )
        if (index === -1) {
          acc[cur.post_id].push(cur)
        } else {
          acc[cur.post_id][index] = cur
        }
      }
      return acc
    }, {})
    setPosts(groupedData)
  }

  const handleVote = async (postId, voteId) => {
    if (!session || !session.user.id) {
      setAlertVisible(true)

      setTimeout(() => {
        setAlertVisible(false)
      }, 3000)
      return
    }

    console.log(`투표 항목 ${voteId}에 투표하였습니다.`)

    // 일단 클라이언트에서 투표 수 업데이트
    const newPosts = Object.values(posts).map((postGroup, index) => {
      if (postGroup[0].id === postId) {
        return postGroup.map((post) =>
          post.vote_id === voteId
            ? { ...post, vote_count: post.vote_count + 1 }
            : post,
        )
      }
      return postGroup
    })

    // post 상태 업데이트
    setPosts(newPosts)
    console.log('newPosts', posts)
    console.log('votes', votes)

    // 백엔드에 투표 요청
    const result = await addVote(postId, voteId, session.user.id)
    if (result) {
      console.log('투표에 성공하였습니다.')
      await fetchData()
    } else {
      console.error('투표에 실패하였습니다.')
      // 실패했을 경우, 원래의 투표 상태로 롤백
      setVotes(Object.values(posts))
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.values(posts).map((postGroup, index) => (
        <Post
          key={index}
          postGroup={postGroup}
          index={index}
          handleVote={handleVote}
        />
      ))}
    </div>
  )
}

export default GetPost
