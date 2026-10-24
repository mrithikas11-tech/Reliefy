import { useState } from 'react'
import { analyze } from './services/api.js'

export default function App() {
  const [meals, setMeals] = useState(200)
  const [budget, setBudget] = useState(2000)
  const [deadline, setDeadline] = useState('18:00')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await analyze({
        meals_needed: Number(meals),
        budget: Number(budget),
        deadline,
        restaurant_messages: [
          'Restaurant A offers 80 meals for $640, ready at 4 PM',
          'Restaurant B offers 120 meals for $960, ready at 5 PM',
          'Restaurant C offers 60 meals for $600, ready at 7 PM',
        ],
      })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Could not connect to the API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">DISASTER RELIEF • FOOD PROCUREMENT</p>
        <h1>Reliefy<span>.</span></h1>
        <p>From local kitchens to disaster shelters — faster.</p>
      </header>

      <section className="panel">
        <h2>Shelter needs</h2>
        <form onSubmit={handleSubmit} className="needs-form">
          <label>Meals needed<input type="number" min="1" value={meals} onChange={e => setMeals(e.target.value)} required /></label>
          <label>Budget ($)<input type="number" min="0" step="0.01" value={budget} onChange={e => setBudget(e.target.value)} required /></label>
          <label>Deadline<input type="time" value={deadline} onChange={e => setDeadline(e.target.value)} required /></label>
          <button disabled={loading}>{loading ? 'Analyzing…' : 'Find best offers'}</button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}
      {result && <section className="panel results">
        <div className="results-heading"><h2>Recommended coverage</h2><span className="status">{result.status}</span></div>
        <div className="metrics">
          <div><span>Meals covered</span><strong>{result.meals_covered} / {result.meals_needed}</strong></div>
          <div><span>Total cost</span><strong>${Number(result.total_cost).toLocaleString()}</strong></div>
          <div><span>Shortfall</span><strong>{result.shortfall} meals</strong></div>
        </div>
        <h3>Selected offers</h3>
        <ul>{result.selected_offers?.map(offer => <li key={offer.restaurant}><strong>{offer.restaurant}</strong> — {offer.meals} meals · ${offer.total_cost} · ready {offer.ready_time}</li>)}</ul>
        <p className="note">{result.note}</p>
      </section>}
      <footer>Prototype only · Simulated offers · Human verification required</footer>
    </main>
  )
}
