'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import usePosts from '@/hooks/usePosts'
import AlertNotLogin from '@/components/Alert/AlertNotLogin/AlertNotLogin'

const Post = () => {
  return (
    <div key={index} className="p-4 border rounded shadow">
      <p className="text-sm text-gray-500">작성자: {}</p>
      <p className="text-sm text-gray-500">생성 시간: {}</p>
      <h2 className="mt-2 text-xl font-bold">{}</h2>
      <p className="mt-2">{}</p>
      <div key={i} className="mt-2 flex items-center">
        <button
          className="btn relative w-full text-left"
          // style={{
          //   background: `linear-gradient(to right, #2563eb ${votePercentage}%, #e5e7eb ${votePercentage}%)`,
          // }}
        >
          <span>{}</span>
          <span className="px-3 py-2 ml-auto text-white bg-blue-500 rounded"></span>
        </button>
      </div>
    </div>
  )
}

const MainPost = () => {
  const { posts, isLoading, isError } = usePosts()
  const [alertVisible, setAlertVisible] = useState(false)
  const { data: session } = useSession()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error...</div>

  return (
    <div className="grid grid-cols-2 gap-4">
      {alertVisible && <AlertNotLogin />}
    </div>
  )
}

export default MainPost
