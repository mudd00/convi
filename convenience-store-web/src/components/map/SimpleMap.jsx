import { useState, useEffect } from 'react'
import { MapPin, Navigation, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * 간단한 지도 컴포넌트 (카카오맵 대신 임시 구현)
 * 실제 구현에서는 카카오맵 JavaScript API를 사용
 */
export const SimpleMap = ({ 
  stores = [], 
  center = { lat: 37.5665, lng: 126.9780 }, // 서울시청 기본값
  onStoreSelect,
  selectedStore,
  className = "" 
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)

  // 컴포넌트 마운트 시 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 사용자 위치 가져오기
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
        }
      )
    }
  }

  // 매장 마커 클릭 핸들러
  const handleStoreClick = (store) => {
    onStoreSelect?.(store)
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-600">지도를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* 지도 영역 (실제로는 카카오맵이 렌더링됨) */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 relative">
        {/* 현재 위치 버튼 */}
        <Button
          onClick={getCurrentLocation}
          className="absolute top-4 right-4 z-10"
          size="sm"
          variant="outline"
        >
          <Navigation className="h-4 w-4" />
        </Button>

        {/* 사용자 위치 마커 */}
        {userLocation && (
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-20"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}

        {/* 매장 마커들 */}
        {stores.map((store, index) => (
          <button
            key={store.id}
            onClick={() => handleStoreClick(store)}
            className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 z-10 ${
              selectedStore?.id === store.id 
                ? 'bg-red-500' 
                : 'bg-primary'
            }`}
            style={{
              left: `${20 + (index % 5) * 15}%`,
              top: `${20 + Math.floor(index / 5) * 15}%`
            }}
            title={store.name}
          >
            <MapPin className="h-4 w-4 text-white mx-auto" />
          </button>
        ))}

        {/* 지도 중앙 표시 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">지도 영역</p>
            <p className="text-xs">실제로는 카카오맵이 표시됩니다</p>
          </div>
        </div>
      </div>

      {/* 선택된 매장 정보 */}
      {selectedStore && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-30">
          <h3 className="font-semibold text-gray-900 mb-1">{selectedStore.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{selectedStore.address}</p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1">
              길찾기
            </Button>
            <Button size="sm" className="flex-1">
              상세보기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleMap