import { useState, useCallback } from 'react'
import { Map, List, Navigation } from 'lucide-react'
import { Button } from '@/components/ui'
import StoreCard from '@/components/store/StoreCard'
import StoreFilter from '@/components/store/StoreFilter'
import SimpleMap from '@/components/map/SimpleMap'
import { useStores, useNearbyStores } from '@/hooks/useStores'
import { useGeolocation } from '@/hooks/useGeolocation'

/**
 * 매장 찾기 페이지
 * 지도 기반 매장 검색 및 목록 표시
 */
const StoresPage = () => {
  const [viewMode, setViewMode] = useState('map') // 'map' | 'list'
  const [filters, setFilters] = useState({})
  const [selectedStore, setSelectedStore] = useState(null)

  // 위치 정보 훅
  const { location, getCurrentPosition, isLoading: locationLoading } = useGeolocation()

  // 임시 매장 데이터 (실제로는 API에서 가져옴)
  const mockStores = [
    {
      id: '1',
      name: 'GS25 강남점',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-1234-5678',
      distance: 200,
      isOpen: true,
      hours: { today: '24시간' },
      rating: 4.5,
      reviewCount: 128,
      services: ['ATM', '택배', '복권', '충전'],
      isFavorited: false
    },
    {
      id: '2',
      name: 'CU 역삼점',
      address: '서울시 강남구 역삼동 456',
      phone: '02-2345-6789',
      distance: 500,
      isOpen: true,
      hours: { today: '06:00 - 24:00' },
      rating: 4.2,
      reviewCount: 89,
      services: ['ATM', '택배', '공과금'],
      isFavorited: true
    },
    {
      id: '3',
      name: '세븐일레븐 선릉점',
      address: '서울시 강남구 선릉로 789',
      phone: '02-3456-7890',
      distance: 800,
      isOpen: false,
      hours: { today: '24시간' },
      rating: 4.7,
      reviewCount: 203,
      services: ['ATM', '복권', '충전', '프린터'],
      isFavorited: false
    }
  ]

  // 매장 데이터 조회 (실제로는 API 훅 사용)
  // const { data: allStores } = useStores(filters)
  // const { data: nearbyStores } = useNearbyStores(location, filters.maxDistance || 5)

  // 표시할 매장 목록 결정
  const stores = mockStores

  // 필터 변경 핸들러
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters)
  }, [])

  // 매장 선택 핸들러
  const handleStoreSelect = useCallback((store) => {
    setSelectedStore(store)
  }, [])

  // 길찾기 핸들러
  const handleGetDirections = useCallback((store) => {
    // 실제로는 네이버맵, 카카오맵 등의 길찾기 서비스로 연결
    const url = `https://map.kakao.com/link/to/${store.name},${store.lat || 37.5665},${store.lng || 126.9780}`
    window.open(url, '_blank')
  }, [])

  // 현재 위치 가져오기
  const handleGetCurrentLocation = () => {
    getCurrentPosition()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">매장 찾기</h1>
          <p className="text-gray-600">가까운 편의점을 찾아보세요</p>
        </div>

        {/* 상단 컨트롤 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          {/* 뷰 모드 토글 */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <Button
              onClick={() => setViewMode('map')}
              variant={viewMode === 'map' ? 'primary' : 'ghost'}
              size="sm"
            >
              <Map className="h-4 w-4 mr-2" />
              지도 보기
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
            >
              <List className="h-4 w-4 mr-2" />
              목록 보기
            </Button>
          </div>

          {/* 현재 위치 버튼 */}
          <Button
            onClick={handleGetCurrentLocation}
            disabled={locationLoading}
            variant="outline"
            size="sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {locationLoading ? '위치 확인 중...' : '현재 위치'}
          </Button>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 필터 */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-4">
              <StoreFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* 매장 표시 영역 */}
          <div className="flex-1">
            {viewMode === 'map' ? (
              /* 지도 뷰 */
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      매장 지도 ({stores.length}개)
                    </h2>
                    {location && (
                      <span className="text-sm text-gray-600">
                        현재 위치 기준
                      </span>
                    )}
                  </div>
                  
                  <SimpleMap
                    stores={stores}
                    center={location}
                    onStoreSelect={handleStoreSelect}
                    selectedStore={selectedStore}
                    className="h-96"
                  />
                </div>
              </div>
            ) : (
              /* 목록 뷰 */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    매장 목록 ({stores.length}개)
                  </h2>
                  {location && (
                    <span className="text-sm text-gray-600">
                      거리순 정렬
                    </span>
                  )}
                </div>

                {stores.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stores.map((store) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        onStoreClick={handleStoreSelect}
                        onGetDirections={handleGetDirections}
                        showDistance={!!location}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏪</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      조건에 맞는 매장이 없습니다
                    </h3>
                    <p className="text-gray-600 mb-4">
                      필터 조건을 변경하거나 다른 지역을 검색해보세요
                    </p>
                    <Button onClick={() => setFilters({})}>
                      필터 초기화
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoresPage