import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductSearch from '@/components/product/ProductSearch'
import ProductFilter from '@/components/product/ProductFilter'
import ProductSort from '@/components/product/ProductSort'
import ProductList from '@/components/product/ProductList'
import { useCategories } from '@/hooks/useProducts'

/**
 * 상품 목록 페이지
 * 카테고리별 상품 조회, 검색, 필터링 기능 제공
 */
const ProductsPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('popular')

  // 카테고리 목록 조회
  const { data: categories } = useCategories()

  // 검색 핸들러
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    // 검색 시 카테고리를 전체로 변경
    if (query && selectedCategory !== 'all') {
      setSelectedCategory('all')
    }
  }, [selectedCategory])

  // 상품 클릭 핸들러
  const handleProductClick = useCallback((product) => {
    navigate(`/products/${product.id}`)
  }, [navigate])

  // 검색 결과 선택 핸들러
  const handleSearchResultSelect = useCallback((product) => {
    navigate(`/products/${product.id}`)
  }, [navigate])

  // 카테고리 변경 핸들러
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
    // 카테고리 변경 시 검색어 초기화
    if (searchQuery) {
      setSearchQuery('')
    }
    // 필터에 카테고리 적용
    if (category === 'all') {
      const newFilters = { ...filters }
      delete newFilters.categories
      setFilters(newFilters)
    } else {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }))
    }
  }, [searchQuery, filters])

  // 필터 변경 핸들러
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  // 정렬 변경 핸들러
  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">상품</h1>
          <p className="text-gray-600">편의점의 다양한 상품을 만나보세요</p>
        </div>

        {/* 검색바 */}
        <div className="mb-8">
          <ProductSearch
            onSearch={handleSearch}
            onResultSelect={handleSearchResultSelect}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* 카테고리 탭 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories?.data?.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 필터 (데스크톱) */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* 상품 목록 영역 */}
          <div className="flex-1">
            {/* 정렬 및 뷰 컨트롤 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {searchQuery && (
                  <div className="text-sm text-gray-600">
                    "<span className="font-semibold">{searchQuery}</span>" 검색 결과
                  </div>
                )}
              </div>
              
              <ProductSort
                sortBy={sortBy}
                onSortChange={handleSortChange}
              />
            </div>

            {/* 상품 목록 */}
            <ProductList
              filters={filters}
              sortBy={sortBy}
              searchQuery={searchQuery}
              onProductClick={handleProductClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage