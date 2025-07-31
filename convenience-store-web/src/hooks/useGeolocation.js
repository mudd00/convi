import { useState, useEffect } from 'react'

/**
 * 지리적 위치 정보를 가져오는 훅
 * GPS를 통해 사용자의 현재 위치를 획득
 */
export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5분
    ...options
  }

  // 위치 정보 가져오기
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'))
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        })
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.'
            break
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.'
            break
        }
        
        setError(new Error(errorMessage))
        setIsLoading(false)
      },
      defaultOptions
    )
  }

  // 위치 감시 시작
  const watchPosition = () => {
    if (!navigator.geolocation) {
      setError(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'))
      return null
    }

    setIsLoading(true)
    setError(null)

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        })
        setIsLoading(false)
      },
      (error) => {
        let errorMessage = '위치 정보를 가져올 수 없습니다.'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 접근 권한이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.'
            break
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다.'
            break
        }
        
        setError(new Error(errorMessage))
        setIsLoading(false)
      },
      defaultOptions
    )

    return watchId
  }

  // 위치 감시 중지
  const clearWatch = (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // 지구의 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c * 1000 // 미터 단위로 변환

    return Math.round(distance)
  }

  // 컴포넌트 마운트 시 자동으로 위치 가져오기 (옵션)
  useEffect(() => {
    if (options.autoFetch) {
      getCurrentPosition()
    }
  }, [])

  return {
    location,
    error,
    isLoading,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    calculateDistance
  }
}

export default useGeolocation