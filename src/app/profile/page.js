'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { updateProfile } from '@/apis/users'
import { useForm } from 'react-hook-form'

const UpdateDialog = () => {
  return (
    <dialog id="profileUpdatedDialog" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">알림!</h3>
        <p className="py-4">프로필이 업데이트되었습니다.</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default function Profile() {
  const { data: session, status } = useSession()
  const { register, handleSubmit, setValue } = useForm()

  const onSubmit = async (data) => {
    await updateProfile(session.user.id, data.nickname)
    document.getElementById('profileUpdatedDialog').showModal()
  }

  useEffect(() => {
    if (session) {
      setValue('nickname', session.user.nickname)
    }
  }, [session, setValue])

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

  return (
    <div className="w-full">
      <UpdateDialog />
      <h1 className="text-2xl font-bold">프로필</h1>
      <p className="mt-4">다른 사람들에게 표시될 정보들입니다.</p>
      <div className="divider"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-xl font-bold">닉네임</h2>
        <input
          type="text"
          {...register('nickname')}
          className="input input-bordered w-full max-w-xs mt-4"
        />
        <p className="text-sm text-gray-500 mt-2">
          다른 사람들에게 표시될 닉네임입니다.
        </p>
        <button className="btn mt-4">저장</button>
      </form>
    </div>
  )
}
