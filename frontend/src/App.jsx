import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import {
  Search,
  History as HistoryIcon,
  ChefHat,
  Timer,
  Users,
  Utensils,
  ShoppingCart,
  RefreshCw,
  ArrowRight,
  X,
  Plus,
  ArrowUpRight
} from 'lucide-react'

const API_BASE = 'http://localhost:8000'

const difficultyTone = (value) => {
  const normalized = (value || '').toLowerCase()
  if (normalized.includes('easy')) return 'easy'
  if (normalized.includes('medium')) return 'medium'
  if (normalized.includes('hard')) return 'hard'
  return 'neutral'
}

function App() {
  const [activeTab, setActiveTab] = useState('extract')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory()
    }
  }, [activeTab])

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history`)
      setHistory(res.data)
    } catch (err) {
      console.error('Failed to fetch history', err)
    }
  }

  const handleExtract = async (e) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError(null)
    setCurrentRecipe(null)

    try {
      const res = await axios.post(`${API_BASE}/extract`, { url })
      setCurrentRecipe(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong while extracting the recipe.')
    } finally {
      setLoading(false)
    }
  }

  const openDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/recipes/${id}`)
      setSelectedRecipe(res.data)
    } catch (err) {
      console.error('Failed to fetch details', err)
    }
  }

  return (
    <div className="page">
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="page-inner">
        <header className="hero">
          <div className="brand">
            <div className="brand-icon">
              <ChefHat size={28} />
            </div>
            <div>
              <p className="eyebrow">Recipe Intelligence</p>
              <h1>Recipe Atlas</h1>
            </div>
          </div>
          <p className="hero-subtitle">
            Extract structured recipe data, build shopping lists, and organize your cooking history in seconds.
          </p>
          <div className="hero-chips">
            <span className="chip">AI extraction</span>
            <span className="chip">Nutrition snapshot</span>
            <span className="chip">Smart substitutions</span>
          </div>
        </header>

        <nav className="tabs">
          <button
            className={`tab-btn ${activeTab === 'extract' ? 'active' : ''}`}
            onClick={() => setActiveTab('extract')}
          >
            <Search size={18} />
            Extract Recipe
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <HistoryIcon size={18} />
            History
          </button>
        </nav>

        {activeTab === 'extract' ? (
          <div className="panel animate-fade-in">
            <form className="input-group" onSubmit={handleExtract}>
              <label className="input-shell">
                <Search size={18} className="text-muted" />
                <input
                  type="url"
                  placeholder="Paste recipe blog URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </label>
              <button className="primary" type="submit" disabled={loading}>
                {loading ? <RefreshCw className="animate-spin" /> : <Plus size={18} />}
                {loading ? 'Extracting...' : 'Extract Recipe'}
              </button>
            </form>

            {error && (
              <div className="card card--error">
                {error}
              </div>
            )}

            {loading && (
              <div className="card shimmer tall-card" />
            )}

            {currentRecipe && <RecipeDetails recipe={currentRecipe} />}
          </div>
        ) : (
          <div className="panel animate-fade-in">
            <div className="card table-card">
              {history.length === 0 ? (
                <div className="empty-state">
                  <p>No recipes saved yet.</p>
                  <span>Extract your first recipe to start building a collection.</span>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Cuisine</th>
                      <th>Difficulty</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((recipe) => (
                      <tr key={recipe.id}>
                        <td className="title-cell">{recipe.title}</td>
                        <td>{recipe.cuisine}</td>
                        <td>
                          <span className="badge" data-tone={difficultyTone(recipe.difficulty)}>
                            {recipe.difficulty}
                          </span>
                        </td>
                        <td className="muted">
                          {new Date(recipe.created_at).toLocaleDateString()}
                        </td>
                        <td className="table-action">
                          <button className="ghost" onClick={() => openDetails(recipe.id)}>
                            Details <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {selectedRecipe && (
          <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
            <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedRecipe(null)}>
                <X size={20} />
              </button>
              <div className="modal-body">
                <RecipeDetails recipe={selectedRecipe} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeDetails({ recipe }) {
  return (
    <div className="recipe-view">
      <div className="recipe-header">
        <div>
          <h2 className="recipe-title">{recipe.title}</h2>
          <div className="recipe-meta">
            <span className="meta-item">
              <Utensils size={16} /> {recipe.cuisine}
            </span>
            <span className="meta-dot">•</span>
            <span className="badge" data-tone={difficultyTone(recipe.difficulty)}>
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">
            <Timer size={14} /> Prep Time
          </div>
          <div className="stat-value">{recipe.prep_time}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">
            <Timer size={14} /> Cook Time
          </div>
          <div className="stat-value">{recipe.cook_time}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">
            <Timer size={14} /> Total Time
          </div>
          <div className="stat-value">{recipe.total_time}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">
            <Users size={14} /> Servings
          </div>
          <div className="stat-value">{recipe.servings}</div>
        </div>
      </div>

      <div className="recipe-grid">
        <div className="main-content">
          <section className="card">
            <h3>Ingredients</h3>
            <ul className="list-unstyled">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="list-item">
                  <span className="dot" />
                  <span>
                    <strong>{ing.quantity} {ing.unit}</strong> {ing.item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h3>Instructions</h3>
            <ol className="steps">
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <div className="sidebar">
          <section className="card card--tint">
            <h3>
              Nutrition <span className="muted">(per serving)</span>
            </h3>
            <div className="nutrition-grid">
              <div className="stat-item compact">
                <div className="stat-label">Calories</div>
                <div className="stat-value">{recipe.nutrition_estimate.calories}</div>
              </div>
              <div className="stat-item compact">
                <div className="stat-label">Protein</div>
                <div className="stat-value">{recipe.nutrition_estimate.protein}</div>
              </div>
              <div className="stat-item compact">
                <div className="stat-label">Carbs</div>
                <div className="stat-value">{recipe.nutrition_estimate.carbs}</div>
              </div>
              <div className="stat-item compact">
                <div className="stat-label">Fat</div>
                <div className="stat-value">{recipe.nutrition_estimate.fat}</div>
              </div>
            </div>
          </section>

          <section className="card">
            <h3 className="title-icon">
              <ShoppingCart size={18} className="text-primary" /> Shopping List
            </h3>
            {Object.entries(recipe.shopping_list).map(([category, items]) => (
              <div key={category} className="shopping-section">
                <div className="section-label">{category}</div>
                <ul className="list-unstyled">
                  {items.map((item, i) => (
                    <li key={i} className="list-tight">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="card">
            <h3>Substitutions</h3>
            <ul className="list-unstyled">
              {recipe.substitutions.map((sub, i) => (
                <li key={i} className="list-icon">
                  <RefreshCw size={14} />
                  {sub}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h3>Pairs well with</h3>
            <ul className="list-unstyled">
              {recipe.related_recipes.map((rel, i) => (
                <li key={i} className="list-icon">
                  <ArrowUpRight size={14} className="text-primary" />
                  {rel}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default App
