import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ThumbsUp, ThumbsDown, Eye, Tag } from 'lucide-react';
import { useFAQs, faqCategories } from '../../hooks/useSupport';
import { Button } from '../ui/Button';

/**
 * FAQ 섹션 컴포넌트
 */
const FAQSection = ({ className = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());

  // FAQ 데이터 조회
  const { data: faqData, isLoading } = useFAQs(selectedCategory === 'all' ? null : selectedCategory);
  const faqs = faqData?.data || [];

  // 검색 필터링
  const filteredFAQs = faqs.filter(faq => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // FAQ 항목 확장/축소
  const toggleExpanded = (faqId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId);
    } else {
      newExpanded.add(faqId);
    }
    setExpandedItems(newExpanded);
  };

  // 도움됨 투표
  const handleHelpfulVote = (faqId, isHelpful) => {
    // 실제 구현에서는 API 호출
    console.log(`FAQ ${faqId}에 ${isHelpful ? '도움됨' : '도움안됨'} 투표`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 검색 및 필터 */}
      <div className="space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FAQ를 검색하세요..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          {faqCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedCategory === category.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ 목록 */}
      {isLoading ? (
        <FAQSkeleton />
      ) : filteredFAQs.length > 0 ? (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isExpanded={expandedItems.has(faq.id)}
              onToggle={() => toggleExpanded(faq.id)}
              onHelpfulVote={(isHelpful) => handleHelpfulVote(faq.id, isHelpful)}
            />
          ))}
        </div>
      ) : (
        <EmptyFAQs searchQuery={searchQuery} category={selectedCategory} />
      )}

      {/* 추가 도움말 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-blue-900 mb-2">
          원하는 답변을 찾지 못하셨나요?
        </h3>
        <p className="text-blue-700 text-sm mb-4">
          고객센터로 직접 문의하시면 더 자세한 도움을 받으실 수 있습니다.
        </p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={() => window.location.href = '/support'}
            size="sm"
          >
            문의하기
          </Button>
          <Button
            onClick={() => window.location.href = 'tel:1588-0000'}
            variant="outline"
            size="sm"
          >
            전화 상담
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * 개별 FAQ 아이템 컴포넌트
 */
const FAQItem = ({ faq, isExpanded, onToggle, onHelpfulVote }) => {
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (isHelpful) => {
    if (hasVoted) return;
    onHelpfulVote(isHelpful);
    setHasVoted(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 질문 */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              {faq.question}
            </h3>
            
            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{faq.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{faq.helpful}</span>
              </div>
              {faq.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span>{faq.tags.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-4">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {/* 답변 */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-4">
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {faq.answer}
            </div>

            {/* 태그 */}
            {faq.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {faq.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 도움됨 투표 */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                이 답변이 도움이 되셨나요?
              </p>
              
              <div className="flex items-center gap-2">
                {hasVoted ? (
                  <span className="text-sm text-green-600 font-medium">
                    투표해주셔서 감사합니다!
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => handleVote(true)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      도움됨
                    </button>
                    <button
                      onClick={() => handleVote(false)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      도움안됨
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 인기 FAQ 컴포넌트
 */
export const PopularFAQs = ({ limit = 5, className = '' }) => {
  const { data: faqData, isLoading } = useFAQs();
  
  // 조회수 기준으로 정렬하여 인기 FAQ 추출
  const popularFAQs = (faqData?.data || [])
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);

  if (isLoading) {
    return <FAQSkeleton count={limit} />;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        자주 묻는 질문
      </h3>
      
      <div className="space-y-3">
        {popularFAQs.map((faq) => (
          <div
            key={faq.id}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => window.location.href = `/support/faq#${faq.id}`}
          >
            <h4 className="font-medium text-gray-900 mb-2">
              {faq.question}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{faq.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{faq.helpful}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => window.location.href = '/support/faq'}
          variant="outline"
          size="sm"
        >
          전체 FAQ 보기
        </Button>
      </div>
    </div>
  );
};

/**
 * 로딩 스켈레톤
 */
const FAQSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 빈 상태 컴포넌트
 */
const EmptyFAQs = ({ searchQuery, category }) => {
  const getMessage = () => {
    if (searchQuery) {
      return {
        title: '검색 결과가 없습니다',
        description: `"${searchQuery}"에 대한 FAQ를 찾을 수 없습니다.`,
        suggestion: '다른 키워드로 검색해보시거나 고객센터로 문의해주세요.'
      };
    }

    if (category !== 'all') {
      const categoryInfo = faqCategories.find(cat => cat.value === category);
      return {
        title: 'FAQ가 없습니다',
        description: `${categoryInfo?.label} 카테고리에 등록된 FAQ가 없습니다.`,
        suggestion: '다른 카테고리를 선택하시거나 고객센터로 문의해주세요.'
      };
    }

    return {
      title: 'FAQ를 불러올 수 없습니다',
      description: '일시적인 오류가 발생했습니다.',
      suggestion: '페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'
    };
  };

  const message = getMessage();

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message.title}
      </h3>
      <p className="text-gray-600 mb-2">
        {message.description}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {message.suggestion}
      </p>
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => window.location.href = '/support'}
          size="sm"
        >
          문의하기
        </Button>
        {searchQuery && (
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            새로고침
          </Button>
        )}
      </div>
    </div>
  );
};

export default FAQSection;