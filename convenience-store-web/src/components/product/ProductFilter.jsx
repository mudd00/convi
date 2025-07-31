import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useCategories } from '@/hooks/useProducts'

/**
 * 상품 필터 컴포넌트
 * 카테고리, 가격대, 브랜드, 할인여부 등으로 상품을 필터링
 */
export const ProductFilter = ({ 
  filters = {}, 
  onFiltersChange, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: false,
    brand: false,
    features: false
  })

  // 카테고리 목록 조회
  const { data: categories } = useCategories()

  // 필터 섹션 토글
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters }
    
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    
    onFiltersChange?.(newFilters)
  }

  // 카테고리 선택 핸들러
  const handleCategoryChange = (categoryId) => {
    const currentCategories = filters.categories || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]
    
    handleFilterChange('categories', newCategories)
  }

  // 가격 범위 변경 핸들러
  const handlePriceChange = (type, value) => {
    const currentPrice = filters.price || {}
    const newPrice = {
      ...currentPrice,
      [type]: value ? parseInt(value) : undefined
    }
    
    // min과 max가 모두 없으면 필터 제거
    if (!newPrice.min && !newPrice.max) {
      handleFilterChange('price', null)
    } else {
      handleFilterChange('price', newPrice)
    }
  }

  // 브랜드 선택 핸들러
  const handleBrandChange = (brand) => {
    const currentBrands = filters.brands || []
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand]
    
    handleFilterChange('brands', newBrands)
  }

  // 특성 필터 변경 핸들러
  const handleFeatureChange = (feature, checked) => {
    handleFilterChange(feature, checked || null)
  }

  // 모든 필터 초기화
  const clearAllFilters = () => {
    onFiltersChange?.({})
  }

  // 활성 필터 개수 계산
  const activeFiltersCount = Object.keys(filters).length

  // 주요 브랜드 목록 (실제로는 API에서 가져와야 함)
  const popularBrands = [
    'CU', 'GS25', '세븐일레븐', '이마트24', '미니스톱',
    '농심', '오뚜기', '롯데', '해태', '크라운'
  ]

  return (
    <div className={className}>
      {/* 모바일 필터 토글 버튼 */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full justify-between"
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            필터
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* 필터 패널 */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* 필터 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">필터</h3>
          {activeFiltersCount > 0 && (
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              전체 해제
            </Button>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">카테고리</h4>
            {expandedSections.category ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.category && (
            <div className="mt-4 space-y-3">
              {categories?.data?.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.categories || []).includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {category.name}
                    {category.productCount && (
                      <span className="text-gray-400 ml-1">({category.productCount})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 가격 필터 */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">가격대</h4>
            {expandedSections.price ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.price && (
            <div className="mt-4 space-y-4">
              {/* 가격 범위 입력 */}
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="최소 가격"
                  value={filters.price?.min || ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="flex-1"
                />
                <span className="text-gray-500">~</span>
                <Input
                  type="number"
                  placeholder="최대 가격"
                  value={filters.price?.max || ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="flex-1"
                />
              </div>

              {/* 미리 정의된 가격 범위 */}
              <div className="space-y-2">
                {[
                  { label: '1,000원 미만', min: 0, max: 999 },
                  { label: '1,000원 ~ 3,000원', min: 1000, max: 3000 },
                  { label: '3,000원 ~ 5,000원', min: 3000, max: 5000 },
                  { label: '5,000원 ~ 10,000원', min: 5000, max: 10000 },
                  { label: '10,000원 이상', min: 10000, max: null }
                ].map((range, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={
                        filters.price?.min === range.min && 
                        filters.price?.max === range.max
                      }
                      onChange={() => handleFilterChange('price', {
                        min: range.min,
                        max: range.max
                      })}
                      className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 브랜드 필터 */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">브랜드</h4>
            {expandedSections.brand ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.brand && (
            <div className="mt-4 space-y-3">
              {popularBrands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.brands || []).includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 특성 필터 */}
        <div>
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">특성</h4>
            {expandedSections.features ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.features && (
            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.onSale || false}
                  onChange={(e) => handleFeatureChange('onSale', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">할인 상품</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.isNew || false}
                  onChange={(e) => handleFeatureChange('isNew', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">신상품</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) => handleFeatureChange('inStock', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">재고 있음</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.highRating || false}
                  onChange={(e) => handleFeatureChange('highRating', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">평점 4.0 이상</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductFilter