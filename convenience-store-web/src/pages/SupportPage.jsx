import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  FileText, 
  Users,
  Star,
  ChevronRight
} from 'lucide-react';
import { useInquiries } from '../hooks/useSupport';
import FAQSection, { PopularFAQs } from '../components/support/FAQSection';
import InquiryForm from '../components/support/InquiryForm';
import ChatWidget from '../components/support/ChatWidget';
import { Button } from '../components/ui/Button';

/**
 * 고객센터 메인 페이지
 */
const SupportPage = () => {
  const [activeTab, setActiveTab] = useState('faq'); // faq, inquiry, history
  const [showChatWidget, setShowChatWidget] = useState(false);

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'inquiry', label: '문의하기', icon: Mail },
    { id: 'history', label: '문의 내역', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              고객센터
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              궁금한 점이 있으시면 언제든 문의해주세요
            </p>

            {/* 빠른 연락 방법 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <ContactCard
                icon={MessageCircle}
                title="실시간 채팅"
                description="즉시 답변을 받아보세요"
                action="채팅 시작"
                onClick={() => setShowChatWidget(true)}
                color="blue"
              />
              <ContactCard
                icon={Phone}
                title="전화 상담"
                description="1588-0000"
                action="전화걸기"
                onClick={() => window.location.href = 'tel:1588-0000'}
                color="green"
              />
              <ContactCard
                icon={Mail}
                title="이메일 문의"
                description="상세한 문의를 남겨주세요"
                action="문의하기"
                onClick={() => setActiveTab('inquiry')}
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 운영 시간 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">고객센터 운영 시간</h3>
              <div className="text-blue-700 text-sm mt-1 space-y-1">
                <p>📞 전화 상담: 평일 09:00 - 18:00 (점심시간 12:00-13:00 제외)</p>
                <p>💬 실시간 채팅: 24시간 운영 (AI 챗봇)</p>
                <p>📧 이메일 문의: 24시간 접수, 1-2 영업일 내 답변</p>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'faq' && <FAQSection />}
          {activeTab === 'inquiry' && (
            <InquiryForm onSuccess={() => setActiveTab('history')} />
          )}
          {activeTab === 'history' && <InquiryHistory />}
        </div>

        {/* 추가 도움말 섹션 */}
        {activeTab === 'faq' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 인기 FAQ */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <PopularFAQs limit={5} />
            </div>

            {/* 고객 만족도 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <CustomerSatisfaction />
            </div>
          </div>
        )}
      </div>

      {/* 채팅 위젯 */}
      {showChatWidget && (
        <ChatWidget onClose={() => setShowChatWidget(false)} />
      )}
    </div>
  );
};

/**
 * 연락 방법 카드 컴포넌트
 */
const ContactCard = ({ icon: Icon, title, description, action, onClick, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100'
  };

  return (
    <div
      className={`
        border rounded-lg p-6 text-center cursor-pointer transition-all duration-200 hover:shadow-md
        ${colorClasses[color]}
      `}
      onClick={onClick}
    >
      <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex items-center justify-center gap-1 text-sm font-medium">
        {action}
        <ChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

/**
 * 문의 내역 컴포넌트
 */
const InquiryHistory = () => {
  const { data: inquiriesData, isLoading } = useInquiries();
  const inquiries = inquiriesData?.data || [];

  if (isLoading) {
    return <InquiryHistorySkeleton />;
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          문의 내역이 없습니다
        </h3>
        <p className="text-gray-600 mb-6">
          궁금한 점이 있으시면 언제든 문의해주세요.
        </p>
        <Button onClick={() => window.location.href = '#inquiry'}>
          문의하기
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          문의 내역 ({inquiries.length}건)
        </h3>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <InquiryHistoryItem key={inquiry.id} inquiry={inquiry} />
        ))}
      </div>
    </div>
  );
};

/**
 * 문의 내역 아이템 컴포넌트
 */
const InquiryHistoryItem = ({ inquiry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusStyle = (status) => {
    const styles = {
      pending: { color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: '대기 중' },
      in_progress: { color: 'text-blue-600', bgColor: 'bg-blue-100', label: '처리 중' },
      completed: { color: 'text-green-600', bgColor: 'bg-green-100', label: '완료' }
    };
    return styles[status] || styles.pending;
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      low: { color: 'text-gray-500', label: '낮음' },
      medium: { color: 'text-yellow-500', label: '보통' },
      high: { color: 'text-red-500', label: '높음' }
    };
    return styles[priority] || styles.medium;
  };

  const statusStyle = getStatusStyle(inquiry.status);
  const priorityStyle = getPriorityStyle(inquiry.priority);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* 문의 헤더 */}
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-gray-900">{inquiry.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bgColor} ${statusStyle.color}`}>
                {statusStyle.label}
              </span>
              <span className={`text-xs font-medium ${priorityStyle.color}`}>
                {priorityStyle.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>문의번호: {inquiry.id}</span>
              <span>{new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</span>
              <span>답변 {inquiry.responses.length}개</span>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* 문의 상세 내용 */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-4">
            {/* 문의 내용 */}
            <div>
              <h5 className="font-medium text-gray-900 mb-2">문의 내용</h5>
              <p className="text-gray-700 whitespace-pre-wrap">{inquiry.content}</p>
            </div>

            {/* 답변 내역 */}
            {inquiry.responses.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-900 mb-3">답변 내역</h5>
                <div className="space-y-3">
                  {inquiry.responses.map((response) => (
                    <div key={response.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {response.isAdmin ? '고객센터' : '고객'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(response.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {response.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 고객 만족도 컴포넌트
 */
const CustomerSatisfaction = () => {
  const satisfactionData = {
    averageRating: 4.6,
    totalReviews: 1247,
    ratingDistribution: [
      { rating: 5, count: 856, percentage: 68.6 },
      { rating: 4, count: 249, percentage: 20.0 },
      { rating: 3, count: 87, percentage: 7.0 },
      { rating: 2, count: 31, percentage: 2.5 },
      { rating: 1, count: 24, percentage: 1.9 }
    ]
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        고객 만족도
      </h3>

      {/* 평균 평점 */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {satisfactionData.averageRating}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < Math.floor(satisfactionData.averageRating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm">
          {satisfactionData.totalReviews.toLocaleString()}개의 리뷰
        </p>
      </div>

      {/* 평점 분포 */}
      <div className="space-y-2">
        {satisfactionData.ratingDistribution.map((item) => (
          <div key={item.rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm text-gray-600">{item.rating}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 w-12 text-right">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          고객님의 소중한 의견이 더 나은 서비스를 만듭니다
        </p>
      </div>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const InquiryHistorySkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportPage;