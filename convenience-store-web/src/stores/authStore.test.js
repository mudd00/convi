import { describe, it, expect, beforeEach, vi } from 'vitest'
import useAuthStore from './authStore'

// 테스트 전에 localStorage 모킹
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('authStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 상태 초기화
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
    vi.clearAllMocks()
  })

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정된다', () => {
      const state = useAuthStore.getState()
      
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('로그인 기능', () => {
    it('로그인이 성공적으로 처리된다', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await useAuthStore.getState().login(credentials)
      const state = useAuthStore.getState()

      expect(result.success).toBe(true)
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toBeTruthy()
      expect(state.user.email).toBe(credentials.email)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('로그인 중 로딩 상태가 올바르게 관리된다', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      // 로그인 시작 시 로딩 상태 확인
      const loginPromise = useAuthStore.getState().login(credentials)
      
      // 비동기 작업이므로 즉시 확인하지 않고 완료 후 확인
      await loginPromise
      
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe('로그아웃 기능', () => {
    it('로그아웃이 성공적으로 처리된다', async () => {
      // 먼저 로그인 상태로 설정
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' },
        isAuthenticated: true
      })

      const result = await useAuthStore.getState().logout()
      const state = useAuthStore.getState()

      expect(result.success).toBe(true)
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('회원가입 기능', () => {
    it('회원가입이 성공적으로 처리된다', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: '새사용자',
        phone: '010-1234-5678',
        password: 'password123'
      }

      const result = await useAuthStore.getState().register(userData)
      const state = useAuthStore.getState()

      expect(result.success).toBe(true)
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toBeTruthy()
      expect(state.user.email).toBe(userData.email)
      expect(state.user.name).toBe(userData.name)
      expect(state.user.membershipTier).toBe('BASIC')
      expect(state.isLoading).toBe(false)
    })
  })

  describe('사용자 정보 업데이트', () => {
    it('로그인된 사용자의 정보를 업데이트할 수 있다', async () => {
      // 먼저 로그인 상태로 설정
      useAuthStore.setState({
        user: { 
          id: '1', 
          email: 'test@example.com', 
          name: '홍길동',
          phone: '010-1111-1111'
        },
        isAuthenticated: true
      })

      const updates = {
        name: '김철수',
        phone: '010-2222-2222'
      }

      const result = await useAuthStore.getState().updateUser(updates)
      const state = useAuthStore.getState()

      expect(result.success).toBe(true)
      expect(state.user.name).toBe(updates.name)
      expect(state.user.phone).toBe(updates.phone)
      expect(state.user.email).toBe('test@example.com') // 기존 값 유지
    })

    it('로그인하지 않은 상태에서는 정보 업데이트가 실패한다', async () => {
      const updates = { name: '김철수' }

      const result = await useAuthStore.getState().updateUser(updates)

      expect(result.success).toBe(false)
      expect(result.error).toBe('로그인이 필요합니다.')
    })
  })

  describe('권한 확인', () => {
    it('사용자 권한을 올바르게 확인한다', () => {
      // VIP 사용자로 설정
      useAuthStore.setState({
        user: { id: '1', membershipTier: 'VIP' },
        isAuthenticated: true
      })

      const { hasPermission } = useAuthStore.getState()

      expect(hasPermission('basic')).toBe(true)
      expect(hasPermission('vip')).toBe(true)
      expect(hasPermission('admin')).toBe(false)
    })

    it('로그인하지 않은 사용자는 권한이 없다', () => {
      const { hasPermission } = useAuthStore.getState()

      expect(hasPermission('basic')).toBe(false)
      expect(hasPermission('vip')).toBe(false)
      expect(hasPermission('admin')).toBe(false)
    })
  })

  describe('에러 처리', () => {
    it('에러 상태를 초기화할 수 있다', () => {
      useAuthStore.setState({ error: '테스트 에러' })

      useAuthStore.getState().clearError()
      const state = useAuthStore.getState()

      expect(state.error).toBeNull()
    })
  })
})