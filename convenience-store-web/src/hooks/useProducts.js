import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as productApi from '@/api/products'

/**
 * 상품 목록 조회 훅
 * @param {Object} params - 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    ...options
  })
}

/**
 * 상품 상세 정보 조회 훅
 * @param {string} productId - 상품 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useProduct = (productId, options = {}) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProduct(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 15 * 60 * 1000, // 15분
    ...options
  })
}

/**
 * 상품 검색 훅
 * @param {string} query - 검색어
 * @param {Object} filters - 필터 옵션
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useProductSearch = (query, filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productApi.searchProducts(query, filters),
    enabled: !!query && query.length >= 2, // 최소 2글자 이상
    staleTime: 3 * 60 * 1000, // 3분
    cacheTime: 5 * 60 * 1000, // 5분
    ...options
  })
}

/**
 * 무한 스크롤 상품 목록 훅
 * @param {Object} params - 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 무한 쿼리 결과
 */
export const useInfiniteProducts = (params = {}, options = {}) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => 
      productApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.data.hasMore) return undefined
      return pages.length + 1
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 카테고리별 상품 목록 훅
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} params - 추가 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useProductsByCategory = (categoryId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, params],
    queryFn: () => productApi.getProductsByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 추천 상품 목록 훅
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useFeaturedProducts = (options = {}) => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productApi.getFeaturedProducts,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 15 * 60 * 1000, // 15분
    ...options
  })
}

/**
 * 할인 상품 목록 훅
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useDiscountProducts = (options = {}) => {
  return useQuery({
    queryKey: ['products', 'discounts'],
    queryFn: productApi.getDiscountProducts,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 상품 카테고리 목록 훅
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30분 (카테고리는 자주 변경되지 않음)
    cacheTime: 60 * 60 * 1000, // 1시간
    ...options
  })
}

/**
 * 상품 리뷰 목록 훅
 * @param {string} productId - 상품 ID
 * @param {Object} params - 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useProductReviews = (productId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['products', productId, 'reviews', params],
    queryFn: () => productApi.getProductReviews(productId, params),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 상품 리뷰 작성 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useCreateProductReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, reviewData }) => 
      productApi.createProductReview(productId, reviewData),
    onSuccess: (data, variables) => {
      // 해당 상품의 리뷰 목록 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['products', variables.productId, 'reviews'] 
      })
      // 상품 상세 정보도 무효화 (평점 업데이트)
      queryClient.invalidateQueries({ 
        queryKey: ['product', variables.productId] 
      })
    },
    onError: (error) => {
      console.error('리뷰 작성 실패:', error)
    }
  })
}

/**
 * 관심 상품 추가/제거 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useToggleWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, isWishlisted }) => 
      isWishlisted 
        ? productApi.removeFromWishlist(productId)
        : productApi.addToWishlist(productId),
    onSuccess: (data, variables) => {
      // 관심 상품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      // 상품 상세 정보 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['product', variables.productId] 
      })
    },
    onError: (error) => {
      console.error('관심 상품 처리 실패:', error)
    }
  })
}

/**
 * 관심 상품 목록 훅
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useWishlist = (options = {}) => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: productApi.getWishlist,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}