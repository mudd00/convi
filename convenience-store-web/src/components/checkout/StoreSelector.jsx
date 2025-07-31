import { useState, useEffect } from 'react'
import { MapPin, Clock, Navigation, Check } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import { useStores } from '@/hooks/useStores'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatDistance } from '@/utils/format'

/**
 * 매장 선택 컴포넌트
 * 주문 시 픽업할 매장을 선택
 */
export const StoreSelector = ({ 
  selectedStore, 
  onStoreSelect, 
  cartItems = [],
  className = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  
  // 위치 정보 및 매장 데이터
  const { location, getCurrentPosition } = useGeolocation()
  const { data: storesData } = useStores({ search: searchQuery })

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
      hasStock: true,
      estimatedPickupTime: 10
    },
    {
      id: '2',
      name: 'CU 역삼점',
      address: '서울시 강남구 역삼동 456',
      phone: '02-2345-6789',
      distance: 500,
      isOpen: true,
      hours: { today: '06:00 - 24:00' },
      hasStock: true,
      estimatedPickupTime: 15
    },
    {
      id: '3',
      name: '세븐일레븐 선릉점',
      address: '서울시 강남구 선릉로 789',
      phone: '02-3456-7890',
      distance: 800,
      isOpen: false,
      hours: { today: '24시간' },
      hasStock: false,
      estimatedPickupTime: 20
    }
  ]

  const stores = mockStores

  // 매장 필터링 (검색어, 재고 여부, 영업 상태)
  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch && store.isOpen && store.hasStock
  })

  // 표시할 매장 수 제한
  const displayStores = showAll ? filteredStores : filteredStores.slice(0, 3)

  // 매장 선택 핸들러
  const handleStoreSelect = (store) => {
    onStoreSelect?.(store)
  }

  // 재고 확인 (실제로는 API 호출)
  const checkInventory = async (storeId) => {
    // 임시로 모든 상품이 재고 있다고 가정
    return cartItems.every(item => item.quantity <= 10)
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            픽업 매장 선택
          </h3>
          <Button
            onClick={getCurrentPosition}
            variant="outline"
            size="sm"
          >
            <Navigation className="h-4 w-4 mr-2" />
            내 위치
          </Button>
        </div>

        {/* 검색 */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="매장명 또는 주소로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 선택된 매장 */}
        {selectedStore && (
          <Card className="p-4 border-2 border-primary bg-primary-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedStore.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedStore.address}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      약 {selectedStore.estimatedPickupTime}분 후 픽업
                    </span>
                    {location && selectedStore.distance && (
                      <span>
                        {formatDistance(selectedStore.distance)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Check className="h-6 w-6 text-primary" />
            </div>
          </Card>
        )}

        {/* 매장 목록 */}
        <div className="space-y-3">
          {displayStores.map((store) => {
            const isSelected = selectedStore?.id === store.id
            
            return (
              <Card 
                key={store.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-2 border-primary bg-primary-50' 
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleStoreSelect(store)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {store.name}
                      </h4>
                      {store.isOpen ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          영업중
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          영업종료
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {store.address}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {store.hours.today}
                      </span>
                      {location && store.distance && (
                        <span>
                          {formatDistance(store.distance)}
                        </span>
                      )}
                      <span>
                        픽업 약 {store.estimatedPickupTime}분
                      </span>
                    </div>
                  </div>

                  {/* 재고 상태 */}
                  <div className="text-right">
                    {store.hasStock ? (
                      <div className="text-green-600 text-sm font-medium">
                        재고 확인됨
                      </div>
                    ) : (
                      <div className="text-red-600 text-sm font-medium">
                        일부 품절
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* 더 보기 버튼 */}
        {!showAll && filteredStores.length > 3 && (
          <div className="text-center">
            <Button
              onClick={() => setShowAll(true)}
              variant="outline"
            >
              매장 더 보기 ({filteredStores.length - 3}개)
            </Button>
          </div>
        )}

        {/* 매장이 없는 경우 */}
        {filteredStores.length === 0 && (
          <Card className="p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              조건에 맞는 매장이 없습니다
            </h3>
            <p className="text-gray-600">
              다른 지역을 검색해보세요
            </p>
          </Card>
        )}

        {/* 재고 부족 안내 */}
        {cartItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">
                  재고 확인 안내
                </h4>
                <p className="text-sm text-yellow-700">
                  선택한 매장에서 모든 상품의 재고를 확인한 후 주문이 확정됩니다.
                  일부 상품이 품절인 경우 대체 상품을 제안하거나 주문을 취소할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreSelector