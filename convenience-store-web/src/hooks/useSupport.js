import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

// 고객 지원 API 함수들 (실제 구현에서는 별도 API 파일에서 import)
const supportApi = {
  // FAQ 목록 조회
  getFAQs: async (category = null) => {
    // 실제 API 호출 대신 목업 데이터 반환
    const allFAQs = [
      {
        id: '1',
        category: 'order',
        question: '주문을 취소하고 싶어요',
        answer: '주문 후 5분 이내에는 마이페이지에서 직접 취소가 가능합니다. 그 이후에는 고객센터로 문의해주세요.',
        tags: ['주문', '취소'],
        viewCount: 1250,
        helpful: 89,
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        category: 'payment',
        question: '결제가 실패했는데 어떻게 해야 하나요?',
        answer: '결제 실패 시 다음을 확인해주세요:\n1. 카드 한도 확인\n2. 카드 정보 정확성 확인\n3. 인터넷 연결 상태 확인\n문제가 지속되면 고객센터로 연락주세요.',
        tags: ['결제', '실패', '카드'],
        viewCount: 980,
        helpful: 76,
        createdAt: new Date('2024-01-02')
      },
      {
        id: '3',
        category: 'product',
        question: '상품이 품절되었는데 언제 입고되나요?',
        answer: '상품별 입고 예정일은 상품 상세 페이지에서 확인하실 수 있습니다. 관심 상품으로 등록하시면 입고 시 알림을 받으실 수 있습니다.',
        tags: ['상품', '품절', '입고'],
        viewCount: 756,
        helpful: 65,
        createdAt: new Date('2024-01-03')
      },
      {
        id: '4',
        category: 'membership',
        question: '포인트는 어떻게 적립되나요?',
        answer: '구매 금액의 1%가 기본 적립되며, VIP 등급에 따라 추가 적립됩니다:\n- 일반: 1%\n- VIP: 1.5%\n- VVIP: 2%',
        tags: ['포인트', '적립', '멤버십'],
        viewCount: 1100,
        helpful: 92,
        createdAt: new Date('2024-01-04')
      },
      {
        id: '5',
        category: 'delivery',
        question: '픽업 시간을 변경할 수 있나요?',
        answer: '픽업 예정 시간 1시간 전까지는 마이페이지에서 변경 가능합니다. 그 이후에는 매장으로 직접 연락해주세요.',
        tags: ['픽업', '시간변경'],
        viewCount: 432,
        helpful: 38,
        createdAt: new Date('2024-01-05')
      }
    ];

    if (category) {
      return { data: allFAQs.filter(faq => faq.category === category) };
    }
    return { data: allFAQs };
  },

  // 문의 내역 조회
  getInquiries: async (userId) => {
    return {
      data: [
        {
          id: 'INQ-001',
          title: '주문 관련 문의',
          content: '주문한 상품이 누락되었습니다.',
          category: 'order',
          status: 'completed', // pending, in_progress, completed
          priority: 'high', // low, medium, high
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-21'),
          responses: [
            {
              id: 'RES-001',
              content: '안녕하세요. 주문 누락 건에 대해 확인해드리겠습니다.',
              isAdmin: true,
              createdAt: new Date('2024-01-20T10:30:00')
            },
            {
              id: 'RES-002',
              content: '확인 결과 배송 과정에서 누락된 것으로 확인되어 재발송 처리해드렸습니다.',
              isAdmin: true,
              createdAt: new Date('2024-01-21T09:15:00')
            }
          ]
        },
        {
          id: 'INQ-002',
          title: '포인트 적립 문의',
          content: '포인트가 정상적으로 적립되지 않았습니다.',
          category: 'membership',
          status: 'in_progress',
          priority: 'medium',
          createdAt: new Date('2024-01-22'),
          updatedAt: new Date('2024-01-22'),
          responses: [
            {
              id: 'RES-003',
              content: '포인트 적립 내역을 확인 중입니다. 조금만 기다려주세요.',
              isAdmin: true,
              createdAt: new Date('2024-01-22T14:20:00')
            }
          ]
        }
      ]
    };
  },

  // 새 문의 등록
  createInquiry: async (inquiryData) => {
    return {
      success: true,
      data: {
        id: `INQ-${Date.now()}`,
        ...inquiryData,
        status: 'pending',
        createdAt: new Date(),
        responses: []
      }
    };
  },

  // 채팅 메시지 조회
  getChatMessages: async (sessionId) => {
    return {
      data: [
        {
          id: 'msg-1',
          content: '안녕하세요! 편의점 고객센터입니다. 무엇을 도와드릴까요?',
          isBot: true,
          isAdmin: false,
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: 'msg-2',
          content: '주문 관련 문의가 있습니다.',
          isBot: false,
          isAdmin: false,
          timestamp: new Date(Date.now() - 4 * 60 * 1000)
        },
        {
          id: 'msg-3',
          content: '어떤 주문 관련 문의인지 자세히 알려주시겠어요?',
          isBot: true,
          isAdmin: false,
          timestamp: new Date(Date.now() - 3 * 60 * 1000)
        }
      ]
    };
  },

  // 채팅 메시지 전송
  sendChatMessage: async (sessionId, message) => {
    return {
      success: true,
      data: {
        id: `msg-${Date.now()}`,
        content: message,
        isBot: false,
        isAdmin: false,
        timestamp: new Date()
      }
    };
  },

  // 만족도 조사 제출
  submitSatisfactionSurvey: async (sessionId, rating, feedback) => {
    return {
      success: true,
      message: '소중한 의견 감사합니다.'
    };
  }
};

/**
 * FAQ 목록을 조회하는 훅
 */
export const useFAQs = (category = null) => {
  return useQuery({
    queryKey: ['faqs', category],
    queryFn: () => supportApi.getFAQs(category),
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000 // 30분
  });
};

/**
 * 문의 내역을 조회하는 훅
 */
export const useInquiries = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['inquiries', user?.id],
    queryFn: () => supportApi.getInquiries(user?.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000 // 10분
  });
};

/**
 * 새 문의 등록 훅
 */
export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supportApi.createInquiry,
    onSuccess: () => {
      // 문의 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    }
  });
};

/**
 * 채팅 메시지 조회 훅
 */
export const useChatMessages = (sessionId) => {
  return useQuery({
    queryKey: ['chatMessages', sessionId],
    queryFn: () => supportApi.getChatMessages(sessionId),
    enabled: !!sessionId,
    staleTime: 30 * 1000, // 30초
    cacheTime: 5 * 60 * 1000, // 5분
    refetchInterval: 5000 // 5초마다 새 메시지 확인
  });
};

/**
 * 채팅 메시지 전송 훅
 */
export const useSendChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, message }) => supportApi.sendChatMessage(sessionId, message),
    onSuccess: (data, variables) => {
      // 채팅 메시지 목록에 새 메시지 추가
      queryClient.setQueryData(['chatMessages', variables.sessionId], (oldData) => {
        if (!oldData) return { data: [data.data] };
        return {
          ...oldData,
          data: [...oldData.data, data.data]
        };
      });
    }
  });
};

/**
 * 만족도 조사 제출 훅
 */
export const useSubmitSatisfactionSurvey = () => {
  return useMutation({
    mutationFn: ({ sessionId, rating, feedback }) => 
      supportApi.submitSatisfactionSurvey(sessionId, rating, feedback)
  });
};

/**
 * 실시간 채팅 연결 훅
 */
export const useChatConnection = (sessionId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const wsRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!sessionId) return;

    // WebSocket 연결 시뮬레이션
    const connectWebSocket = () => {
      // 실제 구현에서는 WebSocket 서버에 연결
      // wsRef.current = new WebSocket(`ws://localhost:8080/chat/${sessionId}`);
      
      // 시뮬레이션을 위한 연결 상태 설정
      setIsConnected(true);

      // 봇 응답 시뮬레이션
      const simulateBotResponse = (userMessage) => {
        setIsTyping(true);
        
        setTimeout(() => {
          const botResponse = generateBotResponse(userMessage);
          
          // 채팅 메시지 목록에 봇 응답 추가
          queryClient.setQueryData(['chatMessages', sessionId], (oldData) => {
            if (!oldData) return { data: [botResponse] };
            return {
              ...oldData,
              data: [...oldData.data, botResponse]
            };
          });
          
          setIsTyping(false);
        }, 1000 + Math.random() * 2000); // 1-3초 후 응답
      };

      return { simulateBotResponse };
    };

    const { simulateBotResponse } = connectWebSocket();

    return () => {
      setIsConnected(false);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId, queryClient]);

  return {
    isConnected,
    isTyping
  };
};

/**
 * AI 챗봇 응답 생성 함수
 */
const generateBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  let response = '';

  // 키워드 기반 응답 생성
  if (message.includes('주문') || message.includes('order')) {
    if (message.includes('취소')) {
      response = '주문 취소는 주문 후 5분 이내에 마이페이지에서 가능합니다. 그 이후에는 고객센터(1588-0000)로 연락해주세요.';
    } else if (message.includes('변경')) {
      response = '주문 변경은 상품 준비 전까지만 가능합니다. 마이페이지에서 주문 상태를 확인해주세요.';
    } else {
      response = '주문 관련 문의이시군요. 구체적으로 어떤 도움이 필요하신가요? (주문 취소, 변경, 조회 등)';
    }
  } else if (message.includes('결제') || message.includes('payment')) {
    response = '결제 문제가 있으시군요. 카드 한도, 카드 정보, 인터넷 연결을 확인해주세요. 문제가 지속되면 카드사에 문의하시거나 다른 결제 수단을 이용해주세요.';
  } else if (message.includes('포인트') || message.includes('point')) {
    response = '포인트는 구매 금액의 1%가 기본 적립됩니다. VIP 등급에 따라 추가 적립 혜택이 있어요. 포인트 내역은 마이페이지에서 확인하실 수 있습니다.';
  } else if (message.includes('배송') || message.includes('픽업')) {
    response = '픽업 관련 문의이시군요. 픽업 시간은 주문 시 선택하신 시간대에 맞춰 준비됩니다. 변경이 필요하시면 1시간 전까지 마이페이지에서 수정 가능합니다.';
  } else if (message.includes('상품') || message.includes('product')) {
    response = '상품 관련 문의이시군요. 재고, 가격, 상품 정보 등 궁금한 점이 있으시면 구체적으로 알려주세요.';
  } else if (message.includes('안녕') || message.includes('hello') || message.includes('hi')) {
    response = '안녕하세요! 편의점 고객센터 챗봇입니다. 무엇을 도와드릴까요?';
  } else if (message.includes('감사') || message.includes('고마워')) {
    response = '도움이 되셨다니 기쁩니다! 다른 궁금한 점이 있으시면 언제든 말씀해주세요.';
  } else {
    response = '죄송합니다. 정확히 이해하지 못했어요. 다시 한번 말씀해주시거나, 다음 중에서 선택해주세요:\n\n1. 주문 관련 문의\n2. 결제 관련 문의\n3. 상품 관련 문의\n4. 포인트 관련 문의\n5. 상담원 연결';
  }

  return {
    id: `bot-${Date.now()}`,
    content: response,
    isBot: true,
    isAdmin: false,
    timestamp: new Date()
  };
};

/**
 * 상담 만족도 평가 옵션
 */
export const satisfactionOptions = [
  { value: 5, label: '매우 만족', emoji: '😍', color: 'text-green-500' },
  { value: 4, label: '만족', emoji: '😊', color: 'text-green-400' },
  { value: 3, label: '보통', emoji: '😐', color: 'text-yellow-500' },
  { value: 2, label: '불만족', emoji: '😞', color: 'text-orange-500' },
  { value: 1, label: '매우 불만족', emoji: '😡', color: 'text-red-500' }
];

/**
 * FAQ 카테고리 목록
 */
export const faqCategories = [
  { value: 'all', label: '전체', icon: '📋' },
  { value: 'order', label: '주문/결제', icon: '🛒' },
  { value: 'product', label: '상품', icon: '📦' },
  { value: 'membership', label: '멤버십/포인트', icon: '💎' },
  { value: 'delivery', label: '픽업/배송', icon: '🚚' },
  { value: 'payment', label: '결제', icon: '💳' },
  { value: 'etc', label: '기타', icon: '❓' }
];

/**
 * 문의 카테고리 목록
 */
export const inquiryCategories = [
  { value: 'order', label: '주문 관련' },
  { value: 'product', label: '상품 관련' },
  { value: 'payment', label: '결제 관련' },
  { value: 'membership', label: '멤버십/포인트' },
  { value: 'delivery', label: '픽업/배송' },
  { value: 'technical', label: '기술적 문제' },
  { value: 'suggestion', label: '건의사항' },
  { value: 'etc', label: '기타' }
];

/**
 * 문의 우선순위 옵션
 */
export const priorityOptions = [
  { value: 'low', label: '낮음', color: 'text-gray-500' },
  { value: 'medium', label: '보통', color: 'text-yellow-500' },
  { value: 'high', label: '높음', color: 'text-red-500' }
];

/**
 * 문의 상태 옵션
 */
export const statusOptions = [
  { value: 'pending', label: '대기 중', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { value: 'in_progress', label: '처리 중', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'completed', label: '완료', color: 'text-green-600', bgColor: 'bg-green-100' }
];