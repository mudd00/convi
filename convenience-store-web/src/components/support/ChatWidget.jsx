import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Maximize2, Send, Phone, Mail } from 'lucide-react';
import { useChatConnection } from '../../hooks/useSupport';
import ChatWindow from './ChatWindow';
import { Button } from '../ui/Button';

/**
 * 플로팅 채팅 위젯 컴포넌트
 */
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // 채팅 세션 초기화
  useEffect(() => {
    if (isOpen && !sessionId) {
      const newSessionId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [isOpen, sessionId]);

  // 채팅 열기
  const handleOpenChat = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  // 채팅 닫기
  const handleCloseChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setSessionId(null);
  };

  // 최소화/최대화 토글
  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleOpenChat}
            className={`
              w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg
              flex items-center justify-center transition-all duration-300 hover:scale-110
              ${hasNewMessage ? 'animate-bounce' : ''}
            `}
            aria-label="고객센터 채팅 열기"
          >
            <MessageCircle className="w-6 h-6" />
            
            {/* 새 메시지 알림 배지 */}
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </button>

          {/* 도움말 툴팁 */}
          <div className="absolute bottom-16 right-0 bg-black text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            궁금한 점이 있으신가요?
            <div className="absolute top-full right-4 border-4 border-transparent border-t-black"></div>
          </div>
        </div>
      )}

      {/* 채팅 창 */}
      {isOpen && (
        <div className={`
          fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl border
          transition-all duration-300 ease-in-out
          ${isMinimized 
            ? 'w-80 h-14' 
            : 'w-80 h-96 sm:w-96 sm:h-[500px]'
          }
        `}>
          {/* 채팅 헤더 */}
          <div className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">고객센터</h3>
                <p className="text-xs opacity-90">
                  {sessionId ? '연결됨' : '연결 중...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* 최소화/최대화 버튼 */}
              <button
                onClick={handleToggleMinimize}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label={isMinimized ? '채팅창 확대' : '채팅창 최소화'}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>

              {/* 닫기 버튼 */}
              <button
                onClick={handleCloseChat}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                aria-label="채팅창 닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 채팅 내용 */}
          {!isMinimized && (
            <div className="flex flex-col h-full">
              {sessionId ? (
                <ChatWindow 
                  sessionId={sessionId}
                  onNewMessage={() => setHasNewMessage(true)}
                />
              ) : (
                <ChatInitialScreen onStartChat={handleOpenChat} />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

/**
 * 채팅 시작 전 초기 화면
 */
const ChatInitialScreen = ({ onStartChat }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-blue-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        안녕하세요!
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        편의점 고객센터입니다.<br />
        무엇을 도와드릴까요?
      </p>

      {/* 빠른 액션 버튼들 */}
      <div className="w-full space-y-2">
        <Button
          onClick={onStartChat}
          className="w-full flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          채팅 시작하기
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => window.location.href = 'tel:1588-0000'}
          >
            <Phone className="w-4 h-4" />
            전화
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={() => window.location.href = '/support'}
          >
            <Mail className="w-4 h-4" />
            문의
          </Button>
        </div>
      </div>

      {/* 운영 시간 안내 */}
      <div className="mt-6 text-xs text-gray-500">
        <p>📞 고객센터: 1588-0000</p>
        <p>🕐 운영시간: 평일 09:00-18:00</p>
      </div>
    </div>
  );
};

/**
 * 채팅 위젯 설정 컨텍스트
 */
export const ChatWidgetProvider = ({ children, config = {} }) => {
  const defaultConfig = {
    enabled: true,
    position: 'bottom-right', // bottom-right, bottom-left
    theme: 'blue', // blue, green, purple
    showOnPages: ['all'], // 특정 페이지에서만 표시
    hideOnPages: [], // 특정 페이지에서 숨김
    autoOpen: false, // 자동으로 채팅창 열기
    autoOpenDelay: 5000, // 자동 열기 지연 시간 (ms)
    showWelcomeMessage: true,
    welcomeMessage: '안녕하세요! 무엇을 도와드릴까요?'
  };

  const mergedConfig = { ...defaultConfig, ...config };

  // 현재 페이지에서 채팅 위젯을 표시할지 결정
  const shouldShowWidget = () => {
    if (!mergedConfig.enabled) return false;

    const currentPath = window.location.pathname;
    
    // 숨김 페이지 체크
    if (mergedConfig.hideOnPages.some(page => currentPath.includes(page))) {
      return false;
    }

    // 표시 페이지 체크
    if (mergedConfig.showOnPages.includes('all')) {
      return true;
    }

    return mergedConfig.showOnPages.some(page => currentPath.includes(page));
  };

  return (
    <>
      {children}
      {shouldShowWidget() && <ChatWidget config={mergedConfig} />}
    </>
  );
};

export default ChatWidget;