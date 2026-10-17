import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

export const useNotification = () => useContext(NotificationContext).notification

const useNotify = () => useContext(NotificationContext).notify

export default useNotify
