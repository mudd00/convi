import { useState } from 'react'
import { Gift, Clock, Check, X, Calendar } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import { formatPrice, formatDate } from '@/utils/format'

/**
 * 쿠폰 목록 컴포넌트
 * 보유 쿠폰, 사용 가능 쿠폰 표시
 */
export const CouponList = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState('available') // 'available' | 'used' | 'expired'

  // 임시 쿠폰 데이터
  const coupons = [
    {
      id: '1',
      name: '신규 가입 축하 쿠폰',
      type: 'discount',
      discountType: 'amount',
      discountValue: 3000,
      minOrderAmount: 10000,
      status: 'available',
      expiryDate: new Date('2024-02-15'),
      issuedDate: new Date('2024-01-01'),
      description: '10,000원 이상 구매 시 3,000원 할인'
    },
    {
      id: '2',
      name: '생일 축하 쿠폰',
      type: 'discount',
      discountType: 'percent',
      discountValue: 15,
      minOrderAmount: 5000,
      status: 'available',
      expiryDate: new Date('2024-01-31'),
      issuedDate: new Date('2024-01-10'),
      description: '5,000원 이상 구매 시 15% 할인 (최대 5,000원)'
    },
    {
      id: '3',
      name: '무료배송 쿠폰',
      type: 'shipping',
      discountValue: 0,
      minOrderAmount: 15000,
      status: 'available',
      expiryDate: new Date('2024-03-01'),
      issuedDate: new Date('2024-01-05'),
      description: '15,000원 이상 구매 시 무료배송'
    },
    {
      id: '4',
      name: '첫 구매 할인 쿠폰',
      type: 'discount',
      discountType: 'amount',
      discountValue: 5000,
      minOrderAmount: 20000,
      status: 'used',
      expiryDate: new Date('2024-01-20'),
      issuedDate: new Date('2023-12-15'),
      usedDate: new Date('2024-01-12'),
      description: '20,000원 이상 구매 시 5,000원 할인'
    },
    {
      id: '5',
      name: '이벤트 참여 쿠폰',
      type: 'discount',
      discountType: 'percent',
      discountValue: 10,
      minOrderAmount: 0,
      status: 'expired',
      expiryDate: new Date('2024-01-10'),
      issuedDate: new Date('2023-12-20'),
      description: '전 상품 10% 할인'
    }
  ]

  // 탭별 쿠폰 필터링
  const filteredCoupons = coupons.filter(coupon => {
    switch (activeTab) {
      case 'available':
        return coupon.status === 'available' && new Date() < coupon.expiryDate
      case 'used':
        return coupon.status === 'used'
      case 'expired':
        return coupon.status === 'expired' || (coupon.status === 'available' && new Date() >= coupon.expiryDate)
      default:
        return true
    }
  })

  // 쿠폰 타입별 정보
  const getCouponTypeInfo = (coupon) => {
    if (coupon.type === 'shipping') {
      return {
        icon: '🚚',
        title: '무료배송',
        value: '배송비 무료',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    } else if (coupon.discountType === 'percent') {
      return {
        icon: '💯',
        title: `${coupon.discountValue}% 할인`,
        value: `${coupon.discountValue}%`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    } else {
      return {
        icon: '💰',
        title: `${formatPrice(coupon.discountValue)}원 할인`,
        value: `${formatPrice(coupon.discountValue)}원`,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }
  }

  // 쿠폰 상태별 정보
  const getStatusInfo = (coupon) => {
    const now = new Date()
    const isExpired = now >= coupon.expiryDate

    if (coupon.status === 'used') {
      return {
        icon: Check,
        text: '사용완료',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100'
      }
    } else if (isExpired) {
      return {
        icon: X,
        text: '기간만료',
        color: 'text-red-500',
        bgColor: 'bg-red-100'
      }
    } else {
      // 만료 임박 체크 (3일 이내)
      const daysUntilExpiry = Math.ceil((coupon.expiryDate - now) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiry <= 3) {
        return {
          icon: Clock,
          text: `${daysUntilExpiry}일 남음`,
          color: 'text-orange-500',
          bgColor: 'bg-orange-100'
        }
      } else {
        return {
          icon: Clock,
          text: '사용가능',
          color: 'text-green-500',
          bgColor: 'bg-green-100'
        }
      }
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant={activeTab === 'available' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('available')}
          className="flex-1"
        >
          사용가능 ({coupons.filter(c => c.status === 'available' && new Date() < c.expiryDate).length})
        </Button>
        <Button
          variant={activeTab === 'used' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('used')}
          className="flex-1"
        >
          사용완료 ({coupons.filter(c => c.status === 'used').length})
        </Button>
        <Button
          variant={activeTab === 'expired' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('expired')}
          className="flex-1"
        >
          만료됨 ({coupons.filter(c => c.status === 'expired' || (c.status === 'available' && new Date() >= c.expiryDate)).length})
        </Button>
      </div>

      {/* 쿠폰 목록 */}
      <div className="space-y-4">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => {
            const typeInfo = getCouponTypeInfo(coupon)
            const statusInfo = getStatusInfo(coupon)
            const StatusIcon = statusInfo.icon

            return (
              <Card 
                key={coupon.id} 
                className={`overflow-hidden ${typeInfo.borderColor} border-2 ${
                  coupon.status === 'available' && new Date() < coupon.expiryDate 
                    ? 'hover:shadow-lg transition-shadow' 
                    : 'opacity-75'
                }`}
              >
                <div className="flex">
                  {/* 쿠폰 왼쪽 - 할인 정보 */}
                  <div className={`${typeInfo.bgColor} p-6 flex flex-col items-center justify-center min-w-[120px]`}>
                    <div className="text-3xl mb-2">{typeInfo.icon}</div>
                    <div className={`text-lg font-bold ${typeInfo.color}`}>
                      {typeInfo.value}
                    </div>
                  </div>

                  {/* 쿠폰 오른쪽 - 상세 정보 */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {coupon.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {coupon.description}
                        </p>
                      </div>
                      
                      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.text}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(coupon.expiryDate)}까지
                        </div>
                        {coupon.minOrderAmount > 0 && (
                          <div>
                            최소 {formatPrice(coupon.minOrderAmount)}원 이상
                          </div>
                        )}
                      </div>

                      {coupon.status === 'available' && new Date() < coupon.expiryDate && (
                        <Button size="sm" variant="outline">
                          사용하기
                        </Button>
                      )}
                    </div>

                    {/* 사용 날짜 (사용완료인 경우) */}
                    {coupon.status === 'used' && coupon.usedDate && (
                      <div className="mt-2 text-xs text-gray-500">
                        {formatDate(coupon.usedDate)}에 사용됨
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'available' && '사용 가능한 쿠폰이 없습니다'}
              {activeTab === 'used' && '사용한 쿠폰이 없습니다'}
              {activeTab === 'expired' && '만료된 쿠폰이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'available' && '이벤트에 참여하거나 상품을 구매하여 쿠폰을 받아보세요!'}
              {activeTab === 'used' && '쿠폰을 사용하여 할인 혜택을 받아보세요!'}
              {activeTab === 'expired' && '새로운 쿠폰을 받아보세요!'}
            </p>
            {activeTab === 'available' && (
              <Button>
                쿠폰 받기
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

export default CouponList