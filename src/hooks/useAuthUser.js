import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { authErrorMessage } from '../utils/AuthErrors'

export default function useAuthUser() {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: '',
  })

  useEffect(() => {
    let active = true
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (active) setState({ user, loading: false, error: '' })
      },
      (error) => {
        if (active) {
          setState({ user: null, loading: false, error: authErrorMessage(error) })
        }
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return state
}
