import apiClient, { extractData, createQueryParams } from './client'

/**
 * 상품 관련 API 함수들
 */

/**
 * 상품 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @returns {Promise} 상품 목록
 */
export const getProducts = async (params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/products?${queryParams}`)
  )
}

/**
 * 상품 상세 정보 조회
 * @param {string} productId - 상품 ID
 * @returns {Promise} 상품 상세 정보
 */
export const getProduct = async (productId) => {
  return extractData(
    apiClient.get(`/products/${productId}`)
  )
}

/**
 * 상품 검색
 * @param {string} query - 검색어
 * @param {Object} filters - 필터 옵션
 * @returns {Promise} 검색 결과
 */
export const searchProducts = async (query, filters = {}) => {
  const params = { q: query, ...filters }
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/products/search?${queryParams}`)
  )
}

/**
 * 카테고리별 상품 조회
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} params - 추가 파라미터
 * @returns {Promise} 상품 목록
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/categories/${categoryId}/products?${queryParams}`)
  )
}

/**
 * 추천 상품 목록 조회
 * @returns {Promise} 추천 상품 목록
 */
export const getFeaturedProducts = async () => {
  return extractData(
    apiClient.get('/products/featured')
  )
}

/**
 * 할인 상품 목록 조회
 * @returns {Promise} 할인 상품 목록
 */
export const getDiscountProducts = async () => {
  return extractData(
    apiClient.get('/products/discounts')
  )
}

/**
 * 카테고리 목록 조회
 * @returns {Promise} 카테고리 목록
 */
export const getCategories = async () => {
  return extractData(
    apiClient.get('/categories')
  )
}

/**
 * 상품 리뷰 목록 조회
 * @param {string} productId - 상품 ID
 * @param {Object} params - 쿼리 파라미터
 * @returns {Promise} 리뷰 목록
 */
export const getProductReviews = async (productId, params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/products/${productId}/reviews?${queryParams}`)
  )
}

/**
 * 상품 리뷰 작성
 * @param {string} productId - 상품 ID
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise} 작성된 리뷰
 */
export const createProductReview = async (productId, reviewData) => {
  return extractData(
    apiClient.post(`/products/${productId}/reviews`, reviewData)
  )
}

/**
 * 관심 상품에 추가
 * @param {string} productId - 상품 ID
 * @returns {Promise} 추가 결과
 */
export const addToWishlist = async (productId) => {
  return extractData(
    apiClient.post('/wishlist', { productId })
  )
}

/**
 * 관심 상품에서 제거
 * @param {string} productId - 상품 ID
 * @returns {Promise} 제거 결과
 */
export const removeFromWishlist = async (productId) => {
  return extractData(
    apiClient.delete(`/wishlist/${productId}`)
  )
}

/**
 * 관심 상품 목록 조회
 * @returns {Promise} 관심 상품 목록
 */
export const getWishlist = async () => {
  return extractData(
    apiClient.get('/wishlist')
  )
}