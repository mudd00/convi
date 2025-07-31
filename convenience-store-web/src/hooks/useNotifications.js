import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

// 알림 API 함수들 (실제 구현에서는 별도 API 파일에서 import)
const notificationApi = {
  // 알림 목록 조회
  getNotifications: async (userId) => {
    // 실제 API 호출 대신 목업 데이터 반환
    return {
      data: [
        {
          id: '1',
          type: 'order',
          title: '주문 완료',
          message: '주문이 성공적으로 접수되었습니다.',
          data: { orderId: 'ORD-001' },
          isRead: false,
          createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후
        },
        {
          id: '2',
          type: 'promotion',
          title: '타임세일 시작',
          message: '지금 바로 30% 할인 혜택을 받아보세요!',
          data: { promotionId: 'PROMO-001' },
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2시간 후
        },
        {
          id: '3',
          type: 'point',
          title: '포인트 적립',
          message: '500포인트가 적립되었습니다.',
          data: { points: 500 },
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일 후
        },
        {
          id: '4',
          type: 'wishlist',
          title: '관심 상품 할인',
          message: '관심 상품 "참치마요 삼각김밥"이 할인 중입니다.',
          data: { productId: 'prod-001', productName: '참치마요 삼각김밥' },
          isRead: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4시간 전
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7일 후
        },
        {
          id: '5',
          type: 'system',
          title: '시스템 점검 안내',
          message: '오늘 밤 2시-4시 시스템 점검이 예정되어 있습니다.',
          data: {},
          isRead: true,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24시간 후
        }
      ],
      unreadCount: 3
    };
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    return { success: true };
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (userId) => {
    return { success: true };
  },

  // 알림 삭제
  deleteNotification: async (notificationId) => {
    return { success: true };
  },

  // 알림 설정 조회
  getNotificationSettings: async (userId) => {
    return {
      data: {
        order: true,        // 주문 관련 알림
        promotion: true,    // 프로모션 알림
        point: true,        // 포인트 관련 알림
        wishlist: true,     // 관심 상품 알림
        system: true,       // 시스템 알림
        push: true,         // 푸시 알림 허용
        email: false,       // 이메일 알림 허용
        sms: false          // SMS 알림 허용
      }
    };
  },

  // 알림 설정 업데이트
  updateNotificationSettings: async (userId, settings) => {
    return { success: true, data: settings };
  }
};

/**
 * 알림 목록을 조회하는 훅
 */
export const useNotifications = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationApi.getNotifications(user?.id),
    enabled: !!user,
    staleTime: 30 * 1000, // 30초
    cacheTime: 5 * 60 * 1000, // 5분
    refetchInterval: 60 * 1000 // 1분마다 자동 갱신
  });
};

/**
 * 알림 읽음 처리 훅
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      // 알림 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

/**
 * 모든 알림 읽음 처리 훅
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

/**
 * 알림 삭제 훅
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });
};

/**
 * 알림 설정 조회 훅
 */
export const useNotificationSettings = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['notificationSettings', user?.id],
    queryFn: () => notificationApi.getNotificationSettings(user?.id),
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000 // 30분
  });
};

/**
 * 알림 설정 업데이트 훅
 */
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (settings) => notificationApi.updateNotificationSettings(user?.id, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    }
  });
};

/**
 * 실시간 알림 수신 훅 (WebSocket 시뮬레이션)
 */
export const useRealTimeNotifications = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const wsRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // WebSocket 연결 시뮬레이션 (실제로는 WebSocket 서버에 연결)
    const connectWebSocket = () => {
      // 실제 구현에서는 WebSocket 연결
      // wsRef.current = new WebSocket(`ws://localhost:8080/notifications/${user.id}`);
      
      // 시뮬레이션을 위한 타이머
      const simulateConnection = () => {
        setIsConnected(true);
        
        // 30초마다 랜덤 알림 생성 (시뮬레이션)
        const interval = setInterval(() => {
          if (Math.random() > 0.7) { // 30% 확률로 알림 생성
            const mockNotification = {
              id: `notification-${Date.now()}`,
              type: ['order', 'promotion', 'point', 'wishlist'][Math.floor(Math.random() * 4)],
              title: '새로운 알림',
              message: '새로운 알림이 도착했습니다.',
              data: {},
              isRead: false,
              createdAt: new Date(),
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            };
            
            setNewNotification(mockNotification);
            
            // 알림 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }
        }, 30000);

        return () => {
          clearInterval(interval);
          setIsConnected(false);
        };
      };

      return simulateConnection();
    };

    const cleanup = connectWebSocket();

    return () => {
      if (cleanup) cleanup();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, queryClient]);

  // 새 알림 초기화
  const clearNewNotification = () => {
    setNewNotification(null);
  };

  return {
    isConnected,
    newNotification,
    clearNewNotification
  };
};

/**
 * 브라우저 푸시 알림 훅
 */
export const usePushNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSupported, setIsSupported] = useState('Notification' in window);

  // 푸시 알림 권한 요청
  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('이 브라우저는 푸시 알림을 지원하지 않습니다.');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  // 푸시 알림 표시
  const showNotification = (title, options = {}) => {
    if (permission !== 'granted') {
      console.warn('푸시 알림 권한이 없습니다.');
      return;
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // 알림 클릭 시 창 포커스
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // 5초 후 자동 닫기
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  };

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification
  };
};

/**
 * 포인트 만료 알림 스케줄링 훅
 */
export const usePointExpirationNotifications = () => {
  const { user } = useAuthStore();
  const { showNotification } = usePushNotifications();

  useEffect(() => {
    if (!user) return;

    // 포인트 만료 예정 확인 (실제로는 서버에서 처리)
    const checkPointExpiration = () => {
      // 목업 데이터: 7일 후 만료 예정인 포인트가 있다고 가정
      const expiringPoints = 1500;
      const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      if (expiringPoints > 0) {
        showNotification('포인트 만료 예정', {
          body: `${expiringPoints}포인트가 ${expirationDate.toLocaleDateString('ko-KR')}에 만료됩니다.`,
          tag: 'point-expiration',
          requireInteraction: true
        });
      }
    };

    // 매일 오전 9시에 확인 (시뮬레이션)
    const now = new Date();
    const nextCheck = new Date(now);
    nextCheck.setHours(9, 0, 0, 0);
    
    if (nextCheck <= now) {
      nextCheck.setDate(nextCheck.getDate() + 1);
    }

    const timeUntilNextCheck = nextCheck.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      checkPointExpiration();
      
      // 이후 24시간마다 반복
      const interval = setInterval(checkPointExpiration, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(interval);
    }, timeUntilNextCheck);

    return () => clearTimeout(timeout);
  }, [user, showNotification]);
};

/**
 * 알림 타입별 아이콘 및 색상 반환 유틸리티
 */
export const getNotificationStyle = (type) => {
  const styles = {
    order: {
      icon: '📦',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    promotion: {
      icon: '🎉',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    point: {
      icon: '💰',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    wishlist: {
      icon: '❤️',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    system: {
      icon: '⚙️',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  };

  return styles[type] || styles.system;
};