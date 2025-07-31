import { useState } from 'react'
import { MapPin, Clock, Phone, Star, Heart, Navigation } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { formatDistance } from '@/utils/format'

/**
 * 매장 카드 컴포넌트
 * 매장 정보를 카드 형태로 표시
 */
export const StoreCard = ({ 
  store, 
  onStoreClick,
  onGetDirections,
  showDistance = true,
  className = "" 
}) => {
  const [isFavorited, setIsFavorited] = useState(store.isFavorited || false)

  // 매장 클릭 핸들러
  const handleStoreClick = () => {
    onStoreClick?.(store)
  }

  // 길찾기 핸들러
  const handleGetDirections = (e) => {
    e.stopPropagation()
    onGetDirections?.(store)
  }

  // 즐겨찾기 토글
  const handleFavoriteToggle = (e) => {
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  // 운영 상태 확인
  const isOpen = store.isOpen !== undefined ? store.isOpen : true
  const currentHours = store.hours?.today || '24시간'

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${className}`}
      onClick={handleStoreClick}
    >
      <div className="p-4">
        {/* 매장 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{store.name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate">{store.address}</span>
            </div>
          </div>
          
          {/* 즐겨찾기 버튼 */}
          <button
            onClick={handleFavoriteToggle}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={isFavorited ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
          >
            <Heart 
              className={`h-5 w-5 ${
                isFavorited 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>
        </div>

        {/* 매장 정보 */}
        <div className="space-y-2 mb-4">
          {/* 거리 정보 */}
          {showDistance && store.distance && (
            <div className="flex items-center text-sm text-gray-600">
              <Navigation className="h-4 w-4 mr-1" />
              <span>{formatDistance(store.distance)}</span>
            </div>
          )}

          {/* 운영 시간 */}
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span className={isOpen ? 'text-green-600' : 'text-red-600'}>
              {isOpen ? '영업중' : '영업종료'}
            </span>
            <span className="text-gray-600 ml-2">{currentHours}</span>
          </div>

          {/* 전화번호 */}
          {store.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-1" />
              <span>{store.phone}</span>
            </div>
          )}

          {/* 평점 */}
          {store.rating && (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{store.rating.toFixed(1)}</span>
              <span className="text-gray-600 ml-1">({store.reviewCount || 0})</span>
            </div>
          )}
        </div>

        {/* 서비스 아이콘 */}
        {store.services && store.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {store.services.slice(0, 4).map((service, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
            {store.services.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{store.services.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex space-x-2">
          <Button
            onClick={handleGetDirections}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Navigation className="h-4 w-4 mr-1" />
            길찾기
          </Button>
          
          <Button
            onClick={handleStoreClick}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            상세보기
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default StoreCard