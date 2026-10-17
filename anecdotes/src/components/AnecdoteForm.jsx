import { useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { notify } = useNotificationActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.reset()
    await add(content)
    notify(`you created '${content}'`)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
