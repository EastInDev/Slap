import MyPost from '@/features/my/MyPost/MyPost'
import useMyPosts from '@/hooks/useMyPosts'

export default function MyPosts() {
  return (
    <div className="w-full h-full overflow-y-auto scrollLayout">
      <h1 className="text-2xl font-bold">내가 쓴 글</h1>
      <p className="mt-4">내가 쓴 글들을 모아보세요.</p>
      <div className="divider"></div>
      <MyPost />
    </div>
  )
}
