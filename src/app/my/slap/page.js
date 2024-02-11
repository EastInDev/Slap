import MySlaps from '@/features/my/MySlaps/MySlaps'

export default function MySlap() {
  return (
    <div className="w-full h-full overflow-y-auto scrollLayout">
      <h1 className="text-2xl font-bold">내가 투표한 글</h1>
      <p className="mt-4">내가 투표한 글들을 모아보세요.</p>
      <div className="divider"></div>
      <MySlaps />
    </div>
  )
}
