/**
 * 유틸리티 함수들
 * 가격, 거리, 날짜 등의 포맷팅 함수
 */

/**
 * 가격을 한국 원화 형식으로 포맷팅
 * @param {number} price - 가격
 * @returns {string} 포맷된 가격 문자열
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '0'
  return price.toLocaleString('ko-KR')
}

/**
 * 거리를 적절한 단위로 포맷팅
 * @param {number} distance - 거리 (미터 단위)
 * @returns {string} 포맷된 거리 문자열
 */
export const formatDistance = (distance) => {
  if (typeof distance !== 'number') return '0m'
  
  if (distance < 1000) {
    return `${Math.round(distance)}m`
  } else {
    return `${(distance / 1000).toFixed(1)}km`
  }
}

/**
 * 날짜를 한국 형식으로 포맷팅
 * @param {Date|string} date - 날짜
 * @param {string} format - 포맷 타입 ('short', 'long', 'time')
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return ''
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      })
    case 'time':
      return dateObj.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    case 'long':
    default:
      return dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
  }
}

/**
 * 시간을 한국 형식으로 포맷팅
 * @param {Date|string} time - 시간
 * @returns {string} 포맷된 시간 문자열
 */
export const formatTime = (time) => {
  if (!time) return ''
  
  const timeObj = typeof time === 'string' ? new Date(time) : time
  if (isNaN(timeObj.getTime())) return ''
  
  return timeObj.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 상대적 시간을 포맷팅 (예: 2시간 전, 3일 전)
 * @param {Date|string} date - 날짜
 * @returns {string} 상대적 시간 문자열
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now - dateObj) / 1000)
  
  if (diffInSeconds < 60) {
    return '방금 전'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}분 전`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}시간 전`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}일 전`
  } else {
    return formatDate(dateObj)
  }
}

/**
 * 파일 크기를 적절한 단위로 포맷팅
 * @param {number} bytes - 바이트 크기
 * @returns {string} 포맷된 파일 크기 문자열
 */
export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number') return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 B'
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`
}

/**
 * 전화번호를 포맷팅
 * @param {string} phone - 전화번호
 * @returns {string} 포맷된 전화번호
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '')
  
  // 휴대폰 번호 (010-1234-5678)
  if (numbers.length === 11 && numbers.startsWith('010')) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
  }
  
  // 일반 전화번호 (02-1234-5678)
  if (numbers.length === 10) {
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`
  }
  
  // 지역번호가 있는 경우 (031-123-4567)
  if (numbers.length === 11 && !numbers.startsWith('010')) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`
  }
  
  return phone
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 * @param {string} text - 원본 텍스트
 * @param {number} maxLength - 최대 길이 (기본값: 50)
 * @returns {string} 잘린 텍스트
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || typeof text !== 'string') return ''
  
  if (text.length <= maxLength) return text
  
  return text.slice(0, maxLength) + '...'
}

/**
 * 숫자를 한국어 단위로 포맷팅 (예: 1,234 -> 1.2천)
 * @param {number} num - 숫자
 * @returns {string} 포맷된 숫자 문자열
 */
export const formatNumberWithUnit = (num) => {
  if (typeof num !== 'number') return '0'
  
  if (num < 1000) {
    return num.toString()
  } else if (num < 10000) {
    return `${(num / 1000).toFixed(1)}천`
  } else if (num < 100000000) {
    return `${(num / 10000).toFixed(1)}만`
  } else {
    return `${(num / 100000000).toFixed(1)}억`
  }
}