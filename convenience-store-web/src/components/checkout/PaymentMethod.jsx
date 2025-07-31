import { useState } from 'react'
import { CreditCard, Smartphone, Wallet, Gift } from 'lucide-react'
import { Card, Button, Input } from '@/components/ui'
import { formatPrice } from '@/utils/format'

/**
 * 결제 수단 선택 컴포넌트
 */
export const PaymentMethod = ({ 
  selectedMethod, 
  onMethodSelect, 
  totalAmount,
  availablePoints = 0,
  className = "" 
}) => {
  const [usePoints, setUsePoints] = useState(0)
  const [couponCode, setCouponCode] = useState('')

  // 결제 수단 목록
  const paymentMethods = [
    {
      id: 'card',
      name: '신용/체크카드',
      icon: CreditCard,
      description: '모든 카드사 지원',
      fee: 0,
      popular: true
    },
    {
      id: 'kakaopay',
      name: '카카오페이',
      icon: Smartphone,
      description: '간편하고 빠른 결제',
      fee: 0,
      popular: true
    },
    {
      id: 'naverpay',
      name: '네이버페이',
      icon: Wallet,
      description: '네이버 간편결제',
      fee: 0,
      popular: false
    },
    {
      id: 'tosspay',
      name: '토스페이',
      icon: Smartphone,
      description: '토스 간편결제',
      fee: 0,
      popular: false
    },
    {
      id: 'bank',
      name: '무통장입금',
      icon: CreditCard,
      description: '계좌이체',
      fee: 0,
      popular: false
    }
  ]

  // 포인트 사용 핸들러
  const handlePointsChange = (value) => {
    const points = Math.min(Math.max(0, parseInt(value) || 0), availablePoints)
    const maxUsablePoints = Math.min(availablePoints, totalAmount)
    setUsePoints(Math.min(points, maxUsablePoints))
  }

  // 전체 포인트 사용
  const useAllPoints = () => {
    const maxUsablePoints = Math.min(availablePoints, totalAmount)
    setUsePoints(maxUsablePoints)
  }

  // 최종 결제 금액 계산
  const finalAmount = Math.max(0, totalAmount - usePoints)

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* 결제 수단 선택 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            결제 수단
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon
              const isSelected = selectedMethod === method.id
              
              return (
                <Card
                  key={method.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-2 border-primary bg-primary-50'
                      : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => onMethodSelect?.(method.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {method.name}
                        </h4>
                        {method.popular && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            인기
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                      {method.fee > 0 && (
                        <p className="text-xs text-red-600">
                          수수료 {formatPrice(method.fee)}원
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 포인트 사용 */}
        {availablePoints > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              포인트 사용
            </h3>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="font-medium text-gray-900">
                    보유 포인트
                  </span>
                </div>
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(availablePoints)}P
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="사용할 포인트"
                    value={usePoints || ''}
                    onChange={(e) => handlePointsChange(e.target.value)}
                    max={Math.min(availablePoints, totalAmount)}
                    min={0}
                  />
                </div>
                <Button
                  onClick={useAllPoints}
                  variant="outline"
                  size="sm"
                >
                  전액 사용
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                최대 {formatPrice(Math.min(availablePoints, totalAmount))}P까지 사용 가능
              </p>
            </Card>
          </div>
        )}

        {/* 쿠폰 사용 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            쿠폰 사용
          </h3>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="쿠폰 코드를 입력하세요"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                disabled={!couponCode.trim()}
              >
                적용
              </Button>
            </div>
            
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
              >
                보유 쿠폰 확인
              </Button>
            </div>
          </Card>
        </div>

        {/* 결제 금액 요약 */}
        <Card className="p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            결제 금액
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">상품 금액</span>
              <span>{formatPrice(totalAmount)}원</span>
            </div>
            
            {usePoints > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">포인트 사용</span>
                <span className="text-red-600">-{formatPrice(usePoints)}원</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>최종 결제 금액</span>
                <span className="text-primary">
                  {formatPrice(finalAmount)}원
                </span>
              </div>
            </div>
          </div>
          
          {finalAmount === 0 && (
            <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                포인트로 전액 결제됩니다!
              </p>
            </div>
          )}
        </Card>

        {/* 결제 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-1">
                결제 안내
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 결제 완료 후 매장에서 픽업 코드를 확인해주세요</li>
                <li>• 픽업 시간은 주문 확정 후 약 10-20분입니다</li>
                <li>• 결제 취소는 픽업 전까지만 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethod