import { useState } from 'react'

const CommentDialog = ({
  post,
  comments,
  newComment,
  handleCommentSubmit,
  setNewComment,
  timeAgo,
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
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-3">
          댓글 <span className="text-sm">({totalComments})</span>
        </h3>
        <hr className="mb-3"></hr>

        <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
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
        <hr className="mt-3 mb-3"></hr>
        <h3 className="font-bold text-lg">댓글 작성</h3>
        <form onSubmit={handleSubmit}>
          {/* 폼에 제출 핸들러 추가 */}
          <textarea
            className="w-full h-20 p-2 mt-4"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleCloseDialog}>
              닫기
            </button>
            <button type="submit" className="btn">
              댓글 작성
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default CommentDialog
