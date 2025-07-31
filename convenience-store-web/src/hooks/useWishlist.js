import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';

// 관심 상품 API 함수들 (실제 구현에서는 별도 API 파일에서 import)
const wishlistApi = {
  // 관심 상품 목록 조회
  getWishlist: async (userId) => {
    // 실제 API 호출 대신 목업 데이터 반환
    return {
      data: [
        {
          id: 'wish-1',
          productId: 'prod-001',
          product: {
            id: 'prod-001',
            name: '참치마요 삼각김밥',
            price: 1200,
            originalPrice: 1500,
            discountRate: 20,
            image: '/images/products/tuna-mayo-triangle.jpg',
            category: 'instant-food',
            brand: 'CU',
            isAvailable: true,
            isOnSale: true,
            promotionType: 'discount'
          },
          addedAt: new Date('2024-01-15'),
          notifyOnSale: true,
          notifyOnRestock: false
        },
        {
          id: 'wish-2',
          productId: 'prod-002',
          product: {
            id: 'prod-002',
            name: '코카콜라 500ml',
            price: 1500,
            originalPrice: 1500,
            image: '/images/products/coca-cola.jpg',
            category: 'beverages',
            brand: 'Coca-Cola',
            isAvailable: false,
            isOnSale: false,
            expectedRestockDate: new Date('2024-02-01')
          },
          addedAt: new Date('2024-01-10'),
          notifyOnSale: true,
          notifyOnRestock: true
        },
        {
          id: 'wish-3',
          productId: 'prod-003',
          product: {
            id: 'prod-003',
            name: '신라면 컵라면',
            price: 1800,
            originalPrice: 1800,
            image: '/images/products/shin-ramyun-cup.jpg',
            category: 'instant-food',
            brand: '농심',
            isAvailable: true,
            isOnSale: false
          },
          addedAt: new Date('2024-01-05'),
          notifyOnSale: true,
          notifyOnRestock: false
        }
      ]
    };
  },

  // 관심 상품 추가
  addToWishlist: async (userId, productId, options = {}) => {
    return {
      success: true,
      data: {
        id: `wish-${Date.now()}`,
        productId,
        addedAt: new Date(),
        notifyOnSale: options.notifyOnSale ?? true,
        notifyOnRestock: options.notifyOnRestock ?? false
      }
    };
  },

  // 관심 상품 제거
  removeFromWishlist: async (userId, productId) => {
    return { success: true };
  },

  // 관심 상품 알림 설정 업데이트
  updateWishlistNotifications: async (userId, productId, settings) => {
    return { success: true, data: settings };
  },

  // 상품이 관심 상품에 있는지 확인
  isInWishlist: async (userId, productId) => {
    return { isInWishlist: true }; // 목업 데이터
  },

  // 관심 상품 통계
  getWishlistStats: async (userId) => {
    return {
      data: {
        totalItems: 3,
        onSaleItems: 1,
        outOfStockItems: 1,
        recentlyAdded: 2
      }
    };
  }
};

/**
 * 관심 상품 목록을 조회하는 훅
 */
export const useWishlist = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => wishlistApi.getWishlist(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000 // 10분
  });
};

/**
 * 관심 상품 추가 훅
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ productId, options }) => 
      wishlistApi.addToWishlist(user?.id, productId, options),
    onSuccess: () => {
      // 관심 상품 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistStats'] });
    }
  });
};

/**
 * 관심 상품 제거 훅
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (productId) => wishlistApi.removeFromWishlist(user?.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistStats'] });
    }
  });
};

/**
 * 관심 상품 알림 설정 업데이트 훅
 */
export const useUpdateWishlistNotifications = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ productId, settings }) => 
      wishlistApi.updateWishlistNotifications(user?.id, productId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });
};

/**
 * 상품이 관심 상품에 있는지 확인하는 훅
 */
export const useIsInWishlist = (productId) => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['wishlist', 'check', user?.id, productId],
    queryFn: () => wishlistApi.isInWishlist(user?.id, productId),
    enabled: !!user && !!productId,
    staleTime: 2 * 60 * 1000, // 2분
    cacheTime: 5 * 60 * 1000 // 5분
  });
};

/**
 * 관심 상품 통계 조회 훅
 */
export const useWishlistStats = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['wishlistStats', user?.id],
    queryFn: () => wishlistApi.getWishlistStats(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000 // 10분
  });
};

/**
 * 관심 상품 토글 훅 (추가/제거를 하나의 함수로)
 */
export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const toggleWishlist = async (productId, isCurrentlyInWishlist, options = {}) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      if (isCurrentlyInWishlist) {
        await removeFromWishlist.mutateAsync(productId);
        return { action: 'removed', success: true };
      } else {
        await addToWishlist.mutateAsync({ productId, options });
        return { action: 'added', success: true };
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    toggleWishlist,
    isLoading: addToWishlist.isLoading || removeFromWishlist.isLoading,
    error: addToWishlist.error || removeFromWishlist.error
  };
};

/**
 * 관심 상품 일괄 관리 훅
 */
export const useBulkWishlistActions = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // 선택된 상품들을 관심 상품에서 제거
  const removeMultiple = useMutation({
    mutationFn: async (productIds) => {
      const promises = productIds.map(id => 
        wishlistApi.removeFromWishlist(user?.id, id)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistStats'] });
    }
  });

  // 관심 상품 알림 설정 일괄 업데이트
  const updateMultipleNotifications = useMutation({
    mutationFn: async ({ productIds, settings }) => {
      const promises = productIds.map(id => 
        wishlistApi.updateWishlistNotifications(user?.id, id, settings)
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  });

  return {
    removeMultiple,
    updateMultipleNotifications
  };
};

/**
 * 관심 상품 필터링 및 정렬 유틸리티 훅
 */
export const useWishlistFilters = (wishlistData) => {
  const [filters, setFilters] = useState({
    category: 'all',
    availability: 'all', // all, available, outOfStock
    onSale: 'all', // all, onSale, regular
    sortBy: 'addedAt', // addedAt, name, price
    sortOrder: 'desc' // asc, desc
  });

  const filteredAndSortedData = useMemo(() => {
    if (!wishlistData?.data) return [];

    let filtered = [...wishlistData.data];

    // 카테고리 필터
    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.product.category === filters.category);
    }

    // 재고 상태 필터
    if (filters.availability !== 'all') {
      filtered = filtered.filter(item => {
        if (filters.availability === 'available') {
          return item.product.isAvailable;
        } else if (filters.availability === 'outOfStock') {
          return !item.product.isAvailable;
        }
        return true;
      });
    }

    // 할인 상태 필터
    if (filters.onSale !== 'all') {
      filtered = filtered.filter(item => {
        if (filters.onSale === 'onSale') {
          return item.product.isOnSale;
        } else if (filters.onSale === 'regular') {
          return !item.product.isOnSale;
        }
        return true;
      });
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.product.name;
          bValue = b.product.name;
          break;
        case 'price':
          aValue = a.product.price;
          bValue = b.product.price;
          break;
        case 'addedAt':
        default:
          aValue = new Date(a.addedAt);
          bValue = new Date(b.addedAt);
          break;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [wishlistData, filters]);

  return {
    filters,
    setFilters,
    filteredData: filteredAndSortedData
  };
};