const NotLoginDialog = () => {
  return (
    <dialog id="NotLoginDialog" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">메시지</h3>
        <p className="py-4">로그인 후 투표하실 수 있어요!</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default NotLoginDialog
