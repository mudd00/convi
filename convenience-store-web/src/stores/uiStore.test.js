import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import useUIStore from './uiStore'

// 테스트 전에 localStorage와 DOM 모킹
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// document와 navigator 모킹
Object.defineProperty(global, 'navigator', {
  value: { onLine: true },
  writable: true
})

Object.defineProperty(global, 'document', {
  value: {
    documentElement: {
      classList: {
        add: vi.fn(),
        remove: vi.fn()
      },
      lang: 'ko'
    }
  },
  writable: true
})

describe('uiStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 상태 초기화
    useUIStore.setState({
      isLoading: false,
      loadingMessage: '',
      notifications: [],
      modals: {},
      theme: 'light',
      language: 'ko',
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      searchHistory: [],
      isOnline: true
    })
    vi.clearAllMocks()
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('초기 상태', () => {
    it('초기 상태가 올바르게 설정된다', () => {
      const state = useUIStore.getState()
      
      expect(state.isLoading).toBe(false)
      expect(state.loadingMessage).toBe('')
      expect(state.notifications).toEqual([])
      expect(state.modals).toEqual({})
      expect(state.theme).toBe('light')
      expect(state.language).toBe('ko')
      expect(state.isSidebarOpen).toBe(false)
      expect(state.isMobileMenuOpen).toBe(false)
      expect(state.searchHistory).toEqual([])
    })
  })

  describe('로딩 상태 관리', () => {
    it('로딩 상태를 설정할 수 있다', () => {
      const { setLoading } = useUIStore.getState()
      
      setLoading(true, '데이터를 불러오는 중...')
      const state = useUIStore.getState()

      expect(state.isLoading).toBe(true)
      expect(state.loadingMessage).toBe('데이터를 불러오는 중...')
    })
  })

  describe('알림 관리', () => {
    it('알림을 추가할 수 있다', () => {
      const { addNotification } = useUIStore.getState()
      
      const notificationId = addNotification({
        type: 'success',
        title: '성공',
        message: '작업이 완료되었습니다.'
      })
      
      const state = useUIStore.getState()

      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].id).toBe(notificationId)
      expect(state.notifications[0].type).toBe('success')
      expect(state.notifications[0].title).toBe('성공')
      expect(state.notifications[0].message).toBe('작업이 완료되었습니다.')
    })

    it('알림을 제거할 수 있다', () => {
      const { addNotification, removeNotification } = useUIStore.getState()
      
      const notificationId = addNotification({
        message: '테스트 알림',
        duration: 0 // 자동 제거 방지
      })
      
      removeNotification(notificationId)
      const state = useUIStore.getState()

      expect(state.notifications).toHaveLength(0)
    })

    it('알림이 자동으로 제거된다', () => {
      const { addNotification } = useUIStore.getState()
      
      addNotification({
        message: '자동 제거 테스트',
        duration: 1000 // 1초 후 제거
      })
      
      let state = useUIStore.getState()
      expect(state.notifications).toHaveLength(1)
      
      // 1초 후
      vi.advanceTimersByTime(1000)
      
      state = useUIStore.getState()
      expect(state.notifications).toHaveLength(0)
    })

    it('성공 알림을 표시할 수 있다', () => {
      const { showSuccess } = useUIStore.getState()
      
      showSuccess('성공했습니다!')
      const state = useUIStore.getState()

      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].type).toBe('success')
      expect(state.notifications[0].title).toBe('성공')
      expect(state.notifications[0].message).toBe('성공했습니다!')
    })

    it('에러 알림을 표시할 수 있다', () => {
      const { showError } = useUIStore.getState()
      
      showError('오류가 발생했습니다!')
      const state = useUIStore.getState()

      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].type).toBe('error')
      expect(state.notifications[0].title).toBe('오류')
      expect(state.notifications[0].message).toBe('오류가 발생했습니다!')
    })
  })

  describe('모달 관리', () => {
    it('모달을 열 수 있다', () => {
      const { openModal } = useUIStore.getState()
      
      openModal('testModal', { title: '테스트 모달' })
      const state = useUIStore.getState()

      expect(state.modals.testModal).toBeDefined()
      expect(state.modals.testModal.isOpen).toBe(true)
      expect(state.modals.testModal.props.title).toBe('테스트 모달')
    })

    it('모달을 닫을 수 있다', () => {
      const { openModal, closeModal } = useUIStore.getState()
      
      openModal('testModal')
      closeModal('testModal')
      const state = useUIStore.getState()

      expect(state.modals.testModal).toBeUndefined()
    })

    it('모달 상태를 확인할 수 있다', () => {
      const { openModal, isModalOpen } = useUIStore.getState()
      
      expect(isModalOpen('testModal')).toBe(false)
      
      openModal('testModal')
      expect(isModalOpen('testModal')).toBe(true)
    })

    it('모든 모달을 닫을 수 있다', () => {
      const { openModal, closeAllModals } = useUIStore.getState()
      
      openModal('modal1')
      openModal('modal2')
      
      closeAllModals()
      const state = useUIStore.getState()

      expect(Object.keys(state.modals)).toHaveLength(0)
    })
  })

  describe('테마 관리', () => {
    it('테마를 변경할 수 있다', () => {
      const { setTheme } = useUIStore.getState()
      
      setTheme('dark')
      const state = useUIStore.getState()

      expect(state.theme).toBe('dark')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark')
    })

    it('테마를 토글할 수 있다', () => {
      const { toggleTheme } = useUIStore.getState()
      
      // light -> dark
      toggleTheme()
      let state = useUIStore.getState()
      expect(state.theme).toBe('dark')
      
      // dark -> light
      toggleTheme()
      state = useUIStore.getState()
      expect(state.theme).toBe('light')
    })
  })

  describe('언어 관리', () => {
    it('언어를 변경할 수 있다', () => {
      const { setLanguage } = useUIStore.getState()
      
      setLanguage('en')
      const state = useUIStore.getState()

      expect(state.language).toBe('en')
      expect(document.documentElement.lang).toBe('en')
    })
  })

  describe('UI 상태 토글', () => {
    it('사이드바를 토글할 수 있다', () => {
      const { toggleSidebar } = useUIStore.getState()
      
      toggleSidebar()
      let state = useUIStore.getState()
      expect(state.isSidebarOpen).toBe(true)
      
      toggleSidebar()
      state = useUIStore.getState()
      expect(state.isSidebarOpen).toBe(false)
    })

    it('모바일 메뉴를 토글할 수 있다', () => {
      const { toggleMobileMenu } = useUIStore.getState()
      
      toggleMobileMenu()
      let state = useUIStore.getState()
      expect(state.isMobileMenuOpen).toBe(true)
      
      toggleMobileMenu()
      state = useUIStore.getState()
      expect(state.isMobileMenuOpen).toBe(false)
    })
  })

  describe('검색 히스토리', () => {
    it('검색어를 히스토리에 추가할 수 있다', () => {
      const { addSearchHistory } = useUIStore.getState()
      
      addSearchHistory('삼각김밥')
      addSearchHistory('음료수')
      
      const state = useUIStore.getState()
      expect(state.searchHistory).toEqual(['음료수', '삼각김밥'])
    })

    it('중복된 검색어는 맨 앞으로 이동한다', () => {
      const { addSearchHistory } = useUIStore.getState()
      
      addSearchHistory('삼각김밥')
      addSearchHistory('음료수')
      addSearchHistory('삼각김밥') // 중복
      
      const state = useUIStore.getState()
      expect(state.searchHistory).toEqual(['삼각김밥', '음료수'])
    })

    it('검색 히스토리에서 특정 항목을 제거할 수 있다', () => {
      const { addSearchHistory, removeSearchHistory } = useUIStore.getState()
      
      addSearchHistory('삼각김밥')
      addSearchHistory('음료수')
      removeSearchHistory('삼각김밥')
      
      const state = useUIStore.getState()
      expect(state.searchHistory).toEqual(['음료수'])
    })

    it('검색 히스토리를 전체 삭제할 수 있다', () => {
      const { addSearchHistory, clearSearchHistory } = useUIStore.getState()
      
      addSearchHistory('삼각김밥')
      addSearchHistory('음료수')
      clearSearchHistory()
      
      const state = useUIStore.getState()
      expect(state.searchHistory).toEqual([])
    })

    it('빈 검색어는 히스토리에 추가되지 않는다', () => {
      const { addSearchHistory } = useUIStore.getState()
      
      addSearchHistory('')
      addSearchHistory('   ')
      
      const state = useUIStore.getState()
      expect(state.searchHistory).toEqual([])
    })
  })

  describe('온라인 상태', () => {
    it('온라인 상태를 업데이트할 수 있다', () => {
      const { setOnlineStatus } = useUIStore.getState()
      
      setOnlineStatus(false)
      const state = useUIStore.getState()

      expect(state.isOnline).toBe(false)
      expect(state.notifications).toHaveLength(1) // 오프라인 알림
      expect(state.notifications[0].type).toBe('warning')
    })
  })

  describe('상태 초기화', () => {
    it('UI 상태를 초기화할 수 있다', () => {
      const { 
        setLoading, 
        addNotification, 
        openModal, 
        toggleSidebar, 
        reset 
      } = useUIStore.getState()
      
      // 상태 변경
      setLoading(true, '로딩 중')
      addNotification({ message: '테스트', duration: 0 })
      openModal('testModal')
      toggleSidebar()
      
      // 초기화
      reset()
      const state = useUIStore.getState()

      expect(state.isLoading).toBe(false)
      expect(state.loadingMessage).toBe('')
      expect(state.notifications).toEqual([])
      expect(state.modals).toEqual({})
      expect(state.isSidebarOpen).toBe(false)
      expect(state.isMobileMenuOpen).toBe(false)
    })
  })
})