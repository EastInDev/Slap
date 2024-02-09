const MyPost = ({ posts }) => {
  return (
    <div>
      {posts.map((post) => (
        <div
          key={post.id}
          className="collapse collapse-plus border border-base-300 bg-base-200 mt-4"
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">{post.title}</div>
          <div className="collapse-content">
            <div className="text-base-content">
              <p>{post.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyPost
