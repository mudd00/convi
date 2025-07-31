import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as authApi from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'

/**
 * 로그인 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useLogin = () => {
  const queryClient = useQueryClient()
  const { setUser, setAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: ({ email, password }) => authApi.login(email, password),
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem('auth_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      
      // 상태 업데이트
      setUser(data.user)
      setAuthenticated(true)
      
      // 사용자 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      console.log('✅ 로그인 성공:', data.user.email)
    },
    onError: (error) => {
      console.error('❌ 로그인 실패:', error.message)
      // 실패 시 토큰 제거
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
    }
  })
}

/**
 * 회원가입 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useRegister = () => {
  const queryClient = useQueryClient()
  const { setUser, setAuthenticated } = useAuthStore()

  return useMutation({
    mutationFn: (userData) => authApi.register(userData),
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem('auth_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      
      // 상태 업데이트
      setUser(data.user)
      setAuthenticated(true)
      
      // 사용자 관련 쿼리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      console.log('✅ 회원가입 성공:', data.user.email)
    },
    onError: (error) => {
      console.error('❌ 회원가입 실패:', error.message)
    }
  })
}

/**
 * 로그아웃 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  const { clearUser } = useAuthStore()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 토큰 제거
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      
      // 상태 초기화
      clearUser()
      
      // 모든 쿼리 캐시 초기화
      queryClient.clear()
      
      console.log('✅ 로그아웃 완료')
    },
    onError: (error) => {
      console.error('❌ 로그아웃 실패:', error.message)
      
      // 에러가 발생해도 로컬 상태는 초기화
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      clearUser()
      queryClient.clear()
    }
  })
}

/**
 * 토큰 갱신 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useRefreshToken = () => {
  const { setUser, setAuthenticated, clearUser } = useAuthStore()

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      // 새 토큰 저장
      localStorage.setItem('auth_token', data.accessToken)
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken)
      }
      
      // 사용자 정보 업데이트
      if (data.user) {
        setUser(data.user)
        setAuthenticated(true)
      }
      
      console.log('✅ 토큰 갱신 성공')
    },
    onError: (error) => {
      console.error('❌ 토큰 갱신 실패:', error.message)
      
      // 토큰 갱신 실패 시 로그아웃 처리
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      clearUser()
    }
  })
}

/**
 * 사용자 프로필 조회 훅
 * @param {Object} options - React Query 옵션
 * @returns {Object} 쿼리 결과
 */
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    retry: (failureCount, error) => {
      // 401 에러는 재시도하지 않음 (인증 실패)
      if (error.status === 401) return false
      return failureCount < 3
    },
    ...options
  })
}

/**
 * 프로필 업데이트 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (profileData) => authApi.updateProfile(profileData),
    onSuccess: (data) => {
      // 상태 업데이트
      setUser(data.user)
      
      // 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      console.log('✅ 프로필 업데이트 성공')
    },
    onError: (error) => {
      console.error('❌ 프로필 업데이트 실패:', error.message)
    }
  })
}

/**
 * 비밀번호 변경 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) => 
      authApi.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      console.log('✅ 비밀번호 변경 성공')
    },
    onError: (error) => {
      console.error('❌ 비밀번호 변경 실패:', error.message)
    }
  })
}

/**
 * 비밀번호 재설정 요청 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      console.log('✅ 비밀번호 재설정 이메일 발송 완료')
    },
    onError: (error) => {
      console.error('❌ 비밀번호 재설정 요청 실패:', error.message)
    }
  })
}

/**
 * 비밀번호 재설정 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }) => 
      authApi.resetPassword(token, newPassword),
    onSuccess: () => {
      console.log('✅ 비밀번호 재설정 완료')
    },
    onError: (error) => {
      console.error('❌ 비밀번호 재설정 실패:', error.message)
    }
  })
}

/**
 * 이메일 인증 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useVerifyEmail = () => {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (token) => authApi.verifyEmail(token),
    onSuccess: (data) => {
      // 사용자 정보 업데이트
      setUser(data.user)
      
      // 프로필 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      
      console.log('✅ 이메일 인증 완료')
    },
    onError: (error) => {
      console.error('❌ 이메일 인증 실패:', error.message)
    }
  })
}

/**
 * 이메일 인증 재발송 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: authApi.resendVerificationEmail,
    onSuccess: () => {
      console.log('✅ 인증 이메일 재발송 완료')
    },
    onError: (error) => {
      console.error('❌ 인증 이메일 재발송 실패:', error.message)
    }
  })
}

/**
 * 계정 탈퇴 뮤테이션 훅
 * @returns {Object} 뮤테이션 결과
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  const { clearUser } = useAuthStore()

  return useMutation({
    mutationFn: (password) => authApi.deleteAccount(password),
    onSuccess: () => {
      // 토큰 제거
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      
      // 상태 초기화
      clearUser()
      
      // 모든 쿼리 캐시 초기화
      queryClient.clear()
      
      console.log('✅ 계정 탈퇴 완료')
    },
    onError: (error) => {
      console.error('❌ 계정 탈퇴 실패:', error.message)
    }
  })
}