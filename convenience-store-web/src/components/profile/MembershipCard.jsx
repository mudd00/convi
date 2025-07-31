import { Crown, Star, Gift, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatPrice, formatNumberWithUnit } from '@/utils/format'

/**
 * 멤버십 카드 컴포넌트
 * 사용자의 등급, 포인트, 혜택 정보를 표시
 */
export const MembershipCard = ({ user, className = "" }) => {
  // 멤버십 등급 정보
  const membershipTiers = {
    BRONZE: {
      name: '브론즈',
      color: 'from-amber-600 to-amber-800',
      icon: Star,
      benefits: ['기본 적립 1%', '생일 쿠폰'],
      nextTier: 'SILVER',
      requiredAmount: 100000
    },
    SILVER: {
      name: '실버',
      color: 'from-gray-400 to-gray-600',
      icon: Star,
      benefits: ['적립 1.5%', '생일 쿠폰', '월 1회 무료배송'],
      nextTier: 'GOLD',
      requiredAmount: 300000
    },
    GOLD: {
      name: '골드',
      color: 'from-yellow-400 to-yellow-600',
      icon: Crown,
      benefits: ['적립 2%', '생일 쿠폰', '무료배송', '우선 고객지원'],
      nextTier: 'VIP',
      requiredAmount: 500000
    },
    VIP: {
      name: 'VIP',
      color: 'from-purple-500 to-purple-700',
      icon: Crown,
      benefits: ['적립 3%', '생일 쿠폰', '무료배송', '전용 상담', '특별 할인'],
      nextTier: null,
      requiredAmount: null
    }
  }

  const currentTier = membershipTiers[user.membershipTier] || membershipTiers.BRONZE
  const IconComponent = currentTier.icon

  // 다음 등급까지 필요한 금액 계산
  const getProgressToNextTier = () => {
    if (!currentTier.nextTier) return null

    const nextTier = membershipTiers[currentTier.nextTier]
    const progress = (user.yearlySpent / nextTier.requiredAmount) * 100
    const remaining = Math.max(0, nextTier.requiredAmount - user.yearlySpent)

    return {
      nextTierName: nextTier.name,
      progress: Math.min(100, progress),
      remaining
    }
  }

  const progressInfo = getProgressToNextTier()

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* 멤버십 카드 헤더 */}
      <div className={`bg-gradient-to-r ${currentTier.color} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <IconComponent className="h-8 w-8" />
            <div>
              <h3 className="text-xl font-bold">{currentTier.name} 멤버</h3>
              <p className="text-sm opacity-90">{user.name}님</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">포인트</p>
            <p className="text-2xl font-bold">{formatNumberWithUnit(user.points)}</p>
          </div>
        </div>
      </div>

      {/* 멤버십 정보 */}
      <div className="p-6 space-y-6">
        {/* 등급 혜택 */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Gift className="h-5 w-5 mr-2 text-primary" />
            등급 혜택
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentTier.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* 다음 등급 진행도 */}
        {progressInfo && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              {progressInfo.nextTierName} 등급까지
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>진행률</span>
                <span>{progressInfo.progress.toFixed(1)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressInfo.progress}%` }}
                ></div>
              </div>
              
              <p className="text-sm text-gray-600">
                {formatPrice(progressInfo.remaining)}원 더 구매하시면 {progressInfo.nextTierName} 등급이 됩니다!
              </p>
            </div>
          </div>
        )}

        {/* 올해 구매 금액 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">올해 구매 금액</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(user.yearlySpent)}원
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">적립 포인트</p>
              <p className="text-lg font-semibold text-primary">
                {formatNumberWithUnit(user.yearlyPoints)}P
              </p>
            </div>
          </div>
        </div>

        {/* VIP 등급인 경우 특별 메시지 */}
        {user.membershipTier === 'VIP' && (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center">
              <Crown className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <p className="font-semibold text-purple-900">VIP 회원님께 감사드립니다!</p>
                <p className="text-sm text-purple-700">최고 등급의 모든 혜택을 누리고 계십니다.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default MembershipCard