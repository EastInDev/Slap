import { useState, useEffect } from 'react'
import useCategories from '@/hooks/useCategories'

const DropdownCategories = ({ value, onChange }) => {
  const { categories, isError, isLoading } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState(value)

  useEffect(() => {
    setSelectedCategory(value) // 상위 컴포넌트에서 전달받은 value를 반영
  }, [value])

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    if (onChange) {
      onChange(event.target.value) // 선택된 카테고리를 상위 컴포넌트에 알림
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return (
    <select
      name="category"
      defaultValue={'카테고리 선택'}
      className="select select-bordered w-full max-w-xs"
      value={selectedCategory || 'default'}
      onChange={handleCategoryChange}
    >
      <option value="default" disabled>
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
