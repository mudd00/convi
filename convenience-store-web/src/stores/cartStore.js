import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * 장바구니 상태 관리 스토어
 * 장바구니 아이템 추가, 제거, 수량 변경 등의 기능을 관리
 */
const useCartStore = create(
  persist(
    (set, get) => ({
      // 상태 (State)
      items: [], // 장바구니 아이템 목록
      totalAmount: 0, // 총 금액
      totalQuantity: 0, // 총 수량
      isLoading: false, // 로딩 상태
      error: null, // 에러 메시지

      // 액션 (Actions)

      /**
       * 장바구니에 상품 추가
       * @param {Object} product - 추가할 상품 정보
       * @param {number} quantity - 수량 (기본값: 1)
       */
      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(item => item.product.id === product.id)
        
        let newItems
        if (existingItemIndex >= 0) {
          // 이미 존재하는 상품인 경우 수량 증가
          newItems = items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          // 새로운 상품인 경우 추가
          newItems = [...items, { 
            id: Date.now().toString(), // 고유 ID 생성
            product, 
            quantity,
            addedAt: new Date().toISOString()
          }]
        }
        
        // 총액과 총 수량 계산
        const { totalAmount, totalQuantity } = get().calculateTotals(newItems)
        
        set({ 
          items: newItems, 
          totalAmount, 
          totalQuantity,
          error: null 
        })
        
        return { success: true, items: newItems }
      },

      /**
       * 장바구니에서 상품 제거
       * @param {string} productId - 제거할 상품 ID
       */
      removeItem: (productId) => {
        const { items } = get()
        const newItems = items.filter(item => item.product.id !== productId)
        
        const { totalAmount, totalQuantity } = get().calculateTotals(newItems)
        
        set({ 
          items: newItems, 
          totalAmount, 
          totalQuantity,
          error: null 
        })
        
        return { success: true, items: newItems }
      },

      /**
       * 상품 수량 업데이트
       * @param {string} productId - 상품 ID
       * @param {number} quantity - 새로운 수량
       */
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(productId)
        }
        
        const { items } = get()
        const newItems = items.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
        
        const { totalAmount, totalQuantity } = get().calculateTotals(newItems)
        
        set({ 
          items: newItems, 
          totalAmount, 
          totalQuantity,
          error: null 
        })
        
        return { success: true, items: newItems }
      },

      /**
       * 장바구니 비우기
       */
      clearCart: () => {
        set({ 
          items: [], 
          totalAmount: 0, 
          totalQuantity: 0,
          error: null 
        })
        
        return { success: true }
      },

      /**
       * 총액과 총 수량 계산
       * @param {Array} items - 장바구니 아이템 목록
       */
      calculateTotals: (items) => {
        const totalAmount = items.reduce((sum, item) => {
          const price = item.product.discountPrice || item.product.price
          return sum + (price * item.quantity)
        }, 0)
        
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
        
        return { totalAmount, totalQuantity }
      },

      /**
       * 특정 상품이 장바구니에 있는지 확인
       * @param {string} productId - 상품 ID
       */
      isInCart: (productId) => {
        const { items } = get()
        return items.some(item => item.product.id === productId)
      },

      /**
       * 특정 상품의 장바구니 수량 조회
       * @param {string} productId - 상품 ID
       */
      getItemQuantity: (productId) => {
        const { items } = get()
        const item = items.find(item => item.product.id === productId)
        return item ? item.quantity : 0
      },

      /**
       * 장바구니 아이템 수 조회
       */
      getItemCount: () => {
        const { items } = get()
        return items.length
      },

      /**
       * 할인 적용
       * @param {Object} discount - 할인 정보
       */
      applyDiscount: (discount) => {
        set({ 
          appliedDiscount: discount,
          error: null 
        })
        
        // 할인 적용 후 총액 재계산
        const { items } = get()
        const { totalAmount } = get().calculateTotals(items)
        const discountAmount = get().calculateDiscountAmount(totalAmount, discount)
        
        set({ 
          totalAmount: totalAmount - discountAmount,
          discountAmount 
        })
        
        return { success: true, discountAmount }
      },

      /**
       * 할인 금액 계산
       * @param {number} totalAmount - 총 금액
       * @param {Object} discount - 할인 정보
       */
      calculateDiscountAmount: (totalAmount, discount) => {
        if (!discount) return 0
        
        switch (discount.type) {
          case 'percentage':
            return Math.floor(totalAmount * (discount.value / 100))
          case 'fixed':
            return Math.min(discount.value, totalAmount)
          default:
            return 0
        }
      },

      /**
       * 배송비 계산
       * @param {number} totalAmount - 총 주문 금액
       */
      calculateShippingFee: (totalAmount) => {
        // 무료 배송 기준 금액
        const freeShippingThreshold = 15000
        const standardShippingFee = 3000
        
        return totalAmount >= freeShippingThreshold ? 0 : standardShippingFee
      },

      /**
       * 최종 결제 금액 계산
       */
      getFinalAmount: () => {
        const { totalAmount, appliedDiscount } = get()
        const discountAmount = get().calculateDiscountAmount(totalAmount, appliedDiscount)
        const shippingFee = get().calculateShippingFee(totalAmount)
        
        return {
          subtotal: totalAmount,
          discountAmount,
          shippingFee,
          finalAmount: totalAmount - discountAmount + shippingFee
        }
      },

      /**
       * 에러 상태 초기화
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * 장바구니 상태 초기화 (로그아웃 시 사용)
       */
      reset: () => {
        set({
          items: [],
          totalAmount: 0,
          totalQuantity: 0,
          appliedDiscount: null,
          discountAmount: 0,
          isLoading: false,
          error: null
        })
      }
    }),
    {
      name: 'cart-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
      // 필요한 상태만 저장
      partialize: (state) => ({
        items: state.items,
        totalAmount: state.totalAmount,
        totalQuantity: state.totalQuantity,
        appliedDiscount: state.appliedDiscount,
        discountAmount: state.discountAmount
      })
    }
  )
)

export default useCartStore