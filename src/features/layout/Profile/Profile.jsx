'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

const Profile = () => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <button
        className="btn btn-primary "
        onClick={() => signIn('kakao', { redirect: true, callbackUrl: '/' })}
      >
        로그인
      </button>
    )
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1 h-8">
        {session.user.nickname}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a onClick={() => signOut()}>로그아웃</a>
        </li>
        <li>
          <a>프로필 수정</a>
        </li>
      </ul>
    </div>
  )
}

export default Profile
