import { useState } from 'react'
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/utils/format'

/**
 * 장바구니 사이드바 드로어 컴포넌트
 */
export const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCartStore()

  // 수량 변경 핸들러
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  // 체크아웃 핸들러
  const handleCheckout = () => {
    onCheckout?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 드로어 */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">
              장바구니 ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* 장바구니 아이템 목록 */}
        <div className="flex-1 overflow-y-auto">
          {items.length > 0 ? (
            <div className="p-4 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                  {/* 상품 이미지 */}
                  <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.product.price)}원
                    </p>
                    
                    {/* 수량 조절 */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Minus className="h-4 w-4 text-gray-600" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* 가격 및 삭제 */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}원
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="mt-1 p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  장바구니가 비어있습니다
                </h3>
                <p className="text-gray-600">
                  상품을 담아보세요!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 하단 요약 및 체크아웃 */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* 전체 삭제 버튼 */}
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              전체 삭제
            </button>

            {/* 총액 */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>총 금액</span>
              <span className="text-primary">
                {formatPrice(totalAmount)}원
              </span>
            </div>

            {/* 체크아웃 버튼 */}
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
            >
              주문하기
            </Button>

            {/* 최소 주문 금액 안내 */}
            <p className="text-xs text-gray-500 text-center">
              최소 주문 금액: 5,000원
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer