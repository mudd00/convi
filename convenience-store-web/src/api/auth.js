import apiClient, { extractData } from './client'

/**
 * 인증 관련 API 함수들
 */

/**
 * 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise} 로그인 응답
 */
export const login = async (email, password) => {
  return extractData(
    apiClient.post('/auth/login', { email, password })
  )
}

/**
 * 회원가입
 * @param {Object} userData - 사용자 정보
 * @returns {Promise} 회원가입 응답
 */
export const register = async (userData) => {
  return extractData(
    apiClient.post('/auth/register', userData)
  )
}

/**
 * 로그아웃
 * @returns {Promise} 로그아웃 응답
 */
export const logout = async () => {
  return extractData(
    apiClient.post('/auth/logout')
  )
}

/**
 * 토큰 갱신
 * @returns {Promise} 토큰 갱신 응답
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  return extractData(
    apiClient.post('/auth/refresh', { refreshToken })
  )
}

/**
 * 사용자 프로필 조회
 * @returns {Promise} 프로필 정보
 */
export const getProfile = async () => {
  return extractData(
    apiClient.get('/auth/profile')
  )
}

/**
 * 프로필 업데이트
 * @param {Object} profileData - 업데이트할 프로필 정보
 * @returns {Promise} 업데이트된 프로필 정보
 */
export const updateProfile = async (profileData) => {
  return extractData(
    apiClient.put('/auth/profile', profileData)
  )
}

/**
 * 비밀번호 변경
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise} 변경 결과
 */
export const changePassword = async (currentPassword, newPassword) => {
  return extractData(
    apiClient.put('/auth/password', { currentPassword, newPassword })
  )
}

/**
 * 비밀번호 재설정 요청
 * @param {string} email - 이메일
 * @returns {Promise} 요청 결과
 */
export const requestPasswordReset = async (email) => {
  return extractData(
    apiClient.post('/auth/password-reset', { email })
  )
}

/**
 * 비밀번호 재설정
 * @param {string} token - 재설정 토큰
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise} 재설정 결과
 */
export const resetPassword = async (token, newPassword) => {
  return extractData(
    apiClient.post('/auth/password-reset/confirm', { token, newPassword })
  )
}

/**
 * 이메일 인증
 * @param {string} token - 인증 토큰
 * @returns {Promise} 인증 결과
 */
export const verifyEmail = async (token) => {
  return extractData(
    apiClient.post('/auth/verify-email', { token })
  )
}

/**
 * 인증 이메일 재발송
 * @returns {Promise} 발송 결과
 */
export const resendVerificationEmail = async () => {
  return extractData(
    apiClient.post('/auth/resend-verification')
  )
}

/**
 * 계정 탈퇴
 * @param {string} password - 비밀번호 확인
 * @returns {Promise} 탈퇴 결과
 */
export const deleteAccount = async (password) => {
  return extractData(
    apiClient.delete('/auth/account', { data: { password } })
  )
}