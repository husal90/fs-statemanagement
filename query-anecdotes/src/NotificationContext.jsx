import { createContext, useState, useRef, useCallback } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState(null)
  const timeoutId = useRef(null)

  const notify = useCallback((message, seconds = 5) => {
    clearTimeout(timeoutId.current)
    setNotification(message)
    timeoutId.current = setTimeout(() => setNotification(null), seconds * 1000)
  }, [])

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {props.children}
    </NotificationContext.Provider>
  )
}
