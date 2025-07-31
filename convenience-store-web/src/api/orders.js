import apiClient, { extractData, createQueryParams } from './client'

/**
 * 주문 관련 API 함수들
 */

/**
 * 주문 생성
 * @param {Object} orderData - 주문 데이터
 * @returns {Promise} 생성된 주문 정보
 */
export const createOrder = async (orderData) => {
  return extractData(
    apiClient.post('/orders', orderData)
  )
}

/**
 * 주문 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @returns {Promise} 주문 목록
 */
export const getOrders = async (params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/orders?${queryParams}`)
  )
}

/**
 * 주문 상세 정보 조회
 * @param {string} orderId - 주문 ID
 * @returns {Promise} 주문 상세 정보
 */
export const getOrder = async (orderId) => {
  return extractData(
    apiClient.get(`/orders/${orderId}`)
  )
}

/**
 * 주문 상태 업데이트
 * @param {string} orderId - 주문 ID
 * @param {string} status - 새로운 상태
 * @param {string} reason - 변경 사유 (선택사항)
 * @returns {Promise} 업데이트된 주문 정보
 */
export const updateOrderStatus = async (orderId, status, reason = null) => {
  return extractData(
    apiClient.put(`/orders/${orderId}/status`, { status, reason })
  )
}

/**
 * 주문 취소
 * @param {string} orderId - 주문 ID
 * @param {string} reason - 취소 사유
 * @returns {Promise} 취소된 주문 정보
 */
export const cancelOrder = async (orderId, reason) => {
  return extractData(
    apiClient.post(`/orders/${orderId}/cancel`, { reason })
  )
}

/**
 * 재주문
 * @param {string} orderId - 기존 주문 ID
 * @returns {Promise} 새로운 주문 정보
 */
export const reorder = async (orderId) => {
  return extractData(
    apiClient.post(`/orders/${orderId}/reorder`)
  )
}

/**
 * 주문 결제
 * @param {string} orderId - 주문 ID
 * @param {Object} paymentData - 결제 정보
 * @returns {Promise} 결제 결과
 */
export const payOrder = async (orderId, paymentData) => {
  return extractData(
    apiClient.post(`/orders/${orderId}/payment`, paymentData)
  )
}

/**
 * 주문 픽업 완료
 * @param {string} orderId - 주문 ID
 * @param {string} pickupCode - 픽업 코드
 * @returns {Promise} 픽업 완료 결과
 */
export const completePickup = async (orderId, pickupCode) => {
  return extractData(
    apiClient.post(`/orders/${orderId}/pickup`, { pickupCode })
  )
}

/**
 * 주문 리뷰 작성
 * @param {string} orderId - 주문 ID
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise} 작성된 리뷰
 */
export const createOrderReview = async (orderId, reviewData) => {
  return extractData(
    apiClient.post(`/orders/${orderId}/review`, reviewData)
  )
}

/**
 * 주문 통계 조회
 * @param {Object} params - 쿼리 파라미터 (기간, 매장 등)
 * @returns {Promise} 주문 통계
 */
export const getOrderStats = async (params = {}) => {
  const queryParams = createQueryParams(params)
  return extractData(
    apiClient.get(`/orders/stats?${queryParams}`)
  )
}

/**
 * 주문 영수증 조회
 * @param {string} orderId - 주문 ID
 * @returns {Promise} 영수증 정보
 */
export const getOrderReceipt = async (orderId) => {
  return extractData(
    apiClient.get(`/orders/${orderId}/receipt`)
  )
}

/**
 * 주문 추적 정보 조회
 * @param {string} orderId - 주문 ID
 * @returns {Promise} 추적 정보
 */
export const getOrderTracking = async (orderId) => {
  return extractData(
    apiClient.get(`/orders/${orderId}/tracking`)
  )
}