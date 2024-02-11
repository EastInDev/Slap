import Categories from '@/features/home/Categories/Categories'
import MainPost from '@/features/post/MainPost/MainPost'

export default function Home() {
  return (
    <div className="w-full h-full overflow-y-auto scrollLayout">
      <Categories />
      <br></br>
      <MainPost />
    </div>
  )
}
