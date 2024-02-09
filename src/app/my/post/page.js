'use client'

import MyPost from '@/features/post/MyPost/MyPost'
import useMyPosts from '@/hooks/useMyPosts'

export default function MyPosts() {
  const { posts, isLoading, Error } = useMyPosts()

  if (isLoading) return <div>로딩중...</div>
  if (Error) return <div>에러 발생</div>

  console.log(posts)

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">내가 쓴 글</h1>
      <p className="mt-4">내가 쓴 글들을 모아보세요.</p>
      <div className="divider"></div>
      <MyPost posts={posts} />
    </div>
  )
}
