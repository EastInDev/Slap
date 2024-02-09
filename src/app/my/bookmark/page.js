export default function MyBookmark() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold">내가 북마크한 글</h1>
      <p className="mt-4">내가 북마크한 글들을 모아보세요.</p>
      <div className="divider"></div>
      <div className="grid grid-cols-1 gap-4 mt-4">
        <div className="card bordered">
          <div className="card-body">
            <h2 className="text-xl font-bold">제목</h2>
            <p className="text-gray-500 mt-2">내용</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-secondary">수정</button>
            <button className="btn btn-secondary">삭제</button>
          </div>
        </div>
      </div>
    </div>
  )
}