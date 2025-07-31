import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// 프로모션 API 함수들 (실제 구현에서는 별도 API 파일에서 import)
const promotionApi = {
  // 진행 중인 이벤트 목록 조회
  getActiveEvents: async () => {
    // 실제 API 호출 대신 목업 데이터 반환
    return {
      data: [
        {
          id: '1',
          title: '신상품 출시 기념 할인',
          description: '새로 출시된 도시락 20% 할인',
          type: 'discount',
          discountType: 'percentage',
          discountValue: 20,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          bannerImage: '/images/events/new-product-banner.jpg',
          targetProducts: ['prod1', 'prod2'],
          isActive: true
        },
        {
          id: '2',
          title: '1+1 이벤트',
          description: '음료수 1+1 이벤트',
          type: 'buy_one_get_one',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-15'),
          bannerImage: '/images/events/drink-1plus1-banner.jpg',
          targetProducts: ['prod3', 'prod4'],
          isActive: true
        },
        {
          id: '3',
          title: '타임세일',
          description: '오후 2시-4시 한정 특가',
          type: 'time_sale',
          discountType: 'percentage',
          discountValue: 30,
          startDate: new Date(),
          endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2시간 후
          bannerImage: '/images/events/time-sale-banner.jpg',
          targetProducts: ['prod5'],
          isActive: true,
          timeRestriction: {
            startHour: 14,
            endHour: 16
          }
        }
      ]
    };
  },

  // 할인 상품 목록 조회
  getDiscountProducts: async (type) => {
    const products = [
      {
        id: 'prod1',
        name: '참치마요 도시락',
        originalPrice: 4500,
        discountPrice: 3600,
        discountType: 'percentage',
        discountValue: 20,
        promotionType: 'discount',
        image: '/images/products/tuna-mayo-lunch.jpg'
      },
      {
        id: 'prod3',
        name: '코카콜라 500ml',
        originalPrice: 1500,
        discountPrice: 1500,
        promotionType: 'buy_one_get_one',
        image: '/images/products/coca-cola.jpg'
      },
      {
        id: 'prod5',
        name: '삼각김밥 참치',
        originalPrice: 1200,
        discountPrice: 840,
        discountType: 'percentage',
        discountValue: 30,
        promotionType: 'time_sale',
        image: '/images/products/tuna-triangle.jpg'
      }
    ];

    if (type) {
      return { data: products.filter(p => p.promotionType === type) };
    }
    return { data: products };
  },

  // 쿠폰 목록 조회
  getCoupons: async () => {
    return {
      data: [
        {
          id: 'coupon1',
          name: '신규 가입 축하 쿠폰',
          description: '전 상품 10% 할인',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 5000,
          maxDiscountAmount: 2000,
          expiryDate: new Date('2024-12-31'),
          isDownloaded: false,
          isUsed: false
        },
        {
          id: 'coupon2',
          name: '생일 축하 쿠폰',
          description: '3000원 할인',
          discountType: 'fixed',
          discountValue: 3000,
          minOrderAmount: 10000,
          expiryDate: new Date('2024-03-31'),
          isDownloaded: true,
          isUsed: false
        }
      ]
    };
  },

  // 쿠폰 다운로드
  downloadCoupon: async (couponId) => {
    return { success: true, message: '쿠폰이 다운로드되었습니다.' };
  }
};

/**
 * 프로모션 이벤트 데이터를 관리하는 훅
 */
export const usePromotions = () => {
  return useQuery({
    queryKey: ['promotions', 'active'],
    queryFn: promotionApi.getActiveEvents,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false
  });
};

/**
 * 할인 상품 목록을 조회하는 훅
 */
export const useDiscountProducts = (type = null) => {
  return useQuery({
    queryKey: ['products', 'discount', type],
    queryFn: () => promotionApi.getDiscountProducts(type),
    staleTime: 3 * 60 * 1000, // 3분
    cacheTime: 10 * 60 * 1000
  });
};

/**
 * 쿠폰 목록을 조회하는 훅
 */
export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: promotionApi.getCoupons,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000
  });
};

/**
 * 쿠폰 다운로드 훅
 */
export const useDownloadCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: promotionApi.downloadCoupon,
    onSuccess: () => {
      // 쿠폰 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  });
};

/**
 * 타임세일 카운트다운을 위한 훅
 */
export const useTimeSaleCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endTime) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft(difference);
        setIsExpired(false);
      } else {
        setTimeLeft(0);
        setIsExpired(true);
      }
    };

    // 초기 계산
    calculateTimeLeft();

    // 1초마다 업데이트
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  // 시간을 시:분:초 형태로 변환
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      total: totalSeconds
    };
  };

  return {
    timeLeft: formatTime(timeLeft),
    isExpired,
    totalSeconds: Math.floor(timeLeft / 1000)
  };
};

/**
 * 이벤트 자동 만료 처리를 위한 훅
 */
export const useEventExpiration = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkExpiredEvents = () => {
      const now = new Date();
      
      // 캐시된 이벤트 데이터 확인
      const cachedData = queryClient.getQueryData(['promotions', 'active']);
      
      if (cachedData?.data) {
        const hasExpiredEvents = cachedData.data.some(event => 
          new Date(event.endDate) <= now
        );

        if (hasExpiredEvents) {
          // 만료된 이벤트가 있으면 캐시 무효화하여 새로운 데이터 가져오기
          queryClient.invalidateQueries({ queryKey: ['promotions', 'active'] });
          queryClient.invalidateQueries({ queryKey: ['products', 'discount'] });
        }
      }
    };

    // 1분마다 만료 이벤트 확인
    const interval = setInterval(checkExpiredEvents, 60 * 1000);

    return () => clearInterval(interval);
  }, [queryClient]);
};

/**
 * 할인 금액 계산 유틸리티 함수
 */
export const calculateDiscount = (originalPrice, discountType, discountValue) => {
  if (discountType === 'percentage') {
    const discountAmount = Math.floor(originalPrice * (discountValue / 100));
    return {
      discountAmount,
      finalPrice: originalPrice - discountAmount,
      discountRate: discountValue
    };
  } else if (discountType === 'fixed') {
    const discountAmount = Math.min(discountValue, originalPrice);
    return {
      discountAmount,
      finalPrice: originalPrice - discountAmount,
      discountRate: Math.floor((discountAmount / originalPrice) * 100)
    };
  }
  
  return {
    discountAmount: 0,
    finalPrice: originalPrice,
    discountRate: 0
  };
};