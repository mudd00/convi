import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * 사용자 인증 상태 관리 스토어
 * 로그인, 로그아웃, 회원가입 등의 인증 관련 상태와 액션을 관리
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // 상태 (State)
      user: null, // 현재 로그인한 사용자 정보
      isAuthenticated: false, // 인증 여부
      isLoading: false, // 로딩 상태
      error: null, // 에러 메시지

      // 액션 (Actions)
      
      /**
       * 로그인 처리
       * @param {Object} credentials - 로그인 정보 (email, password)
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // 실제 구현에서는 API 호출
          // const response = await authApi.login(credentials)
          
          // 임시 로그인 로직 (개발용)
          await new Promise(resolve => setTimeout(resolve, 1000)) // API 호출 시뮬레이션
          
          const mockUser = {
            id: '1',
            email: credentials.email,
            name: '홍길동',
            phone: '010-1234-5678',
            membershipTier: 'VIP',
            points: 15420,
            joinDate: '2023-01-15'
          }
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
          
          return { success: true, user: mockUser }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || '로그인에 실패했습니다.' 
          })
          return { success: false, error: error.message }
        }
      },

      /**
       * 로그아웃 처리
       */
      logout: async () => {
        set({ isLoading: true })
        
        try {
          // 실제 구현에서는 API 호출
          // await authApi.logout()
          
          // 로컬 상태 초기화
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          })
          
          return { success: true }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || '로그아웃에 실패했습니다.' 
          })
          return { success: false, error: error.message }
        }
      },

      /**
       * 회원가입 처리
       * @param {Object} userData - 회원가입 정보
       */
      register: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          // 실제 구현에서는 API 호출
          // const response = await authApi.register(userData)
          
          // 임시 회원가입 로직 (개발용)
          await new Promise(resolve => setTimeout(resolve, 1500)) // API 호출 시뮬레이션
          
          const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            membershipTier: 'BASIC',
            points: 0,
            joinDate: new Date().toISOString().split('T')[0]
          }
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
          
          return { success: true, user: newUser }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || '회원가입에 실패했습니다.' 
          })
          return { success: false, error: error.message }
        }
      },

      /**
       * 사용자 정보 업데이트
       * @param {Object} updates - 업데이트할 사용자 정보
       */
      updateUser: async (updates) => {
        const { user } = get()
        if (!user) return { success: false, error: '로그인이 필요합니다.' }
        
        set({ isLoading: true, error: null })
        
        try {
          // 실제 구현에서는 API 호출
          // const response = await authApi.updateUser(updates)
          
          // 임시 업데이트 로직 (개발용)
          await new Promise(resolve => setTimeout(resolve, 800))
          
          const updatedUser = { ...user, ...updates }
          
          set({ 
            user: updatedUser, 
            isLoading: false,
            error: null 
          })
          
          return { success: true, user: updatedUser }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || '정보 업데이트에 실패했습니다.' 
          })
          return { success: false, error: error.message }
        }
      },

      /**
       * 토큰 갱신
       */
      refreshToken: async () => {
        try {
          // 실제 구현에서는 refresh token으로 새 access token 요청
          // const response = await authApi.refreshToken()
          
          // 임시 로직 (개발용)
          const { user } = get()
          if (user) {
            return { success: true }
          }
          return { success: false, error: '인증 정보가 없습니다.' }
        } catch (error) {
          // 토큰 갱신 실패 시 로그아웃 처리
          get().logout()
          return { success: false, error: error.message }
        }
      },

      /**
       * 에러 상태 초기화
       */
      clearError: () => {
        set({ error: null })
      },

      /**
       * 사용자 권한 확인
       * @param {string} permission - 확인할 권한
       */
      hasPermission: (permission) => {
        const { user } = get()
        if (!user) return false
        
        // 권한 체크 로직 (실제 구현에서는 더 복잡할 수 있음)
        const permissions = {
          'admin': user.membershipTier === 'ADMIN',
          'vip': ['VIP', 'ADMIN'].includes(user.membershipTier),
          'basic': ['BASIC', 'VIP', 'ADMIN'].includes(user.membershipTier)
        }
        
        return permissions[permission] || false
      }
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      storage: createJSONStorage(() => localStorage),
      // 민감한 정보는 저장하지 않도록 필터링
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore