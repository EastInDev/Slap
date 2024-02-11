import MyLikes from '@/features/my/MyLikes/MyLikes'

export default function MyLike() {
  return (
    <div className="w-full h-full overflow-y-auto scrollLayout">
      <h1 className="text-2xl font-bold">내가 좋아요한 글</h1>
      <p className="mt-4">내가 좋아요 한 글들을 모아보세요.</p>
      <div className="divider"></div>
      <MyLikes />
    </div>
  )
}
