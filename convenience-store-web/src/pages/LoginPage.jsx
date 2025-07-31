import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card } from '@/components/ui'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

/**
 * 로그인/회원가입 페이지
 */
const LoginPage = () => {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const navigate = useNavigate()
  const location = useLocation()

  // 로그인 후 리다이렉트할 경로
  const from = location.state?.from?.pathname || '/'

  // 로그인/회원가입 성공 핸들러
  const handleAuthSuccess = () => {
    navigate(from, { replace: true })
  }

  // 모드 전환 핸들러
  const handleSwitchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? '편의점 서비스를 이용하려면 로그인하세요' 
              : '편의점 서비스에 가입하여 다양한 혜택을 받으세요'
            }
          </p>
        </div>

        {/* 폼 카드 */}
        <Card className="p-8">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={handleSwitchMode}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={handleSwitchMode}
            />
          )}
        </Card>

        {/* 소셜 로그인 (향후 구현) */}
        {mode === 'login' && (
          <Card className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">또는</p>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <span className="mr-2">🟡</span>
                  카카오로 로그인
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <span className="mr-2">🟢</span>
                  네이버로 로그인
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* 고객센터 링크 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            문제가 있으신가요?{' '}
            <button className="text-primary hover:text-primary-dark">
              고객센터
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage