import { describe, it, expect, beforeEach, vi } from 'vitest'
import useCartStore from './cartStore'

// 테스트 전에 localStorage 모킹
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('cartStore', () => {
  // 테스트용 상품 데이터
  const mockProduct1 = {
    id: '1',
    name: '참치마요 삼각김밥',
    price: 1500,
    discountPrice: null
  }

  const mockProduct2 = {
    id: '2',
    name: '코카콜라 500ml',
    price: 1800,
    discountPrice: 1600
  }

  beforeEach(() => {
    // 각 테스트 전에 스토어 상태 초기화
    useCartStore.setState({
      items: [],
      totalAmount: 0,
      totalQuantity: 0,
      isLoading: false,
      error: null,
      appliedDiscount: null,
      discountAmount: 0
    })
    vi.clearAllMocks()
  })

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정된다', () => {
      const state = useCartStore.getState()
      
      expect(state.items).toEqual([])
      expect(state.totalAmount).toBe(0)
      expect(state.totalQuantity).toBe(0)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('상품 추가', () => {
    it('새로운 상품을 장바구니에 추가할 수 있다', () => {
      const { addItem } = useCartStore.getState()
      
      const result = addItem(mockProduct1, 2)
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(state.items).toHaveLength(1)
      expect(state.items[0].product.id).toBe(mockProduct1.id)
      expect(state.items[0].quantity).toBe(2)
      expect(state.totalAmount).toBe(3000) // 1500 * 2
      expect(state.totalQuantity).toBe(2)
    })

    it('이미 존재하는 상품의 수량이 증가한다', () => {
      const { addItem } = useCartStore.getState()
      
      // 첫 번째 추가
      addItem(mockProduct1, 1)
      // 두 번째 추가
      addItem(mockProduct1, 2)
      
      const state = useCartStore.getState()

      expect(state.items).toHaveLength(1)
      expect(state.items[0].quantity).toBe(3)
      expect(state.totalAmount).toBe(4500) // 1500 * 3
      expect(state.totalQuantity).toBe(3)
    })

    it('할인가가 있는 상품의 총액이 올바르게 계산된다', () => {
      const { addItem } = useCartStore.getState()
      
      addItem(mockProduct2, 1) // 할인가 1600원
      
      const state = useCartStore.getState()

      expect(state.totalAmount).toBe(1600) // 할인가 적용
    })
  })

  describe('상품 제거', () => {
    it('장바구니에서 상품을 제거할 수 있다', () => {
      const { addItem, removeItem } = useCartStore.getState()
      
      // 상품 추가
      addItem(mockProduct1, 2)
      addItem(mockProduct2, 1)
      
      // 상품 제거
      const result = removeItem(mockProduct1.id)
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(state.items).toHaveLength(1)
      expect(state.items[0].product.id).toBe(mockProduct2.id)
      expect(state.totalAmount).toBe(1600) // mockProduct2의 할인가
    })
  })

  describe('수량 업데이트', () => {
    it('상품 수량을 업데이트할 수 있다', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockProduct1, 2)
      
      const result = updateQuantity(mockProduct1.id, 5)
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(state.items[0].quantity).toBe(5)
      expect(state.totalAmount).toBe(7500) // 1500 * 5
    })

    it('수량을 0으로 설정하면 상품이 제거된다', () => {
      const { addItem, updateQuantity } = useCartStore.getState()
      
      addItem(mockProduct1, 2)
      
      const result = updateQuantity(mockProduct1.id, 0)
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(state.items).toHaveLength(0)
      expect(state.totalAmount).toBe(0)
    })
  })

  describe('장바구니 비우기', () => {
    it('장바구니를 완전히 비울 수 있다', () => {
      const { addItem, clearCart } = useCartStore.getState()
      
      addItem(mockProduct1, 2)
      addItem(mockProduct2, 1)
      
      const result = clearCart()
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(state.items).toHaveLength(0)
      expect(state.totalAmount).toBe(0)
      expect(state.totalQuantity).toBe(0)
    })
  })

  describe('유틸리티 함수들', () => {
    beforeEach(() => {
      const { addItem } = useCartStore.getState()
      addItem(mockProduct1, 2)
      addItem(mockProduct2, 1)
    })

    it('상품이 장바구니에 있는지 확인할 수 있다', () => {
      const { isInCart } = useCartStore.getState()

      expect(isInCart(mockProduct1.id)).toBe(true)
      expect(isInCart(mockProduct2.id)).toBe(true)
      expect(isInCart('999')).toBe(false)
    })

    it('특정 상품의 수량을 조회할 수 있다', () => {
      const { getItemQuantity } = useCartStore.getState()

      expect(getItemQuantity(mockProduct1.id)).toBe(2)
      expect(getItemQuantity(mockProduct2.id)).toBe(1)
      expect(getItemQuantity('999')).toBe(0)
    })

    it('장바구니 아이템 수를 조회할 수 있다', () => {
      const { getItemCount } = useCartStore.getState()

      expect(getItemCount()).toBe(2)
    })
  })

  describe('할인 적용', () => {
    it('퍼센트 할인을 적용할 수 있다', () => {
      const { addItem, applyDiscount } = useCartStore.getState()
      
      addItem(mockProduct1, 2) // 총 3000원
      
      const discount = {
        type: 'percentage',
        value: 10 // 10%
      }
      
      const result = applyDiscount(discount)
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(result.discountAmount).toBe(300) // 3000 * 0.1
      expect(state.totalAmount).toBe(2700) // 3000 - 300
    })

    it('고정 금액 할인을 적용할 수 있다', () => {
      const { addItem, applyDiscount } = useCartStore.getState()
      
      addItem(mockProduct1, 2) // 총 3000원
      
      const discount = {
        type: 'fixed',
        value: 500 // 500원 할인
      }
      
      const result = applyDiscount(discount)
      const state = useCartStore.getState()

      expect(result.success).toBe(true)
      expect(result.discountAmount).toBe(500)
      expect(state.totalAmount).toBe(2500) // 3000 - 500
    })
  })

  describe('배송비 계산', () => {
    it('무료 배송 기준 미만일 때 배송비가 부과된다', () => {
      const { calculateShippingFee } = useCartStore.getState()
      
      const shippingFee = calculateShippingFee(10000) // 15000원 미만
      
      expect(shippingFee).toBe(3000)
    })

    it('무료 배송 기준 이상일 때 배송비가 무료다', () => {
      const { calculateShippingFee } = useCartStore.getState()
      
      const shippingFee = calculateShippingFee(20000) // 15000원 이상
      
      expect(shippingFee).toBe(0)
    })
  })

  describe('최종 결제 금액', () => {
    it('최종 결제 금액이 올바르게 계산된다', () => {
      const { addItem, getFinalAmount } = useCartStore.getState()
      
      addItem(mockProduct1, 10) // 15000원 (무료배송 기준)
      
      const finalAmount = getFinalAmount()
      
      expect(finalAmount.subtotal).toBe(15000)
      expect(finalAmount.discountAmount).toBe(0)
      expect(finalAmount.shippingFee).toBe(0) // 무료배송
      expect(finalAmount.finalAmount).toBe(15000)
    })
  })
})