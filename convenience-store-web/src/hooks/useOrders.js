import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as orderApi from '@/api/orders'
import { useCartStore } from '@/stores/cartStore'

/**
 * 주문 생성 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { clearCart } = useCartStore()

  return useMutation({
    mutationFn: (orderData) => orderApi.createOrder(orderData),
    onSuccess: (data) => {
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      // 장바구니 초기화
      clearCart()
      
      // 매장 재고 캐시 무효화 (주문으로 인한 재고 변동)
      if (data.order.storeId) {
        queryClient.invalidateQueries({ 
          queryKey: ['stores', data.order.storeId, 'inventory'] 
        })
      }
      
      console.log('✅ 주문 생성 성공:', data.order.id)
    },
    onError: (error) => {
      console.error('❌ 주문 생성 실패:', error.message)
    }
  })
}

/**
 * 주문 목록 조회 훅
 * @param {Object} params - 쿼리 파라미터
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.getOrders(params),
    staleTime: 2 * 60 * 1000, // 2분 (주문 상태는 자주 변경됨)
    cacheTime: 5 * 60 * 1000, // 5분
    ...options
  })
}

/**
 * 주문 상세 정보 조회 훅
 * @param {string} orderId - 주문 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useOrder = (orderId, options = {}) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 1 * 60 * 1000, // 1분
    cacheTime: 5 * 60 * 1000, // 5분
    ...options
  })
}

/**
 * 주문 상태 업데이트 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, status, reason }) => 
      orderApi.updateOrderStatus(orderId, status, reason),
    onSuccess: (data, variables) => {
      // 해당 주문 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['order', variables.orderId] 
      })
      
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      console.log('✅ 주문 상태 업데이트 성공:', variables.status)
    },
    onError: (error) => {
      console.error('❌ 주문 상태 업데이트 실패:', error.message)
    }
  })
}

/**
 * 주문 취소 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, reason }) => orderApi.cancelOrder(orderId, reason),
    onSuccess: (data, variables) => {
      // 해당 주문 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['order', variables.orderId] 
      })
      
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      // 매장 재고 캐시 무효화 (취소로 인한 재고 복구)
      if (data.order.storeId) {
        queryClient.invalidateQueries({ 
          queryKey: ['stores', data.order.storeId, 'inventory'] 
        })
      }
      
      console.log('✅ 주문 취소 성공:', variables.orderId)
    },
    onError: (error) => {
      console.error('❌ 주문 취소 실패:', error.message)
    }
  })
}

/**
 * 재주문 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useReorder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId) => orderApi.reorder(orderId),
    onSuccess: (data) => {
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      // 장바구니 캐시 무효화 (재주문 상품이 장바구니에 추가됨)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      
      console.log('✅ 재주문 성공:', data.order.id)
    },
    onError: (error) => {
      console.error('❌ 재주문 실패:', error.message)
    }
  })
}

/**
 * 주문 결제 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const usePayOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, paymentData }) => 
      orderApi.payOrder(orderId, paymentData),
    onSuccess: (data, variables) => {
      // 해당 주문 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['order', variables.orderId] 
      })
      
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      // 결제 내역 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      
      console.log('✅ 주문 결제 성공:', variables.orderId)
    },
    onError: (error) => {
      console.error('❌ 주문 결제 실패:', error.message)
    }
  })
}

/**
 * 주문 픽업 완료 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useCompletePickup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, pickupCode }) => 
      orderApi.completePickup(orderId, pickupCode),
    onSuccess: (data, variables) => {
      // 해당 주문 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['order', variables.orderId] 
      })
      
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      console.log('✅ 픽업 완료:', variables.orderId)
    },
    onError: (error) => {
      console.error('❌ 픽업 완료 실패:', error.message)
    }
  })
}

/**
 * 주문 리뷰 작성 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useCreateOrderReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, reviewData }) => 
      orderApi.createOrderReview(orderId, reviewData),
    onSuccess: (data, variables) => {
      // 해당 주문 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['order', variables.orderId] 
      })
      
      // 주문 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      
      // 상품 리뷰 캐시 무효화
      if (data.review.productId) {
        queryClient.invalidateQueries({ 
          queryKey: ['products', data.review.productId, 'reviews'] 
        })
      }
      
      console.log('✅ 주문 리뷰 작성 성공')
    },
    onError: (error) => {
      console.error('❌ 주문 리뷰 작성 실패:', error.message)
    }
  })
}

/**
 * 주문 통계 조회 훅
 * @param {Object} params - 쿼리 파라미터 (기간, 매장 등)
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useOrderStats = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['orders', 'stats', params],
    queryFn: () => orderApi.getOrderStats(params),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options
  })
}

/**
 * 주문 영수증 조회 훅
 * @param {string} orderId - 주문 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useOrderReceipt = (orderId, options = {}) => {
  return useQuery({
    queryKey: ['order', orderId, 'receipt'],
    queryFn: () => orderApi.getOrderReceipt(orderId),
    enabled: !!orderId,
    staleTime: 30 * 60 * 1000, // 30분 (영수증은 변경되지 않음)
    cacheTime: 60 * 60 * 1000, // 1시간
    ...options
  })
}

/**
 * 주문 추적 정보 조회 훅
 * @param {string} orderId - 주문 ID
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useOrderTracking = (orderId, options = {}) => {
  return useQuery({
    queryKey: ['order', orderId, 'tracking'],
    queryFn: () => orderApi.getOrderTracking(orderId),
    enabled: !!orderId,
    staleTime: 1 * 60 * 1000, // 1분 (추적 정보는 자주 업데이트됨)
    cacheTime: 5 * 60 * 1000, // 5분
    refetchInterval: (data) => {
      // 주문이 완료되지 않은 경우에만 자동 갱신
      const completedStatuses = ['COMPLETED', 'CANCELLED', 'REFUNDED']
      return data?.status && !completedStatuses.includes(data.status) 
        ? 30 * 1000 // 30초마다 갱신
        : false // 완료된 주문은 갱신하지 않음
    },
    ...options
  })
}