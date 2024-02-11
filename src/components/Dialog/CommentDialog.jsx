import { useState } from 'react'

const CommentDialog = ({
  post,
  comments,
  newComment,
  handleCommentSubmit,
  setNewComment,
  timeAgo,
  handleVote,
  formatVoteCount,
}) => {
  const totalComments = comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? comment.replies.length : 0)
  }, 0)

  const handleCloseDialog = () => {
    const myModal = document.getElementById(`commentModal_${post.id}`)
    myModal.close()
  }

  const [showReplies, setShowReplies] = useState({})
  const [replyToCommentId, setReplyToCommentId] = useState(null)

  // '답글 달기' 버튼을 클릭했을 때의 처리
  const handleReplyClick = (commentId, nickname) => {
    setNewComment(`@${nickname} `)
    setReplyToCommentId(commentId)
  }

  const handleShowReplies = (commentId) => {
    // setShowReplies({ ...showReplies, [commentId]: true })
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }))
  }

  const handleSubmit = (event) => {
    // 추가
    handleCommentSubmit(event, replyToCommentId)
    setReplyToCommentId(null) // 답글 작성 후 초기화
  }

  return (
    <dialog id={`commentModal_${post.id}`} className="modal">
      <div className="modal-box max-w-4xl h-full" style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '1em' }}>
          <h3 className="font-bold text-lg mt-4 mb-3">투표 정보</h3>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-lg">{post.user.nickname}</span>
              <span className="text-sm text-gray-500 ml-2">
                {timeAgo(post.created_at)}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="mt-2">{post.content}</p>
          <p className="mt-2">{formatVoteCount(post.total_count)}</p>
          {post.votes.map((vote, i) => {
            const votePercentage =
              (parseInt(vote.count) / (parseInt(post.total_count) || 1)) * 100
            return (
              <div key={i} className="mt-2 flex items-center">
                <button
                  className="btn relative w-full text-left"
                  style={{
                    background: `linear-gradient(to right, #2563eb ${votePercentage}%, #e5e7eb ${votePercentage}%)`,
                  }}
                  onClick={() => handleVote(post.id, vote.id)}
                >
                  <span>{vote.text}</span>
                  <span className="px-3 py-2 ml-auto text-white bg-blue-500 rounded">
                    {isNaN(votePercentage) ? '0.00' : votePercentage.toFixed(2)}
                    %
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ padding: '1em 0' }}>
            <h3 className="font-bold text-lg mb-3">
              댓글 <span className="text-sm">({totalComments})</span>
            </h3>
            <hr></hr>
          </div>

          <div style={{ height: '340px', overflowY: 'auto' }}>
            {comments &&
              comments.map((comment) => (
                <div key={comment.id}>
                  <span className="text-lg">{comment.nickname}</span>
                  <span className="text-sm ml-2 mb-3">{comment.content}</span>
                  <p className="text-sm text-gray-500 mb-1">
                    {timeAgo(comment.created_at)}
                    <button
                      className="text-sm text-gray-500 ml-3"
                      onClick={() =>
                        handleReplyClick(comment.id, comment.nickname)
                      }
                    >
                      답글 달기
                    </button>
                  </p>
                  {comment.replies && comment.replies.length > 0 && (
                    <button
                      className="text-sm text-gray-500 mb-3"
                      onClick={() => handleShowReplies(comment.id)}
                    >
                      --- 답글 보기 ({comment.replies.length})
                    </button>
                  )}
                  {showReplies[comment.id] &&
                    comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <p>
                          <span className="text-lg ml-3">{reply.nickname}</span>
                          <span className="text-sm ml-2 mb-3">
                            {reply.content}
                          </span>
                          <p className="text-sm text-gray-500 ml-3 mb-3">
                            {timeAgo(reply.created_at)}
                          </p>
                        </p>
                      </div>
                    ))}
                </div>
              ))}
          </div>
          <div style={{ position: 'relative', padding: '1em 0' }}>
            <hr
              style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
            ></hr>
            <h3 className="font-bold text-lg mb-20">댓글 작성</h3>
            <form onSubmit={handleSubmit}>
              {/* 폼에 제출 핸들러 추가 */}
              <textarea
                className="w-full h-20 p-2 -mt-[60px]"
                placeholder="댓글을 입력하세요..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={handleCloseDialog}
                >
                  닫기
                </button>
                <button type="submit" className="btn">
                  댓글 작성
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default CommentDialog
