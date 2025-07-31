import React, { useState } from 'react';
import { Flame, Gift, Percent, Clock } from 'lucide-react';
import { useDiscountProducts, useEventExpiration } from '../hooks/usePromotions';
import DiscountBadge, { SimpleDiscountBadge } from '../components/product/DiscountBadge';
import TimeSale from '../components/promotion/TimeSale';
import { Button } from '../components/ui/Button';
import { useCartStore } from '../stores/cartStore';

/**
 * 할인 상품 페이지
 */
const DiscountsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { addItem } = useCartStore();
  
  // 이벤트 만료 처리
  useEventExpiration();

  // 할인 상품 데이터 가져오기
  const { data: allDiscountData, isLoading: isLoadingAll } = useDiscountProducts();
  const { data: discountData, isLoading: isLoadingDiscount } = useDiscountProducts('discount');
  const { data: onePlusOneData, isLoading: isLoading1Plus1 } = useDiscountProducts('buy_one_get_one');
  const { data: twoPlusOneData, isLoading: isLoading2Plus1 } = useDiscountProducts('buy_two_get_one');
  const { data: timeSaleData, isLoading: isLoadingTimeSale } = useDiscountProducts('time_sale');

  // 탭 설정
  const tabs = [
    {
      id: 'all',
      label: '전체',
      icon: Percent,
      data: allDiscountData?.data || [],
      isLoading: isLoadingAll
    },
    {
      id: 'discount',
      label: '할인가',
      icon: Percent,
      data: discountData?.data || [],
      isLoading: isLoadingDiscount
    },
    {
      id: '1plus1',
      label: '1+1',
      icon: Gift,
      data: onePlusOneData?.data || [],
      isLoading: isLoading1Plus1
    },
    {
      id: '2plus1',
      label: '2+1',
      icon: Gift,
      data: twoPlusOneData?.data || [],
      isLoading: isLoading2Plus1
    },
    {
      id: 'time_sale',
      label: '타임세일',
      icon: Flame,
      data: timeSaleData?.data || [],
      isLoading: isLoadingTimeSale
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  // 장바구니에 상품 추가
  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.originalPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      promotionType: product.promotionType
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Percent className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">할인 혜택</h1>
              <p className="text-gray-600 mt-1">다양한 할인 상품을 만나보세요</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 타임세일 섹션 (타임세일 상품이 있을 때만 표시) */}
        {timeSaleData?.data && timeSaleData.data.length > 0 && (
          <div className="mb-8">
            <TimeSale
              event={{
                title: '타임세일 특가',
                description: '한정 시간 특별 할인',
                discountValue: 30,
                endDate: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2시간 후
              }}
              products={timeSaleData.data}
              onProductClick={(product) => {
                // 상품 상세 페이지로 이동
                window.location.href = `/products/${product.id}`;
              }}
            />
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.data.length > 0 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {tab.data.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="bg-white rounded-lg shadow-sm">
          {currentTab?.isLoading ? (
            <DiscountProductsSkeleton />
          ) : currentTab?.data.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentTab.data.map((product) => (
                  <DiscountProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onProductClick={() => window.location.href = `/products/${product.id}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyDiscountProducts activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 할인 상품 카드 컴포넌트
 */
const DiscountProductCard = ({ product, onAddToCart, onProductClick }) => {
  return (
    <div className="group cursor-pointer" onClick={onProductClick}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* 상품 이미지 */}
        <div className="relative aspect-square">
          <img
            src={product.image || '/images/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* 할인 배지 */}
          <SimpleDiscountBadge
            discountRate={product.discountValue || Math.floor(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}
            promotionType={product.promotionType}
          />
        </div>

        {/* 상품 정보 */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* 가격 정보 */}
          <div className="mb-3">
            <DiscountBadge
              originalPrice={product.originalPrice}
              discountPrice={product.discountPrice}
              discountType={product.discountType}
              discountValue={product.discountValue}
              promotionType={product.promotionType}
              size="sm"
            />
          </div>

          {/* 장바구니 버튼 */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-full"
            size="sm"
          >
            장바구니 담기
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const DiscountProductsSkeleton = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 빈 상태 컴포넌트
 */
const EmptyDiscountProducts = ({ activeTab }) => {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case '1plus1':
        return {
          title: '진행 중인 1+1 이벤트가 없습니다',
          description: '곧 새로운 1+1 이벤트가 시작될 예정입니다.',
          icon: Gift
        };
      case '2plus1':
        return {
          title: '진행 중인 2+1 이벤트가 없습니다',
          description: '곧 새로운 2+1 이벤트가 시작될 예정입니다.',
          icon: Gift
        };
      case 'time_sale':
        return {
          title: '진행 중인 타임세일이 없습니다',
          description: '다음 타임세일을 기대해주세요!',
          icon: Clock
        };
      case 'discount':
        return {
          title: '진행 중인 할인 상품이 없습니다',
          description: '새로운 할인 상품이 곧 업데이트됩니다.',
          icon: Percent
        };
      default:
        return {
          title: '진행 중인 할인 이벤트가 없습니다',
          description: '새로운 할인 혜택을 준비 중입니다.',
          icon: Percent
        };
    }
  };

  const emptyState = getEmptyMessage();
  const Icon = emptyState.icon;

  return (
    <div className="p-12 text-center">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {emptyState.title}
      </h3>
      <p className="text-gray-500 mb-6">
        {emptyState.description}
      </p>
      <Button
        onClick={() => window.location.href = '/products'}
        variant="outline"
      >
        전체 상품 보기
      </Button>
    </div>
  );
};

export default DiscountsPage;