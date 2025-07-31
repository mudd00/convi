import { useState } from 'react'
import { User, Package, Star, Gift, Settings, LogOut } from 'lucide-react'
import { Card, Button } from '@/components/ui'
import MembershipCard from '@/components/profile/MembershipCard'
import PointHistory from '@/components/profile/PointHistory'
import CouponList from '@/components/profile/CouponList'
import { useProfile, useLogout } from '@/hooks/useAuth'

/**
 * 사용자 프로필 페이지
 * 개인정보, 멤버십, 포인트, 쿠폰 등 관리
 */
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // 사용자 정보 조회
  const { data: profile, isLoading } = useProfile()
  const logoutMutation = useLogout()

  // 임시 사용자 데이터 (실제로는 profile에서 가져옴)
  const user = profile || {
    id: '1',
    name: '김편의',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    membershipTier: 'GOLD',
    points: 15420,
    yearlySpent: 450000,
    yearlyPoints: 4500,
    joinDate: new Date('2023-03-15'),
    avatar: null
  }

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: '개요', icon: User },
    { id: 'points', name: '포인트', icon: Star },
    { id: 'coupons', name: '쿠폰', icon: Gift },
    { id: 'orders', name: '주문내역', icon: Package },
    { id: 'settings', name: '설정', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">마이페이지</h1>
              <p className="text-gray-600">안녕하세요, {user.name}님!</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 네비게이션 */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 멤버십 카드 */}
                <MembershipCard user={user} />

                {/* 빠른 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 text-center">
                    <div className="text-3xl mb-2">🛒</div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-sm text-gray-600">총 주문 수</p>
                  </Card>
                  
                  <Card className="p-6 text-center">
                    <div className="text-3xl mb-2">💝</div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">보유 쿠폰</p>
                  </Card>
                  
                  <Card className="p-6 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">작성한 리뷰</p>
                  </Card>
                </div>

                {/* 최근 활동 */}
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">최근 활동</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">상품 구매로 150P 적립</span>
                        </div>
                        <span className="text-sm text-gray-500">2시간 전</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">리뷰 작성 완료</span>
                        </div>
                        <span className="text-sm text-gray-500">1일 전</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700">생일 쿠폰 발급</span>
                        </div>
                        <span className="text-sm text-gray-500">3일 전</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'points' && (
              <PointHistory />
            )}

            {activeTab === 'coupons' && (
              <CouponList />
            )}

            {activeTab === 'orders' && (
              <Card className="p-8 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  주문내역이 없습니다
                </h3>
                <p className="text-gray-600 mb-4">
                  첫 주문을 해보세요!
                </p>
                <Button>
                  상품 둘러보기
                </Button>
              </Card>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">개인정보</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        defaultValue={user.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        defaultValue={user.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        defaultValue={user.phone}
                      />
                    </div>
                    <div className="pt-4">
                      <Button>
                        정보 수정
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">주문 알림</p>
                        <p className="text-sm text-gray-600">주문 상태 변경 시 알림을 받습니다</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">이벤트 알림</p>
                        <p className="text-sm text-gray-600">할인 이벤트 및 쿠폰 정보를 받습니다</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">포인트 알림</p>
                        <p className="text-sm text-gray-600">포인트 적립 및 만료 알림을 받습니다</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage