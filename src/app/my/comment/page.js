import MyComments from '@/features/my/MyComments/MyComments'

export default function MyComment() {
  return (
    <div className="w-full h-full overflow-y-auto scrollLayout">
      <h1 className="text-2xl font-bold">내가 쓴 댓글</h1>
      <p className="mt-4">내가 쓴 댓글들을 모아보세요.</p>
      <div className="divider"></div>
      <MyComments />
    </div>
  )
}
