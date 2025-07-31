import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings, Filter } from 'lucide-react';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  getNotificationStyle 
} from '../../hooks/useNotifications';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 알림 센터 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 알림 센터 열림 상태
 * @param {Function} props.onClose - 닫기 콜백
 * @param {string} props.className - 추가 CSS 클래스
 */
const NotificationCenter = ({ isOpen, onClose, className = '' }) => {
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // 알림 데이터 및 뮤테이션
  const { data: notificationsData, isLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const notifications = notificationsData?.data || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // 알림 읽음 처리
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  // 알림 삭제
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotificationMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  // 알림 클릭 처리
  const handleNotificationClick = (notification) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // 알림 타입에 따른 페이지 이동
    switch (notification.type) {
      case 'order':
        if (notification.data?.orderId) {
          window.location.href = `/orders/${notification.data.orderId}`;
        }
        break;
      case 'promotion':
        if (notification.data?.promotionId) {
          window.location.href = `/discounts?promotion=${notification.data.promotionId}`;
        } else {
          window.location.href = '/discounts';
        }
        break;
      case 'wishlist':
        if (notification.data?.productId) {
          window.location.href = `/products/${notification.data.productId}`;
        } else {
          window.location.href = '/wishlist';
        }
        break;
      case 'point':
        window.location.href = '/profile?tab=points';
        break;
      default:
        break;
    }
  };

  // 체크박스 선택 처리
  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // 선택된 알림 일괄 삭제
  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;

    try {
      await Promise.all(
        selectedNotifications.map(id => deleteNotificationMutation.mutateAsync(id))
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error('선택된 알림 삭제 실패:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* 알림 센터 패널 */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md
        bg-white shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        ${className}
      `}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">알림</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="알림 센터 닫기"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 필터 및 액션 버튼 */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          {/* 필터 버튼 */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: '전체' },
              { key: 'unread', label: '읽지 않음' },
              { key: 'read', label: '읽음' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`
                  px-3 py-1 text-sm rounded-full transition-colors
                  ${filter === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={markAllAsReadMutation.isLoading}
                >
                  <CheckCheck className="w-4 h-4" />
                  모두 읽음
                </Button>
              )}
              
              {selectedNotifications.length > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                  disabled={deleteNotificationMutation.isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  선택 삭제
                </Button>
              )}
            </div>

            <button
              onClick={() => window.location.href = '/notifications/settings'}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="알림 설정"
            >
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <NotificationsSkeleton />
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedNotifications.includes(notification.id)}
                  onSelect={() => handleSelectNotification(notification.id)}
                  onClick={() => handleNotificationClick(notification)}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDeleteNotification(notification.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyNotifications filter={filter} />
          )}
        </div>
      </div>
    </>
  );
};

/**
 * 개별 알림 아이템 컴포넌트
 */
const NotificationItem = ({ 
  notification, 
  isSelected, 
  onSelect, 
  onClick, 
  onMarkAsRead, 
  onDelete 
}) => {
  const style = getNotificationStyle(notification.type);
  const isExpired = new Date(notification.expiresAt) < new Date();

  return (
    <div className={`
      p-4 hover:bg-gray-50 transition-colors cursor-pointer
      ${!notification.isRead ? 'bg-blue-50' : ''}
      ${isExpired ? 'opacity-60' : ''}
    `}>
      <div className="flex items-start gap-3">
        {/* 체크박스 */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        {/* 알림 아이콘 */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg
          ${style.bgColor} ${style.borderColor} border
        `}>
          {style.icon}
        </div>

        {/* 알림 내용 */}
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`
                text-sm font-medium text-gray-900
                ${!notification.isRead ? 'font-semibold' : ''}
              `}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDistanceToNow(new Date(notification.createdAt), { 
                  addSuffix: true, 
                  locale: ko 
                })}
                {isExpired && ' (만료됨)'}
              </p>
            </div>

            {/* 읽지 않음 표시 */}
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-1">
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="읽음 처리"
            >
              <Check className="w-4 h-4 text-gray-500" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-100 rounded transition-colors"
            aria-label="삭제"
          >
            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const NotificationsSkeleton = () => {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
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
const EmptyNotifications = ({ filter }) => {
  const getMessage = () => {
    switch (filter) {
      case 'unread':
        return {
          title: '읽지 않은 알림이 없습니다',
          description: '새로운 알림이 오면 여기에 표시됩니다.'
        };
      case 'read':
        return {
          title: '읽은 알림이 없습니다',
          description: '알림을 확인하면 여기에 표시됩니다.'
        };
      default:
        return {
          title: '알림이 없습니다',
          description: '새로운 소식이 있으면 알려드릴게요!'
        };
    }
  };

  const message = getMessage();

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
      <Bell className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {message.title}
      </h3>
      <p className="text-gray-500">
        {message.description}
      </p>
    </div>
  );
};

export default NotificationCenter;