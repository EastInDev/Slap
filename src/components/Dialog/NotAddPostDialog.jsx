const NotAddPostDialog = () => {
  return (
    <dialog id="NotAddPostDialog" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">메시지</h3>
        <p className="py-4">투표 항목은 최소 두 개 이상 만들어주세요!</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default NotAddPostDialog
