import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui'

/**
 * 매장 필터 컴포넌트
 * 서비스별 필터, 24시간 운영 필터 등
 */
export const StoreFilter = ({ 
  filters = {}, 
  onFiltersChange, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    services: true,
    hours: true,
    distance: false
  })

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

  // 서비스 선택 핸들러
  const handleServiceChange = (service) => {
    const currentServices = filters.services || []
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    
    handleFilterChange('services', newServices)
  }

  // 모든 필터 초기화
  const clearAllFilters = () => {
    onFiltersChange?.({})
  }

  // 활성 필터 개수 계산
  const activeFiltersCount = Object.keys(filters).length

  // 서비스 목록
  const availableServices = [
    { id: 'atm', name: 'ATM' },
    { id: 'parking', name: '주차장' },
    { id: 'delivery', name: '택배' },
    { id: 'wifi', name: 'WiFi' },
    { id: 'restroom', name: '화장실' },
    { id: 'seating', name: '휴게공간' },
    { id: 'charging', name: '충전소' },
    { id: 'copy', name: '복사/인쇄' }
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

        {/* 서비스 필터 */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('services')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">서비스</h4>
            {expandedSections.services ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.services && (
            <div className="mt-4 space-y-3">
              {availableServices.map((service) => (
                <label key={service.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(filters.services || []).includes(service.id)}
                    onChange={() => handleServiceChange(service.id)}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {service.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 운영시간 필터 */}
        <div className="border-b border-gray-200 pb-6">
          <button
            onClick={() => toggleSection('hours')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">운영시간</h4>
            {expandedSections.hours ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.hours && (
            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is24Hours || false}
                  onChange={(e) => handleFilterChange('is24Hours', e.target.checked || null)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">24시간 운영</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.isOpenNow || false}
                  onChange={(e) => handleFilterChange('isOpenNow', e.target.checked || null)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">현재 영업중</span>
              </label>
            </div>
          )}
        </div>

        {/* 거리 필터 */}
        <div>
          <button
            onClick={() => toggleSection('distance')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">거리</h4>
            {expandedSections.distance ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </button>
          
          {expandedSections.distance && (
            <div className="mt-4 space-y-2">
              {[
                { label: '500m 이내', value: 0.5 },
                { label: '1km 이내', value: 1 },
                { label: '2km 이내', value: 2 },
                { label: '5km 이내', value: 5 },
                { label: '10km 이내', value: 10 }
              ].map((range, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name="distance"
                    checked={filters.maxDistance === range.value}
                    onChange={() => handleFilterChange('maxDistance', range.value)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreFilter