import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as storeApi from '@/api/stores'

/**
 * 매장 목록 조회 훅
 * @param {Object} params - 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useStores = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => storeApi.getStores(params),
    staleTime: 10 * 60 * 1000, // 10분 (매장 정보는 자주 변경되지 않음)
    cacheTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
    ...options
  })
}

/**
 * 매장 상세 정보 조회 훅
 * @param {string} storeId - 매장 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useStore = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => storeApi.getStore(storeId),
    enabled: !!storeId,
    staleTime: 15 * 60 * 1000, // 15분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options
  })
}

/**
 * 주변 매장 검색 훅
 * @param {Object} location - 위치 정보 { lat, lng }
 * @param {number} radius - 검색 반경 (km)
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useNearbyStores = (location, radius = 5, options = {}) => {
  return useQuery({
    queryKey: ['stores', 'nearby', location, radius],
    queryFn: () => storeApi.getNearbyStores(location, radius),
    enabled: !!(location?.lat && location?.lng),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 매장별 상품 재고 조회 훅
 * @param {string} storeId - 매장 ID
 * @param {string} productId - 상품 ID (선택사항)
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useStoreInventory = (storeId, productId = null, options = {}) => {
  return useQuery({
    queryKey: ['stores', storeId, 'inventory', productId],
    queryFn: () => storeApi.getStoreInventory(storeId, productId),
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000, // 2분 (재고는 자주 변경됨)
    cacheTime: 5 * 60 * 1000, // 5분
    ...options
  })
}

/**
 * 매장 서비스 정보 조회 훅
 * @param {string} storeId - 매장 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useStoreServices = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['stores', storeId, 'services'],
    queryFn: () => storeApi.getStoreServices(storeId),
    enabled: !!storeId,
    staleTime: 30 * 60 * 1000, // 30분
    cacheTime: 60 * 60 * 1000, // 1시간
    ...options
  })
}

/**
 * 매장 운영 시간 조회 훅
 * @param {string} storeId - 매장 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useStoreHours = (storeId, options = {}) => {
  return useQuery({
    queryKey: ['stores', storeId, 'hours'],
    queryFn: () => storeApi.getStoreHours(storeId),
    enabled: !!storeId,
    staleTime: 60 * 60 * 1000, // 1시간
    cacheTime: 2 * 60 * 60 * 1000, // 2시간
    ...options
  })
}

/**
 * 매장 검색 훅 (이름, 주소로 검색)
 * @param {string} query - 검색어
 * @param {Object} filters - 필터 옵션
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useStoreSearch = (query, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['stores', 'search', query, filters],
    queryFn: () => storeApi.searchStores(query, filters),
    enabled: !!query && query.length >= 2, // 최소 2글자 이상
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 매장 즐겨찾기 추가/제거 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useToggleStoreFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, isFavorited }) => 
      isFavorited 
        ? storeApi.removeStoreFavorite(storeId)
        : storeApi.addStoreFavorite(storeId),
    onSuccess: (data, variables) => {
      // 즐겨찾기 매장 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['stores', 'favorites'] })
      // 매장 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['store', variables.storeId] 
      })
      // 매장 목록 캐시도 무효화 (즐겨찾기 상태 업데이트)
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
    onError: (error) => {
      console.error('매장 즐겨찾기 처리 실패:', error)
    }
  })
}

/**
 * 즐겨찾기 매장 목록 훅
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useFavoriteStores = (options = {}) => {
  return useQuery({
    queryKey: ['stores', 'favorites'],
    queryFn: storeApi.getFavoriteStores,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options
  })
}

/**
 * 매장 체크인 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useStoreCheckIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storeId, location }) => 
      storeApi.checkInStore(storeId, location),
    onSuccess: (data, variables) => {
      // 체크인 히스토리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['checkins'] })
      // 매장 상세 정보 캐시 무효화 (체크인 수 업데이트)
      queryClient.invalidateQueries({ 
        queryKey: ['store', variables.storeId] 
      })
    },
    onError: (error) => {
      console.error('매장 체크인 실패:', error)
    }
  })
}

/**
 * 체크인 히스토리 조회 훅
 * @param {Object} params - 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useCheckInHistory = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['checkins', params],
    queryFn: () => storeApi.getCheckInHistory(params),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}