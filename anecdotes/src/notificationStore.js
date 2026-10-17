import { create } from 'zustand'

let timeoutId = null

const useNotificationStore = create(set => ({
  notification: null,
  actions: {
    notify: (message, seconds = 5) => {
      clearTimeout(timeoutId)
      set(() => ({ notification: message }))
      timeoutId = setTimeout(() => set(() => ({ notification: null })), seconds * 1000)
    },
  },
}))

export const useNotification = () => useNotificationStore(state => state.notification)
export const useNotificationActions = () => useNotificationStore(state => state.actions)

export default useNotificationStore
