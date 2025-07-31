import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * 상품 정렬 컴포넌트
 * 인기순, 가격순, 신상품순 등으로 상품을 정렬
 */
export const ProductSort = ({ 
  sortBy = 'popular', 
  onSortChange, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // 정렬 옵션 정의
  const sortOptions = [
    { value: 'popular', label: '인기순', description: '많이 구매한 순서' },
    { value: 'newest', label: '신상품순', description: '최신 등록 순서' },
    { value: 'price_low', label: '낮은 가격순', description: '가격이 낮은 순서' },
    { value: 'price_high', label: '높은 가격순', description: '가격이 높은 순서' },
    { value: 'rating', label: '평점순', description: '평점이 높은 순서' },
    { value: 'review', label: '리뷰 많은순', description: '리뷰가 많은 순서' },
    { value: 'discount', label: '할인율순', description: '할인율이 높은 순서' },
    { value: 'name', label: '이름순', description: '가나다 순서' }
  ]

  // 현재 선택된 정렬 옵션
  const currentSort = sortOptions.find(option => option.value === sortBy) || sortOptions[0]

  // 정렬 변경 핸들러
  const handleSortChange = (value) => {
    onSortChange?.(value)
    setIsOpen(false)
  }

  // 드롭다운 토글
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${className}`}>
      {/* 정렬 버튼 */}
      <Button
        onClick={toggleDropdown}
        variant="outline"
        className="justify-between min-w-[140px]"
      >
        <span className="text-sm">{currentSort.label}</span>
        <ChevronDown 
          className={`h-4 w-4 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <>
          {/* 오버레이 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 드롭다운 컨텐츠 */}
          <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                    sortBy === option.value ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        sortBy === option.value ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </div>
                    </div>
                    {sortBy === option.value && (
                      <Check className="h-4 w-4 text-primary ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductSort