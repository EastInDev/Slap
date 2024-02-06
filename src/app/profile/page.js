'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { updateProfile } from '@/apis/users'

export default function Profile() {
  const { data: session, status } = useSession()
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    if (session) {
      setNickname(session.user.name)
      console.log(nickname)
    }
  }, [session, nickname])

  if (status === 'loading') return null
  if (!session) {
    return (
      <div className="w-full">
        <h1 className="text-center text-2xl font-bold">
          로그인 후 이용해주세요.
        </h1>
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(session.user.id, nickname)
      alert('프로필이 업데이트 되었습니다.')
    } catch (error) {
      alert('프로필 업데이트에 실패했습니다.')
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">프로필</h1>
      <p className="mt-4">다른 사람들에게 표시될 정보들입니다.</p>
      <div className="divider"></div>
      <h2 className="text-xl font-bold">닉네임</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="input input-bordered w-full max-w-xs mt-4"
      />
      <p className="text-sm text-gray-500 mt-2">
        다른 사람들에게 표시될 닉네임입니다.
      </p>
      <button onClick={handleUpdateProfile} className="btn mt-4">
        저장
      </button>
    </div>
  )
}
