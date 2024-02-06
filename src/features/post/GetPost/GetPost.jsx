'use client'

import { useEffect, useState } from 'react'
import { getPosts, addVote } from '@/apis/post'
import { groupBy } from 'lodash'
import { useSession } from 'next-auth/react'

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
    setVotes(Object.values(groupedData))
  }

  const vote = async (postId, voteId) => {
    if (!session || !session.user.id) {
      setAlertVisible(true)

      setTimeout(() => {
        setAlertVisible(false)
      }, 3000)
      return
    }

    console.log(`투표 항목 ${voteId}에 투표하였습니다.`)

    // 일단 클라이언트에서 투표 수 업데이트
    const newVotes = votes.map((postGroup) =>
      postGroup.map((post) =>
        post.post_id === postId && post.vote_id === voteId
          ? { ...post, vote_count: post.vote_count + 1 }
          : post,
      ),
    )
    setVotes(newVotes)

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
      {alertVisible && (
        <div
          role="alert"
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        >
          <div className="alert alert-warning max-w-[230px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>로그인 후 시도해주세요!</span>
          </div>
        </div>
      )}
      {Object.values(posts).map((postGroup, index) => (
        <div key={index} className="p-4 border rounded shadow">
          <p className="text-sm text-gray-500">
            작성자: {postGroup[0].nickname}
          </p>
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
                  onClick={() => vote(postGroup[0].id, post.vote_id)}
                >
                  <span>{post.vote_text}</span>
                  <span className="px-3 py-2 ml-auto text-white bg-blue-500 rounded">
                    {isNaN(votePercentage) ? '0.00' : votePercentage.toFixed(2)}
                    %
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default GetPost
