import apiClient, { extractData, createQueryParams } from './client'

/**
 * 매장 관련 API 함수들
 */

/**
 * 매장 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @returns {Promise} 매장 목록
 */
export const getStores = async (params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/stores?${queryParams}`)
  )
}

/**
 * 매장 상세 정보 조회
 * @param {string} storeId - 매장 ID
 * @returns {Promise} 매장 상세 정보
 */
export const getStore = async (storeId) => {
  return extractData(
    apiClient.get(`/stores/${storeId}`)
  )
}

/**
 * 주변 매장 검색
 * @param {Object} location - 위치 정보 { lat, lng }
 * @param {number} radius - 검색 반경 (km)
 * @returns {Promise} 주변 매장 목록
 */
export const getNearbyStores = async (location, radius = 5) => {
  const params = {
    lat: location.lat,
    lng: location.lng,
    radius
  }
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/stores/nearby?${queryParams}`)
  )
}

/**
 * 매장별 상품 재고 조회
 * @param {string} storeId - 매장 ID
 * @param {string} productId - 상품 ID (선택사항)
 * @returns {Promise} 재고 정보
 */
export const getStoreInventory = async (storeId, productId = null) => {
  const url = productId 
    ? `/stores/${storeId}/inventory/${productId}`
    : `/stores/${storeId}/inventory`
  
  return extractData(
    apiClient.get(url)
  )
}

/**
 * 매장 서비스 정보 조회
 * @param {string} storeId - 매장 ID
 * @returns {Promise} 서비스 정보
 */
export const getStoreServices = async (storeId) => {
  return extractData(
    apiClient.get(`/stores/${storeId}/services`)
  )
}

/**
 * 매장 운영 시간 조회
 * @param {string} storeId - 매장 ID
 * @returns {Promise} 운영 시간 정보
 */
export const getStoreHours = async (storeId) => {
  return extractData(
    apiClient.get(`/stores/${storeId}/hours`)
  )
}

/**
 * 매장 검색 (이름, 주소로 검색)
 * @param {string} query - 검색어
 * @param {Object} filters - 필터 옵션
 * @returns {Promise} 검색 결과
 */
export const searchStores = async (query, filters = {}) => {
  const params = { q: query, ...filters }
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/stores/search?${queryParams}`)
  )
}

/**
 * 매장 즐겨찾기 추가
 * @param {string} storeId - 매장 ID
 * @returns {Promise} 추가 결과
 */
export const addStoreFavorite = async (storeId) => {
  return extractData(
    apiClient.post('/stores/favorites', { storeId })
  )
}

/**
 * 매장 즐겨찾기 제거
 * @param {string} storeId - 매장 ID
 * @returns {Promise} 제거 결과
 */
export const removeStoreFavorite = async (storeId) => {
  return extractData(
    apiClient.delete(`/stores/favorites/${storeId}`)
  )
}

/**
 * 즐겨찾기 매장 목록 조회
 * @returns {Promise} 즐겨찾기 매장 목록
 */
export const getFavoriteStores = async () => {
  return extractData(
    apiClient.get('/stores/favorites')
  )
}

/**
 * 매장 체크인
 * @param {string} storeId - 매장 ID
 * @param {Object} location - 위치 정보
 * @returns {Promise} 체크인 결과
 */
export const checkInStore = async (storeId, location) => {
  return extractData(
    apiClient.post(`/stores/${storeId}/checkin`, { location })
  )
}

/**
 * 체크인 히스토리 조회
 * @param {Object} params - 쿼리 파라미터
 * @returns {Promise} 체크인 히스토리
 */
export const getCheckInHistory = async (params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/checkins?${queryParams}`)
  )
}