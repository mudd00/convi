import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, MapPin, CreditCard, Check } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import StoreSelector from '@/components/checkout/StoreSelector'
import PaymentMethod from '@/components/checkout/PaymentMethod'
import { useCartStore } from '@/stores/cartStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { formatPrice } from '@/utils/format'

/**
 * 체크아웃 페이지
 * 매장 선택, 결제 수단 선택, 주문 확정
 */
const CheckoutPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1) // 1: 매장선택, 2: 결제, 3: 확인
  const [selectedStore, setSelectedStore] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  const { items, totalAmount, clearCart } = useCartStore()
  const createOrderMutation = useCreateOrder()

  // 장바구니가 비어있으면 상품 페이지로 리다이렉트
  if (items.length === 0) {
    navigate('/products')
    return null
  }

  // 단계별 제목
  const stepTitles = {
    1: '픽업 매장 선택',
    2: '결제 수단 선택',
    3: '주문 확인'
  }

  // 다음 단계로
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedStore) {
      alert('픽업할 매장을 선택해주세요.')
      return
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  // 이전 단계로
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // 주문 완료
  const handleCompleteOrder = async () => {
    try {
      const orderData = {
        storeId: selectedStore.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        paymentMethod,
        totalAmount
      }

      await createOrderMutation.mutateAsync(orderData)
      
      // 주문 완료 페이지로 이동
      navigate('/orders/success')
    } catch (error) {
      console.error('주문 실패:', error)
      alert('주문 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            주문하기
          </h1>
          <p className="text-gray-600">
            {stepTitles[currentStep]}
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-2">
            <div className="flex space-x-8 text-sm text-gray-600">
              <span className={currentStep === 1 ? 'text-primary font-medium' : ''}>
                매장선택
              </span>
              <span className={currentStep === 2 ? 'text-primary font-medium' : ''}>
                결제정보
              </span>
              <span className={currentStep === 3 ? 'text-primary font-medium' : ''}>
                주문확인
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <StoreSelector
                selectedStore={selectedStore}
                onStoreSelect={setSelectedStore}
                cartItems={items}
              />
            )}

            {currentStep === 2 && (
              <PaymentMethod
                selectedMethod={paymentMethod}
                onMethodSelect={setPaymentMethod}
                totalAmount={totalAmount}
                availablePoints={15420} // 임시 포인트
              />
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* 주문 요약 */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    주문 요약
                  </h3>
                  
                  <div className="space-y-4">
                    {/* 선택된 매장 */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedStore?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedStore?.address}
                        </p>
                      </div>
                    </div>

                    {/* 결제 수단 */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {paymentMethod === 'card' && '신용/체크카드'}
                          {paymentMethod === 'kakaopay' && '카카오페이'}
                          {paymentMethod === 'naverpay' && '네이버페이'}
                          {paymentMethod === 'tosspay' && '토스페이'}
                          {paymentMethod === 'bank' && '무통장입금'}
                        </p>
                        <p className="text-sm text-gray-600">
                          결제 금액: {formatPrice(totalAmount)}원
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 주문 동의 */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        주문 내용을 확인했으며, 결제에 동의합니다.
                      </span>
                    </label>
                    
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        required
                      />
                      <span className="text-sm text-gray-700">
                        개인정보 수집 및 이용에 동의합니다.
                      </span>
                    </label>
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* 사이드바 - 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    주문 상품 ({items.length}개)
                  </h3>
                </div>

                {/* 상품 목록 */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images?.[0]?.url && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity}개 × {formatPrice(item.product.price)}원
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}원
                      </div>
                    </div>
                  ))}
                </div>

                {/* 총액 */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>총 결제 금액</span>
                    <span className="text-primary">
                      {formatPrice(totalAmount)}원
                    </span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="mt-6 space-y-3">
                  {currentStep < 3 ? (
                    <>
                      <Button
                        onClick={handleNextStep}
                        className="w-full"
                        disabled={currentStep === 1 && !selectedStore}
                      >
                        다음 단계
                      </Button>
                      {currentStep > 1 && (
                        <Button
                          onClick={handlePrevStep}
                          variant="outline"
                          className="w-full"
                        >
                          이전 단계
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={handleCompleteOrder}
                      className="w-full"
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? '주문 처리 중...' : '주문 완료'}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage