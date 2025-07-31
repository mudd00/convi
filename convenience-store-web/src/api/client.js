import axios from 'axios'
import { API_BASE_URL } from '@/utils/constants'

/**
 * Axios 인스턴스 생성 및 설정
 * 인터셉터를 통한 요청/응답 처리, 에러 핸들링
 */

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 인증 토큰 추가
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 요청 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }

    return config
  },
  (error) => {
    console.error('❌ API 요청 에러:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 로깅 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log(`✅ API 응답: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 에러 처리 (토큰 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // 토큰 갱신 시도
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })

          const { accessToken } = response.data
          localStorage.setItem('auth_token', accessToken)

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        
        // 로그인 페이지로 리다이렉트 (실제 구현에서는 라우터 사용)
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    // 에러 로깅
    console.error('❌ API 응답 에러:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method
    })

    // 에러 메시지 정규화
    const errorMessage = getErrorMessage(error)
    const normalizedError = {
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    }

    return Promise.reject(normalizedError)
  }
)

/**
 * 에러 메시지 추출 및 정규화
 * @param {Error} error - 에러 객체
 * @returns {string} 정규화된 에러 메시지
 */
const getErrorMessage = (error) => {
  // 서버에서 반환한 에러 메시지
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  // HTTP 상태 코드별 기본 메시지
  const statusMessages = {
    400: '잘못된 요청입니다.',
    401: '인증이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 리소스를 찾을 수 없습니다.',
    409: '이미 존재하는 데이터입니다.',
    422: '입력 데이터가 올바르지 않습니다.',
    429: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.',
    500: '서버 내부 오류가 발생했습니다.',
    502: '서버 연결에 문제가 있습니다.',
    503: '서비스를 일시적으로 사용할 수 없습니다.',
    504: '서버 응답 시간이 초과되었습니다.'
  }

  if (error.response?.status && statusMessages[error.response.status]) {
    return statusMessages[error.response.status]
  }

  // 네트워크 에러
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return '네트워크 연결을 확인해주세요.'
  }

  // 타임아웃 에러
  if (error.code === 'ECONNABORTED') {
    return '요청 시간이 초과되었습니다.'
  }

  // 기본 에러 메시지
  return error.message || '알 수 없는 오류가 발생했습니다.'
}

/**
 * API 응답 데이터 추출 헬퍼
 * @param {Promise} apiCall - API 호출 Promise
 * @returns {Promise} 응답 데이터
 */
export const extractData = async (apiCall) => {
  try {
    const response = await apiCall
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * 파일 업로드를 위한 FormData 생성 헬퍼
 * @param {Object} data - 업로드할 데이터
 * @param {File[]} files - 업로드할 파일들
 * @returns {FormData} FormData 객체
 */
export const createFormData = (data = {}, files = []) => {
  const formData = new FormData()

  // 일반 데이터 추가
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key])
    }
  })

  // 파일 추가
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })

  return formData
}

/**
 * 쿼리 파라미터 생성 헬퍼
 * @param {Object} params - 쿼리 파라미터 객체
 * @returns {URLSearchParams} URLSearchParams 객체
 */
export const createQueryParams = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.keys(params).forEach(key => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item))
      } else {
        searchParams.append(key, value)
      }
    }
  })

  return searchParams
}

/**
 * API 클라이언트 인스턴스 export
 */
export default apiClient