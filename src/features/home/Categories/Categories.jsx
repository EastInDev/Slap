'use client'

import useCategories from '@/hooks/useCategories'

const Categories = ({ onCategorySelect }) => {
  const { categories, isError, isLoading } = useCategories()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId)
  }

  return (
    <div className="category flex overflow-x-scroll w-full">
      {categories.map((category, index) => (
        <div
          key={index}
          className="btn btn-sm btn-active ml-4"
          onClick={() => handleCategoryClick(category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  )
}

export default Categories
