import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingCart, Star, Share2 } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useProduct } from '@/hooks/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/utils/format'

/**
 * 상품 상세 페이지
 */
const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addItem } = useCartStore()

  // 상품 정보 조회
  const { data: product, isLoading, isError } = useProduct(id)

  // 장바구니 추가
  const handleAddToCart = () => {
    if (product) {
      addItem(product)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h2>
          <Button onClick={() => navigate('/products')}>상품 목록으로 돌아가기</Button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock <= 0
  const discountRate = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로가기
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 상품 이미지 */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.images?.[selectedImageIndex]?.url || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* 이미지 썸네일 */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 상품 정보 */}
          <div className="space-y-6">
            {/* 브랜드 */}
            {product.brand && (
              <p className="text-sm text-gray-500">{product.brand}</p>
            )}

            {/* 상품명 */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* 평점 */}
            {product.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-semibold">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">({product.reviewCount || 0}개 리뷰)</span>
              </div>
            )}

            {/* 가격 */}
            <div className="space-y-2">
              {discountRate > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {discountRate}% 할인
                  </span>
                  <span className="text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}원
                  </span>
                </div>
              )}
              <div className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}원
              </div>
            </div>

            {/* 상품 설명 */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">상품 설명</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* 재고 정보 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">재고 정보</h3>
              {isOutOfStock ? (
                <div className="text-red-500 font-medium">품절</div>
              ) : product.stock <= 5 ? (
                <div className="text-orange-500 font-medium">재고 {product.stock}개 남음</div>
              ) : (
                <div className="text-green-500 font-medium">재고 충분</div>
              )}
            </div>

            {/* 액션 버튼들 */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isOutOfStock ? '품절' : '장바구니 담기'}
              </Button>
              
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 상품 상세 정보 탭 */}
        <div className="mt-12">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">상품 상세 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.nutrition && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">영양 정보</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    {Object.entries(product.nutrition).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {product.ingredients && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">원재료</h3>
                  <p className="text-sm text-gray-600">{product.ingredients}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 리뷰 섹션 */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              리뷰 ({product.reviewCount || 0})
            </h2>
            <div className="text-center py-8 text-gray-500">
              리뷰 기능은 곧 추가될 예정입니다.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage