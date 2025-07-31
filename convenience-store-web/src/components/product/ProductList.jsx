import { useState, useEffect } from 'react'
import { Grid, List, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import ProductCard from './ProductCard'
import { useInfiniteProducts } from '@/hooks/useProducts'

/**
 * 상품 목록 컴포넌트
 * 그리드/리스트 뷰 전환, 무한 스크롤 지원
 */
export const ProductList = ({ 
  filters = {}, 
  sortBy = 'popular',
  searchQuery = '',
  onProductClick,
  className = "" 
}) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [displayedProducts, setDisplayedProducts] = useState([])

  // 무한 스크롤 상품 데이터
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteProducts({
    ...filters,
    sortBy,
    search: searchQuery
  })

  // 상품 데이터 평탄화
  useEffect(() => {
    if (data?.pages) {
      const allProducts = data.pages.flatMap(page => page.data || [])
      setDisplayedProducts(allProducts)
    }
  }, [data])

  // 무한 스크롤 핸들러
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  // 스크롤 이벤트로 자동 로드
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 // 1000px 전에 미리 로드
      ) {
        handleLoadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasNextPage, isFetchingNextPage])

  // 뷰 모드 변경
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">상품을 불러오는 중...</span>
      </div>
    )
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          상품을 불러오는 중 오류가 발생했습니다.
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {error?.message || '알 수 없는 오류가 발생했습니다.'}
        </div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          다시 시도
        </Button>
      </div>
    )
  }

  // 상품이 없는 경우
  if (displayedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          {searchQuery ? 
            `"${searchQuery}"에 대한 검색 결과가 없습니다.` : 
            '조건에 맞는 상품이 없습니다.'
          }
        </div>
        <div className="text-sm text-gray-400">
          다른 검색어나 필터를 시도해보세요.
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">
            {data?.pages?.[0]?.total || displayedProducts.length}
          </span>개의 상품
        </div>
        
        {/* 뷰 모드 토글 */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleViewMode}
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            className="p-2"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleViewMode}
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            className="p-2"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
          : 'space-y-4'
      }>
        {displayedProducts.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            onProductClick={onProductClick}
            className={viewMode === 'list' ? 'flex flex-row' : ''}
          />
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {hasNextPage && (
        <div className="text-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                불러오는 중...
              </>
            ) : (
              '더 보기'
            )}
          </Button>
        </div>
      )}

      {/* 로딩 인디케이터 */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-gray-600">추가 상품을 불러오는 중...</span>
        </div>
      )}
    </div>
  )
}

export default ProductList