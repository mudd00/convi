import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Clock, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { 
  useChatMessages, 
  useSendChatMessage, 
  useChatConnection,
  useSubmitSatisfactionSurvey,
  satisfactionOptions 
} from '../../hooks/useSupport';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 채팅 창 컴포넌트
 */
const ChatWindow = ({ sessionId, onNewMessage }) => {
  const [message, setMessage] = useState('');
  const [showSatisfactionSurvey, setShowSatisfactionSurvey] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 채팅 데이터 및 연결 상태
  const { data: messagesData, isLoading } = useChatMessages(sessionId);
  const sendMessageMutation = useSendChatMessage();
  const { isConnected, isTyping } = useChatConnection(sessionId);

  const messages = messagesData?.data || [];

  // 메시지 목록 끝으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 새 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    scrollToBottom();
    if (messages.length > 0) {
      onNewMessage?.();
    }
  }, [messages, onNewMessage]);

  // 메시지 전송
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isLoading) return;

    const messageToSend = message.trim();
    setMessage('');

    try {
      await sendMessageMutation.mutateAsync({
        sessionId,
        message: messageToSend
      });
      
      // 입력창에 포커스
      inputRef.current?.focus();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setMessage(messageToSend); // 실패 시 메시지 복원
    }
  };

  // 빠른 응답 버튼 클릭
  const handleQuickReply = (quickMessage) => {
    setMessage(quickMessage);
    inputRef.current?.focus();
  };

  // 상담 종료
  const handleEndChat = () => {
    setShowSatisfactionSurvey(true);
  };

  if (isLoading) {
    return <ChatLoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 연결 상태 표시 */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-xs text-yellow-700 text-center">
            연결 중입니다...
          </p>
        </div>
      )}

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <WelcomeMessage onQuickReply={handleQuickReply} />
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {/* 타이핑 인디케이터 */}
        {isTyping && <TypingIndicator />}

        {/* 스크롤 앵커 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 빠른 응답 버튼들 */}
      {messages.length > 0 && !showSatisfactionSurvey && (
        <QuickReplies onQuickReply={handleQuickReply} />
      )}

      {/* 만족도 조사 */}
      {showSatisfactionSurvey ? (
        <SatisfactionSurvey 
          sessionId={sessionId}
          onClose={() => setShowSatisfactionSurvey(false)}
        />
      ) : (
        <>
          {/* 메시지 입력 */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={sendMessageMutation.isLoading}
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>

          {/* 상담 종료 버튼 */}
          {messages.length > 2 && (
            <div className="px-4 pb-2">
              <button
                onClick={handleEndChat}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                상담 종료
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * 개별 채팅 메시지 컴포넌트
 */
const ChatMessage = ({ message }) => {
  const isBot = message.isBot;
  const isAdmin = message.isAdmin;

  return (
    <div className={`flex gap-3 ${!isBot && !isAdmin ? 'flex-row-reverse' : ''}`}>
      {/* 아바타 */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isBot 
          ? 'bg-blue-100 text-blue-600' 
          : isAdmin 
            ? 'bg-green-100 text-green-600'
            : 'bg-gray-100 text-gray-600'
        }
      `}>
        {isBot ? (
          <Bot className="w-4 h-4" />
        ) : isAdmin ? (
          <span className="text-xs font-bold">CS</span>
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* 메시지 내용 */}
      <div className={`flex-1 max-w-xs ${!isBot && !isAdmin ? 'text-right' : ''}`}>
        <div className={`
          inline-block px-3 py-2 rounded-lg text-sm whitespace-pre-wrap
          ${isBot 
            ? 'bg-gray-100 text-gray-900' 
            : isAdmin
              ? 'bg-green-100 text-green-900'
              : 'bg-blue-500 text-white'
          }
        `}>
          {message.content}
        </div>
        
        {/* 시간 표시 */}
        <div className={`
          text-xs text-gray-500 mt-1 flex items-center gap-1
          ${!isBot && !isAdmin ? 'justify-end' : ''}
        `}>
          <Clock className="w-3 h-3" />
          {formatDistanceToNow(new Date(message.timestamp), { 
            addSuffix: true, 
            locale: ko 
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * 환영 메시지 컴포넌트
 */
const WelcomeMessage = ({ onQuickReply }) => {
  const quickOptions = [
    '주문 관련 문의',
    '상품 문의',
    '결제 문제',
    '포인트 문의'
  ];

  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <Bot className="w-6 h-6 text-blue-600" />
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">
          안녕하세요! 👋
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          편의점 고객센터 챗봇입니다.<br />
          무엇을 도와드릴까요?
        </p>
      </div>

      {/* 빠른 선택 옵션 */}
      <div className="space-y-2">
        {quickOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onQuickReply(option)}
            className="w-full p-2 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 타이핑 인디케이터 컴포넌트
 */
const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-gray-100 rounded-lg px-3 py-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * 빠른 응답 버튼들
 */
const QuickReplies = ({ onQuickReply }) => {
  const quickReplies = [
    '네, 감사합니다',
    '다른 문의가 있어요',
    '상담원 연결',
    '전화 상담 요청'
  ];

  return (
    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-600 mb-2">빠른 응답:</p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onQuickReply(reply)}
            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 만족도 조사 컴포넌트
 */
const SatisfactionSurvey = ({ sessionId, onClose }) => {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const submitSurveyMutation = useSubmitSatisfactionSurvey();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return;

    try {
      await submitSurveyMutation.mutateAsync({
        sessionId,
        rating,
        feedback
      });
      setSubmitted(true);
      
      // 3초 후 자동으로 닫기
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('만족도 조사 제출 실패:', error);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 text-center border-t border-gray-200">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <ThumbsUp className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          소중한 의견 감사합니다!
        </h3>
        <p className="text-sm text-gray-600">
          더 나은 서비스로 찾아뵙겠습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">
            상담이 도움이 되셨나요?
          </h3>
          
          {/* 만족도 선택 */}
          <div className="flex justify-center gap-2 mb-3">
            {satisfactionOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRating(option.value)}
                className={`
                  p-2 rounded-lg transition-all text-2xl
                  ${rating === option.value 
                    ? 'bg-blue-100 scale-110' 
                    : 'hover:bg-gray-100 hover:scale-105'
                  }
                `}
                title={option.label}
              >
                {option.emoji}
              </button>
            ))}
          </div>

          {rating && (
            <p className="text-center text-sm text-gray-600 mb-3">
              {satisfactionOptions.find(opt => opt.value === rating)?.label}
            </p>
          )}
        </div>

        {/* 추가 의견 */}
        <div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="추가 의견이 있으시면 남겨주세요 (선택사항)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            rows={3}
          />
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-1"
          >
            건너뛰기
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!rating || submitSurveyMutation.isLoading}
            className="flex-1"
          >
            {submitSurveyMutation.isLoading ? '제출 중...' : '제출'}
          </Button>
        </div>
      </form>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const ChatLoadingSkeleton = () => {
  return (
    <div className="flex-1 p-4 space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;