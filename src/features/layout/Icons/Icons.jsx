'use client'

import { useSession } from 'next-auth/react'
import { Bell, PlusSquare } from 'lucide-react'
import AddPost from '@/features/post/AddPost/AddPost'

const Icons = () => {
  const { data: session } = useSession()

  if (!session) {
    return <></>
  }

  return (
    <>
      <button
        className="flex mt-4 mr-6 cursor-pointer"
        onClick={() => document.getElementById('my_modal_1').showModal()}
      >
        <PlusSquare />
      </button>
      <Bell className="mt-4 mr-5 cursor-pointer" />
      <AddPost />
    </>
  )
}

export default Icons
