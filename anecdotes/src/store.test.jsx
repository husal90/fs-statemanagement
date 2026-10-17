import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, render, screen, act, cleanup } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'
import AnecdoteList from './components/AnecdoteList'

const anecdotes = [
  { id: '1', content: 'Low votes code', votes: 1 },
  { id: '2', content: 'Top votes code', votes: 9 },
  { id: '3', content: 'Middle votes thing', votes: 4 },
]

afterEach(cleanup)

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('initialization', () => {
  it('state is initialized with the anecdotes returned by the backend', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
    expect(useAnecdoteStore.getState().anecdotes).toEqual(anecdotes)
  })
})

describe('sorting', () => {
  it('the list component receives anecdotes sorted by votes', () => {
    useAnecdoteStore.setState({ anecdotes })

    render(<AnecdoteList />)

    const shown = screen
      .getAllByText(/votes/)
      .filter(el => !el.textContent.startsWith('has'))
      .map(el => el.textContent)
    expect(shown).toEqual(['Top votes code', 'Middle votes thing', 'Low votes code'])
  })

  it('useAnecdotes returns a sorted copy and does not mutate the state', () => {
    useAnecdoteStore.setState({ anecdotes })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map(a => a.votes)).toEqual([9, 4, 1])
    expect(useAnecdoteStore.getState().anecdotes.map(a => a.votes)).toEqual([1, 9, 4])
  })
})

describe('filtering', () => {
  it('the list component receives only anecdotes matching the filter', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'CODE' })

    render(<AnecdoteList />)

    expect(screen.getByText('Top votes code')).toBeDefined()
    expect(screen.getByText('Low votes code')).toBeDefined()
    expect(screen.queryByText('Middle votes thing')).toBeNull()
  })

  it('useAnecdotes returns filtered anecdotes, still sorted', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'code' })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map(a => a.id)).toEqual(['2', '1'])
  })
})

describe('voting', () => {
  it('voting increases the number of votes of the anecdote', async () => {
    useAnecdoteStore.setState({ anecdotes })
    anecdoteService.update.mockResolvedValue({ ...anecdotes[0], votes: 2 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.vote('1')
    })

    expect(anecdoteService.update).toHaveBeenCalledWith('1', { ...anecdotes[0], votes: 2 })
    const state = useAnecdoteStore.getState().anecdotes
    expect(state.find(a => a.id === '1').votes).toBe(2)
    expect(state.find(a => a.id === '2').votes).toBe(9)
  })
})
