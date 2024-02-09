'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { addLike, removeLike } from '@/apis/post'
import { Heart, Star, MessageSquareText } from 'lucide-react'
import { set } from 'lodash'

const formatVoteCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}천명 투표`
  } else {
    return `${count}명 투표`
  }
}

const timeAgo = (date) => {
  const now = Date.now()
  const diff = now - new Date(date)

  const seconds = diff / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if (days > 1) {
    return `${Math.floor(days)}일 전`
  } else if (hours > 1) {
    return `${Math.floor(hours)}시간 전`
  } else if (minutes > 1) {
    return `${Math.floor(minutes)}분 전`
  } else {
    return '방금 전'
  }
}

const Post = ({ post, handleVote }) => {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likesCount)

  const handleLike = async () => {
    if (!session || !session.user.id) {
      document.getElementById('NotLoginDialog').showModal()
      return
    }

    if (isLiked) {
      const result = await removeLike(session.user.id, post.id)
      if (result) {
        setIsLiked(false)
        setLikesCount(likesCount - 1)
      }
    } else {
      const result = await addLike(session.user.id, post.id)
      if (result) {
        setIsLiked(true)
        setLikesCount((isNaN(likesCount) ? 0 : likesCount) + 1)
      }
    }
  }

  const handleFavorite = () => {
    console.log('즐겨찾기 버튼 클릭')
  }

  const handleComment = () => {
    console.log('댓글 버튼 클릭')
  }

  return (
    <div className="p-4 border rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-lg text-white">{post.user.nickname}</span>
          <span className="text-sm text-gray-500 ml-2">
            {timeAgo(post.created_at)}
          </span>
        </div>
        <button onClick={handleFavorite} className="btn text-yellow-500">
          <Star />
        </button>
      </div>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p className="mt-2">{post.content}</p>
      <p className="mt-2">{formatVoteCount(post.total_count)}</p>

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
      <button
        onClick={handleLike}
        className={`btn mt-2 mr-2 ${isLiked ? 'text-red-500' : ''}`}
      >
        <Heart fill={isLiked ? '#ED0A3F' : ''} />
      </button>

      <button onClick={handleComment} className="btn text-green-500">
        <MessageSquareText />
      </button>
      <p className="mt-2">좋아요 {likesCount || '0'}개</p>
    </div>
  )
}

export default Post
