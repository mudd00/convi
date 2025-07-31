import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { useCreateInquiry, inquiryCategories, priorityOptions } from '../../hooks/useSupport';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

/**
 * 문의 등록 폼 컴포넌트
 */
const InquiryForm = ({ onSuccess, className = '' }) => {
  const { user, isAuthenticated } = useAuthStore();
  const createInquiryMutation = useCreateInquiry();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    priority: 'medium',
    contactMethod: 'email', // email, phone, both
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  // 폼 데이터 변경 핸들러
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 초기화
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은 5MB를 초과합니다.`);
        return false;
      }
      
      // 파일 형식 제한
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name}은 지원하지 않는 파일 형식입니다.`);
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles].slice(0, 3) // 최대 3개
    }));
  };

  // 파일 제거 핸들러
  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '문의 내용을 입력해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '문의 내용을 10자 이상 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '문의 유형을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      window.location.href = '/login';
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const inquiryData = {
        ...formData,
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      };

      await createInquiryMutation.mutateAsync(inquiryData);
      
      // 성공 처리
      onSuccess?.();
      
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        category: '',
        priority: 'medium',
        contactMethod: 'email',
        attachments: []
      });

      alert('문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    } catch (error) {
      console.error('문의 등록 실패:', error);
      alert('문의 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* 로그인 안내 */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">로그인이 필요합니다</h3>
              <p className="text-yellow-700 text-sm mt-1">
                문의를 등록하려면 먼저 로그인해주세요.
              </p>
              <Button
                onClick={() => window.location.href = '/login'}
                size="sm"
                className="mt-2"
              >
                로그인하기
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 문의 유형 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            문의 유형 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.category ? 'border-red-500' : 'border-gray-300'}
            `}
            disabled={!isAuthenticated}
          >
            <option value="">문의 유형을 선택해주세요</option>
            {inquiryCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="문의 제목을 입력해주세요"
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.title ? 'border-red-500' : 'border-gray-300'}
            `}
            disabled={!isAuthenticated}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            문의 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="문의 내용을 자세히 입력해주세요"
            rows={6}
            className={`
              w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
              ${errors.content ? 'border-red-500' : 'border-gray-300'}
            `}
            disabled={!isAuthenticated}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content ? (
              <p className="text-red-500 text-sm">{errors.content}</p>
            ) : (
              <p className="text-gray-500 text-sm">최소 10자 이상 입력해주세요</p>
            )}
            <p className="text-gray-500 text-sm">
              {formData.content.length}/1000
            </p>
          </div>
        </div>

        {/* 우선순위 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            우선순위
          </label>
          <div className="flex gap-4">
            {priorityOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={formData.priority === option.value}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="mr-2"
                  disabled={!isAuthenticated}
                />
                <span className={`text-sm ${option.color}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 연락 방법 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            선호하는 연락 방법
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={formData.contactMethod === 'email'}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                className="mr-2"
                disabled={!isAuthenticated}
              />
              <Mail className="w-4 h-4 mr-1" />
              <span className="text-sm">이메일</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={formData.contactMethod === 'phone'}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                className="mr-2"
                disabled={!isAuthenticated}
              />
              <Phone className="w-4 h-4 mr-1" />
              <span className="text-sm">전화</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="both"
                checked={formData.contactMethod === 'both'}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                className="mr-2"
                disabled={!isAuthenticated}
              />
              <MessageSquare className="w-4 h-4 mr-1" />
              <span className="text-sm">둘 다</span>
            </label>
          </div>
        </div>

        {/* 파일 첨부 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 첨부 (선택사항)
          </label>
          
          {/* 드래그 앤 드롭 영역 */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              파일을 드래그하여 업로드하거나 클릭하여 선택하세요
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF, PDF, TXT 파일만 가능 (최대 5MB, 3개까지)
            </p>
            
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.txt"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              disabled={!isAuthenticated}
            />
            <label
              htmlFor="file-upload"
              className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              파일 선택
            </label>
          </div>

          {/* 첨부된 파일 목록 */}
          {formData.attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!isAuthenticated || createInquiryMutation.isLoading}
            className="flex-1"
          >
            {createInquiryMutation.isLoading ? '등록 중...' : '문의 등록'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                title: '',
                content: '',
                category: '',
                priority: 'medium',
                contactMethod: 'email',
                attachments: []
              });
              setErrors({});
            }}
            disabled={!isAuthenticated}
          >
            초기화
          </Button>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">문의 처리 안내</p>
              <ul className="space-y-1 text-xs">
                <li>• 일반 문의: 1-2 영업일 내 답변</li>
                <li>• 긴급 문의: 당일 내 답변</li>
                <li>• 답변은 등록하신 연락처로 발송됩니다</li>
                <li>• 문의 내역은 마이페이지에서 확인 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InquiryForm;