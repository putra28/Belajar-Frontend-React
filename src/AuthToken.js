import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthToken = ({ children }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const webToken = sessionStorage.getItem('webtoken')

    // Jika tidak ada webToken, arahkan ke halaman login
    if (!webToken) {
      navigate('/login')
    }
  }, [navigate])

  return children
}

export default AuthToken
