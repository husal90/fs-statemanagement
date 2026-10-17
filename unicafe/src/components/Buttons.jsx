import { useFeedbackActions } from '../store'

const Buttons = () => {
  const actions = useFeedbackActions()

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={actions.good}>good</button>
      <button onClick={actions.neutral}>neutral</button>
      <button onClick={actions.bad}>bad</button>
    </div>
  )
}

export default Buttons
