const SuccessAddPostDialog = ({ handleCloseDialog }) => {
  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">투표 생성 성공!</h3>
        <p className="py-4">
          확인 버튼을 누르거나 ESC 키를 눌러 닫을 수 있습니다.
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleCloseDialog}>
              확인
            </button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default SuccessAddPostDialog
