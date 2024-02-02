'use client'

import useCategories from '@/hooks/useCategories'

const DropdownCategories = () => {
  const { categories, isError, isLoading } = useCategories()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return (
    <select
      defaultValue={'카테고리 선택'}
      className="select select-bordered w-full max-w-xs"
    >
      <option value={null} disabled>
        카테고리 선택
      </option>
      {categories.map((category, index) => (
        <option key={index} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  )
}

export default DropdownCategories
