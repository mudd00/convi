import React, { useState } from 'react';
import { Ticket, Download, Check, Clock, Gift, Percent } from 'lucide-react';
import { useCoupons, useDownloadCoupon } from '../hooks/usePromotions';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

/**
 * 쿠폰 페이지
 */
const CouponsPage = () => {
  const [activeTab, setActiveTab] = useState('available');
  const { user, isAuthenticated } = useAuthStore();
  
  // 쿠폰 데이터 가져오기
  const { data: couponsData, isLoading } = useCoupons();
  const downloadCouponMutation = useDownloadCoupon();

  const coupons = couponsData?.data || [];

  // 탭별 쿠폰 필터링
  const availableCoupons = coupons.filter(coupon => !coupon.isDownloaded && !coupon.isUsed);
  const myCoupons = coupons.filter(coupon => coupon.isDownloaded && !coupon.isUsed);
  const usedCoupons = coupons.filter(coupon => coupon.isUsed);

  // 쿠폰 다운로드 처리
  const handleDownloadCoupon = async (couponId) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    try {
      await downloadCouponMutation.mutateAsync(couponId);
      alert('쿠폰이 다운로드되었습니다!');
    } catch (error) {
      alert('쿠폰 다운로드에 실패했습니다.');
    }
  };

  const tabs = [
    {
      id: 'available',
      label: '다운로드 가능',
      count: availableCoupons.length,
      data: availableCoupons
    },
    {
      id: 'my',
      label: '보유 쿠폰',
      count: myCoupons.length,
      data: myCoupons
    },
    {
      id: 'used',
      label: '사용 완료',
      count: usedCoupons.length,
      data: usedCoupons
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Ticket className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">쿠폰</h1>
              <p className="text-gray-600 mt-1">다양한 할인 쿠폰을 받아보세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 로그인 안내 (비로그인 사용자) */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold text-blue-900">로그인하고 더 많은 쿠폰을 받아보세요!</h3>
                <p className="text-blue-700 text-sm mt-1">
                  회원 전용 쿠폰과 개인 맞춤 할인 혜택을 놓치지 마세요.
                </p>
              </div>
              <Button
                onClick={() => window.location.href = '/login'}
                className="ml-auto"
              >
                로그인
              </Button>
            </div>
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 쿠폰 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <CouponsSkeleton />
          ) : currentTab?.data.length > 0 ? (
            currentTab.data.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                activeTab={activeTab}
                onDownload={() => handleDownloadCoupon(coupon.id)}
                isDownloading={downloadCouponMutation.isLoading}
              />
            ))
          ) : (
            <EmptyCoupons activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 쿠폰 카드 컴포넌트
 */
const CouponCard = ({ coupon, activeTab, onDownload, isDownloading }) => {
  const isExpired = new Date(coupon.expiryDate) < new Date();
  const daysLeft = Math.ceil((new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

  // 쿠폰 타입별 아이콘 및 색상
  const getCouponStyle = () => {
    if (coupon.discountType === 'percentage') {
      return {
        icon: Percent,
        bgColor: 'from-red-500 to-pink-500',
        badgeColor: 'bg-red-100 text-red-800'
      };
    } else {
      return {
        icon: Gift,
        bgColor: 'from-blue-500 to-purple-500',
        badgeColor: 'bg-blue-100 text-blue-800'
      };
    }
  };

  const style = getCouponStyle();
  const Icon = style.icon;

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border overflow-hidden
      ${isExpired ? 'opacity-50' : 'hover:shadow-md'}
      transition-shadow duration-200
    `}>
      <div className="flex">
        {/* 쿠폰 왼쪽 부분 (할인 정보) */}
        <div className={`
          bg-gradient-to-br ${style.bgColor} text-white p-6 flex flex-col justify-center items-center min-w-[160px]
        `}>
          <Icon className="w-8 h-8 mb-2" />
          <div className="text-center">
            <div className="text-2xl font-bold">
              {coupon.discountType === 'percentage' 
                ? `${coupon.discountValue}%`
                : `${coupon.discountValue.toLocaleString()}원`
              }
            </div>
            <div className="text-sm opacity-90">할인</div>
          </div>
        </div>

        {/* 쿠폰 오른쪽 부분 (상세 정보) */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {coupon.name}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.badgeColor}`}>
                  {coupon.discountType === 'percentage' ? '할인율' : '할인금액'}
                </span>
              </div>

              <p className="text-gray-600 mb-3">
                {coupon.description}
              </p>

              <div className="space-y-1 text-sm text-gray-500">
                <div>
                  최소 주문금액: {coupon.minOrderAmount.toLocaleString()}원
                </div>
                {coupon.maxDiscountAmount && (
                  <div>
                    최대 할인금액: {coupon.maxDiscountAmount.toLocaleString()}원
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {isExpired 
                      ? '만료됨' 
                      : `${daysLeft}일 남음 (${new Date(coupon.expiryDate).toLocaleDateString('ko-KR')}까지)`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="ml-4">
              {activeTab === 'available' && !isExpired && (
                <Button
                  onClick={onDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? '다운로드 중...' : '다운로드'}
                </Button>
              )}
              
              {activeTab === 'my' && !isExpired && (
                <Button
                  onClick={() => window.location.href = '/products'}
                  variant="outline"
                >
                  사용하기
                </Button>
              )}
              
              {activeTab === 'used' && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">사용 완료</span>
                </div>
              )}

              {isExpired && (
                <div className="text-gray-400 text-sm">
                  만료됨
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const CouponsSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex">
            <div className="w-40 h-32 bg-gray-200 animate-pulse"></div>
            <div className="flex-1 p-6">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 빈 상태 컴포넌트
 */
const EmptyCoupons = ({ activeTab }) => {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'available':
        return {
          title: '다운로드 가능한 쿠폰이 없습니다',
          description: '새로운 쿠폰이 곧 업데이트될 예정입니다.',
          action: { text: '상품 보러가기', href: '/products' }
        };
      case 'my':
        return {
          title: '보유한 쿠폰이 없습니다',
          description: '쿠폰을 다운로드하여 할인 혜택을 받아보세요.',
          action: { text: '쿠폰 다운로드', href: '#', onClick: () => setActiveTab('available') }
        };
      case 'used':
        return {
          title: '사용한 쿠폰이 없습니다',
          description: '쿠폰을 사용하여 할인 혜택을 받아보세요.',
          action: { text: '쿠폰 보러가기', href: '#', onClick: () => setActiveTab('available') }
        };
      default:
        return {
          title: '쿠폰이 없습니다',
          description: '다양한 할인 쿠폰을 확인해보세요.',
          action: { text: '상품 보러가기', href: '/products' }
        };
    }
  };

  const emptyState = getEmptyMessage();

  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {emptyState.title}
      </h3>
      <p className="text-gray-500 mb-6">
        {emptyState.description}
      </p>
      <Button
        onClick={emptyState.action.onClick || (() => window.location.href = emptyState.action.href)}
        variant="outline"
      >
        {emptyState.action.text}
      </Button>
    </div>
  );
};

export default CouponsPage;