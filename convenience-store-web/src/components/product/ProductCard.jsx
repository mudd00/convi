import { useState } from 'react'
import { Heart, ShoppingCart, Star, AlertCircle } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useCartStore } from '@/stores/cartStore'
import { useToggleWishlist } from '@/hooks/useProducts'
import { formatPrice } from '@/utils/format'

/**
 * 상품 카드 컴포넌트
 * 상품 목록에서 개별 상품을 표시하는 카드
 */
export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onProductClick,
  className = '',
  showWishlist = true,
  showAddToCart = true 
}) => {
  const [imageError, setImageError] = useState(false)
  const { addItem } = useCartStore()
  const toggleWishlist = useToggleWishlist()

  // 상품 클릭 핸들러
  const handleProductClick = () => {
    onProductClick?.(product)
  }

  // 장바구니 추가 핸들러
  const handleAddToCart = (e) => {
    e.stopPropagation() // 상품 클릭 이벤트 방지
    
    if (product.stock <= 0) {
      return // 품절 상품은 장바구니 추가 불가
    }

    addItem(product)
    onAddToCart?.(product)
  }

  // 관심 상품 토글 핸들러
  const handleWishlistToggle = (e) => {
    e.stopPropagation() // 상품 클릭 이벤트 방지
    
    toggleWishlist.mutate({
      productId: product.id,
      isWishlisted: product.isWishlisted
    })
  }

  // 이미지 에러 핸들러
  const handleImageError = () => {
    setImageError(true)
  }

  // 할인율 계산
  const discountRate = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // 품절 여부
  const isOutOfStock = product.stock <= 0

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${className}`}
      onClick={handleProductClick}
    >
      {/* 상품 이미지 영역 */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {!imageError && product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
              isOutOfStock ? 'grayscale opacity-50' : ''
            }`}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <div className="text-center text-gray-400">
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <span className="text-sm">이미지 없음</span>
            </div>
          </div>
        )}

        {/* 할인 배지 */}
        {discountRate > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            {discountRate}%
          </div>
        )}

        {/* 품절 배지 */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-semibold">
              품절
            </span>
          </div>
        )}

        {/* 관심 상품 버튼 */}
        {showWishlist && (
          <button
            onClick={handleWishlistToggle}
            disabled={toggleWishlist.isPending}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
            aria-label={product.isWishlisted ? '관심 상품에서 제거' : '관심 상품에 추가'}
          >
            <Heart 
              className={`h-4 w-4 ${
                product.isWishlisted 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>
        )}

        {/* 새 상품 배지 */}
        {product.isNew && (
          <div className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            NEW
          </div>
        )}
      </div>

      {/* 상품 정보 영역 */}
      <div className="p-4">
        {/* 브랜드명 */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        )}

        {/* 상품명 */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* 평점 */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {product.rating.toFixed(1)} ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* 가격 정보 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            {/* 할인 전 가격 */}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}원
              </span>
            )}
            
            {/* 현재 가격 */}
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}원
            </span>
          </div>

          {/* 재고 정보 */}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-orange-500 font-medium">
              재고 {product.stock}개
            </span>
          )}
        </div>

        {/* 상품 태그 */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 장바구니 추가 버튼 */}
        {showAddToCart && (
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant={isOutOfStock ? 'secondary' : 'primary'}
            size="sm"
            className="w-full"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? '품절' : '장바구니 담기'}
          </Button>
        )}

        {/* 입고 예정일 */}
        {isOutOfStock && product.restockDate && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            {new Date(product.restockDate).toLocaleDateString('ko-KR')} 입고 예정
          </p>
        )}
      </div>
    </Card>
  )
}

export default ProductCard