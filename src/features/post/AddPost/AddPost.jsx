import { useState } from 'react'
import DropdownCategories from '@/components/form/DropdownCategories/DropdownCategories'
import { MinusSquare, X } from 'lucide-react'
import { createPost } from '@/apis/post'
import { useSession } from 'next-auth/react'
import usePosts from '@/hooks/usePosts'
import SuccessAddPostDialog from '@/components/Dialog/SuccessAddPostDialog'

const AddPost = () => {
  const { data: session } = useSession()
  const [voteText, setVoteText] = useState('')
  const [voteOptions, setVoteOptions] = useState(['', ''])
  const [errorMessage, setErrorMessage] = useState('')
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const { mutate } = usePosts()

  const handleVoteSubmit = async (event) => {
    event.preventDefault() // 이벤트 기본 동작을 막음

    // const formData = new FormData(event.target)
    const uniqueOptions = Array.from(
      new Set(voteOptions.filter((option) => option !== '')),
    ) // 중복된 투표 항목을 제거, 빈 값 제거

    const data = {
      voteText: voteText,
      voteOptions: uniqueOptions,
      category: category,
      content: content,
      userId: session.user.id,
    }

    // 값이 없는 경우 오류 메시지 설정
    if (voteText === '') {
      setErrorMessage('제목을 입력해주세요!')
      return
    }

    if (voteOptions.filter((option) => option.trim() !== '').length < 2) {
      setErrorMessage('최소 두 개의 투표 항목을 입력해주세요!')
      return
    }

    if (category === '') {
      setErrorMessage('카테고리를 선택해주세요!')
      return
    }

    try {
      await createPost(data)
      console.log('투표 생성 성공:')
      document.getElementById('my_modal_2').showModal() // 투표 생성 성공 알림 모달
      mutate() // 포스트 목록 다시 불러오기
    } catch (error) {
      console.error('투표 생성 실패:', error)
    }
  }

  const handleAddOption = () => {
    setVoteOptions([...voteOptions, ''])
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...voteOptions]
    updatedOptions[index] = value
    setVoteOptions(updatedOptions)
  }

  const handleRemoveOption = (index) => {
    const updatedOptions = [...voteOptions]
    updatedOptions.splice(index, 1)
    setVoteOptions(updatedOptions)
  }

  const handleCloseDialog = () => {
    const myModal = document.getElementById('my_modal_1')
    myModal.close()
    setVoteText('')
    setVoteOptions(['', ''])
    setErrorMessage('')
    setCategory('')
    setContent('')
  }

  return (
    <div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-action">
          <form onSubmit={handleVoteSubmit}>
            <div className="card bg-base-100 shadow-xl w-[400px]">
              <div className="card-body items-center text-center relative">
                <button
                  type="button" // 버튼 유형을 'button'으로 명시적 설정
                  // 이렇게 안 하면 form 요소로 인식되어 submit 이벤트가 발생함
                  // 즉, 버튼 클릭 시 handleVoteSubmit 함수가 호출됨
                  className="btn btn-ghost btn-circle modal-close absolute top-0 right-0 m-2"
                  aria-label="Close"
                  onClick={handleCloseDialog}
                >
                  <X />
                </button>
                <h2 className="card-title">투표 생성</h2>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">제목</span>
                  </div>
                  <input
                    name="votetext"
                    type="text"
                    placeholder="제목 작성"
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setVoteText(e.target.value)}
                    value={voteText}
                  />
                  <br />
                  <div className="label">
                    <span className="label-text">투표 항목</span>
                  </div>
                  {voteOptions.map((option, index) => (
                    <div className="flex items-center mb-2" key={index}>
                      <input
                        type="text"
                        placeholder="투표 항목 작성"
                        className="input input-bordered w-full max-w-xs"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="ml-2 p-1 text-red-500"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <MinusSquare />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn w-full max-w-xs mb-2"
                    onClick={handleAddOption}
                  >
                    +
                  </button>
                </label>
                <DropdownCategories value={category} onChange={setCategory} />
                <br />
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">내용</span>
                  </div>
                  <textarea
                    name="content"
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="내용 작성"
                    value={content} // 상태를 value로 설정
                    onChange={(e) => setContent(e.target.value)} // 상태 변경 함수를 onChange 핸들러로 설정
                  ></textarea>
                </label>
                {errorMessage && (
                  <div className="text-error">{errorMessage}</div>
                )}
                <div className="card-actions">
                  <button type="submit" className="btn btn-primary">
                    생성
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
      <SuccessAddPostDialog handleCloseDialog={handleCloseDialog} />
    </div>
  )
}

export default AddPost
