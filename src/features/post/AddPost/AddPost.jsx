import { useState } from 'react'
import DropdownCategories from '@/components/form/DropdownCategories/DropdownCategories'
import { MinusSquare } from 'lucide-react'
import axios from 'axios'
import { createPost } from '@/apis/post'
import { FormEvent } from 'react'
import { useSession } from 'next-auth/react'

const AddPost = () => {
  const { data: session } = useSession()
  const [voteText, setVoteText] = useState('')
  const [voteOptions, setVoteOptions] = useState(['', ''])

  const handleVoteSubmit = async (formData) => {
    console.log(formData)
    const data = {
      voteText: voteText,
      voteOptions: voteOptions,
      category: formData.get('category'),
      content: formData.get('content'),
      userId: session.user.id,
    }

    console.log(data)

    try {
      await createPost(data)
      console.log('투표 생성 성공:')
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

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-action">
        <form method="dialog" action={handleVoteSubmit}>
          <div className="card bg-base-100 shadow-xl w-[400px]">
            <div className="card-body items-center text-center">
              <h2 className="card-title">투표 생성</h2>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">제목</span>
                </div>
                <input
                  name="votetext"
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setVoteText(e.target.value)}
                />
                <br></br>
                <div className="label">
                  <span className="label-text">투표 항목</span>
                </div>
                {voteOptions.map((option, index) => (
                  <div className="flex items-center mb-2" key={index}>
                    <input
                      type="text"
                      placeholder="Type here"
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
              <DropdownCategories />
              <br></br>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">내용</span>
                </div>
                <textarea
                  name="content"
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="내용 작성"
                ></textarea>
              </label>

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
  )
}

export default AddPost
