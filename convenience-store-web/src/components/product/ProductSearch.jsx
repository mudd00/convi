import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import { useProductSearch } from '@/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'

/**
 * 상품 검색 컴포넌트
 * 자동완성, 검색 히스토리, 인기 검색어 기능 포함
 */
export const ProductSearch = ({ 
  onSearch, 
  onResultSelect,
  placeholder = "상품을 검색해보세요",
  className = "" 
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [popularKeywords] = useState([
    '삼각김밥', '컵라면', '아이스크림', '음료수', '과자', 
    '도시락', '샐러드', '커피', '우유', '빵'
  ])

  const searchRef = useRef(null)
  const debouncedQuery = useDebounce(query, 300)

  // 자동완성 검색 결과
  const { data: searchResults, isLoading } = useProductSearch(
    debouncedQuery,
    {},
    { enabled: debouncedQuery.length >= 2 }
  )

  // 컴포넌트 마운트 시 검색 히스토리 로드
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
    setSearchHistory(history.slice(0, 5)) // 최근 5개만 표시
  }, [])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 검색어 입력 핸들러
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.length > 0)
  }

  // 검색 실행 핸들러
  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return

    // 검색 히스토리에 추가
    addToSearchHistory(searchQuery)
    
    // 검색 실행
    onSearch?.(searchQuery)
    setIsOpen(false)
    setQuery(searchQuery)
  }

  // 검색 히스토리에 추가
  const addToSearchHistory = (searchQuery) => {
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(item => item !== searchQuery)
    ].slice(0, 10) // 최대 10개 저장

    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // 검색 히스토리 삭제
  const removeFromHistory = (itemToRemove) => {
    const newHistory = searchHistory.filter(item => item !== itemToRemove)
    setSearchHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // 검색 히스토리 전체 삭제
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
  }

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // 검색 결과 선택 핸들러
  const handleResultSelect = (product) => {
    setQuery(product.name)
    setIsOpen(false)
    onResultSelect?.(product)
    addToSearchHistory(product.name)
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 검색 입력 필드 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 검색 드롭다운 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* 자동완성 결과 */}
          {debouncedQuery.length >= 2 && (
            <div className="p-2">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  검색 중...
                </div>
              ) : searchResults?.data?.length > 0 ? (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    상품
                  </div>
                  {searchResults.data.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultSelect(product)}
                      className="w-full flex items-center p-2 hover:bg-gray-50 rounded-md text-left"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md mr-3">
                        {product.images?.[0]?.url && (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.price?.toLocaleString()}원
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              ) : debouncedQuery.length >= 2 ? (
                <div className="p-4 text-center text-gray-500">
                  검색 결과가 없습니다
                </div>
              ) : null}
            </div>
          )}

          {/* 검색 히스토리 */}
          {debouncedQuery.length < 2 && searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="flex items-center justify-between px-2 py-1 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  최근 검색어
                </span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  전체 삭제
                </button>
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group"
                >
                  <button
                    onClick={() => handleSearch(item)}
                    className="flex items-center flex-1 text-left"
                  >
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </button>
                  <button
                    onClick={() => removeFromHistory(item)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 인기 검색어 */}
          {debouncedQuery.length < 2 && (
            <div className="p-2 border-t border-gray-100">
              <div className="px-2 py-1 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  인기 검색어
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {popularKeywords.slice(0, 8).map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(keyword)}
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    <TrendingUp className="h-3 w-3 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700 truncate">{keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductSearch