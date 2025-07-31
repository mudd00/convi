import React, { useState } from 'react';
import { Bell, Settings, Smartphone, Mail, MessageSquare, Save } from 'lucide-react';
import { 
  useNotifications, 
  useNotificationSettings, 
  useUpdateNotificationSettings,
  usePushNotifications 
} from '../hooks/useNotifications';
import NotificationCenter from '../components/notification/NotificationCenter';
import { Button } from '../components/ui/Button';

/**
 * 알림 페이지 (알림 내역 + 설정)
 */
const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('history'); // history, settings
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const tabs = [
    { id: 'history', label: '알림 내역', icon: Bell },
    { id: 'settings', label: '알림 설정', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">알림</h1>
                <p className="text-gray-600 mt-1">알림 내역 및 설정을 관리하세요</p>
              </div>
            </div>

            <Button
              onClick={() => setShowNotificationCenter(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              알림 센터 열기
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'history' ? (
          <NotificationHistory />
        ) : (
          <NotificationSettings />
        )}
      </div>

      {/* 알림 센터 */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </div>
  );
};

/**
 * 알림 내역 컴포넌트
 */
const NotificationHistory = () => {
  const { data: notificationsData, isLoading } = useNotifications();
  const notifications = notificationsData?.data || [];

  // 날짜별로 그룹화
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  if (isLoading) {
    return <NotificationHistorySkeleton />;
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          알림 내역이 없습니다
        </h3>
        <p className="text-gray-500">
          새로운 알림이 오면 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
        <div key={date} className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Date(date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {dayNotifications.map((notification) => (
              <NotificationHistoryItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 알림 내역 아이템 컴포넌트
 */
const NotificationHistoryItem = ({ notification }) => {
  const getNotificationStyle = (type) => {
    const styles = {
      order: { icon: '📦', color: 'text-blue-600', bgColor: 'bg-blue-50' },
      promotion: { icon: '🎉', color: 'text-red-600', bgColor: 'bg-red-50' },
      point: { icon: '💰', color: 'text-green-600', bgColor: 'bg-green-50' },
      wishlist: { icon: '❤️', color: 'text-pink-600', bgColor: 'bg-pink-50' },
      system: { icon: '⚙️', color: 'text-gray-600', bgColor: 'bg-gray-50' }
    };
    return styles[type] || styles.system;
  };

  const style = getNotificationStyle(notification.type);
  const isExpired = new Date(notification.expiresAt) < new Date();

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors ${isExpired ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-4">
        {/* 알림 아이콘 */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg
          ${style.bgColor}
        `}>
          {style.icon}
        </div>

        {/* 알림 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`text-base font-medium text-gray-900 ${!notification.isRead ? 'font-semibold' : ''}`}>
                {notification.title}
              </h4>
              <p className="text-gray-600 mt-1">
                {notification.message}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span>
                  {new Date(notification.createdAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {isExpired && <span className="text-red-500">만료됨</span>}
                {!notification.isRead && (
                  <span className="text-blue-600 font-medium">읽지 않음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 알림 설정 컴포넌트
 */
const NotificationSettings = () => {
  const { data: settingsData, isLoading } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();
  const { permission, requestPermission, isSupported } = usePushNotifications();

  const [settings, setSettings] = useState(settingsData?.data || {});
  const [hasChanges, setHasChanges] = useState(false);

  // 설정 데이터가 로드되면 상태 업데이트
  React.useEffect(() => {
    if (settingsData?.data) {
      setSettings(settingsData.data);
    }
  }, [settingsData]);

  // 설정 변경 핸들러
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  // 설정 저장
  const handleSaveSettings = async () => {
    try {
      await updateSettingsMutation.mutateAsync(settings);
      setHasChanges(false);
      alert('설정이 저장되었습니다.');
    } catch (error) {
      alert('설정 저장에 실패했습니다.');
    }
  };

  // 푸시 알림 권한 요청
  const handleRequestPushPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        handleSettingChange('push', true);
        alert('푸시 알림이 허용되었습니다.');
      } else {
        alert('푸시 알림이 거부되었습니다.');
      }
    } catch (error) {
      alert('푸시 알림 설정에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <NotificationSettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* 알림 타입 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          알림 타입 설정
        </h3>
        <div className="space-y-4">
          {[
            { key: 'order', label: '주문 관련 알림', description: '주문 접수, 준비 완료, 픽업 안내 등' },
            { key: 'promotion', label: '프로모션 알림', description: '할인 이벤트, 타임세일, 쿠폰 등' },
            { key: 'point', label: '포인트 관련 알림', description: '포인트 적립, 만료 예정 안내 등' },
            { key: 'wishlist', label: '관심 상품 알림', description: '관심 상품 할인, 재입고 안내 등' },
            { key: 'system', label: '시스템 알림', description: '점검 안내, 업데이트 소식 등' }
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key] || false}
                  onChange={(e) => handleSettingChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 알림 방식 설정 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          알림 방식 설정
        </h3>
        <div className="space-y-4">
          {/* 푸시 알림 */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">푸시 알림</h4>
                <p className="text-sm text-gray-500 mt-1">
                  브라우저 푸시 알림으로 실시간 알림을 받습니다
                </p>
                {!isSupported && (
                  <p className="text-sm text-red-500 mt-1">
                    이 브라우저는 푸시 알림을 지원하지 않습니다
                  </p>
                )}
                {permission === 'denied' && (
                  <p className="text-sm text-red-500 mt-1">
                    푸시 알림이 차단되어 있습니다. 브라우저 설정에서 허용해주세요
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {permission !== 'granted' && isSupported && (
                <Button
                  onClick={handleRequestPushPermission}
                  size="sm"
                  variant="outline"
                >
                  권한 요청
                </Button>
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.push && permission === 'granted'}
                  onChange={(e) => handleSettingChange('push', e.target.checked)}
                  disabled={!isSupported || permission !== 'granted'}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
              </label>
            </div>
          </div>

          {/* 이메일 알림 */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">이메일 알림</h4>
                <p className="text-sm text-gray-500 mt-1">
                  이메일로 중요한 알림을 받습니다
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email || false}
                onChange={(e) => handleSettingChange('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* SMS 알림 */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">SMS 알림</h4>
                <p className="text-sm text-gray-500 mt-1">
                  문자 메시지로 중요한 알림을 받습니다
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sms || false}
                onChange={(e) => handleSettingChange('sms', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      {hasChanges && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              변경사항이 있습니다. 저장하시겠습니까?
            </p>
            <Button
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {updateSettingsMutation.isLoading ? '저장 중...' : '설정 저장'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 로딩 스켈레톤들
 */
const NotificationHistorySkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm animate-pulse">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 3 }).map((_, itemIndex) => (
            <div key={itemIndex} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const NotificationSettingsSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, itemIndex) => (
            <div key={itemIndex} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default NotificationsPage;