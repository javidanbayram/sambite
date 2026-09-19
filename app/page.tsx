'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

/* -------------------------------------------------------
   Suggested ingredient chips for quick demo
------------------------------------------------------- */
const EXAMPLE_COMBOS = [
  'yumurta, pendir, bayat çörək, pomidor',
  'qalan toyuq, brokoli, sarımsaq, qaymaq',
  'makaron, konservləşdirilmiş tuna, zeytun, kapers, limon',
  'şirin kartof, qara lobya, avokado, laym',
]

/* -------------------------------------------------------
   Common pantry / household staples
------------------------------------------------------- */
const PANTRY_STAPLES = [
  { id: 'duz',       label: '🧂 Duz' },
  { id: 'yag',       label: '🫒 Yağ' },
  { id: 'kere-yag',  label: '🧈 Kərə yağı' },
  { id: 'istiot',    label: '🌶️ Qara istiot' },
  { id: 'sirkə',     label: '🥗 Sirkə' },
  { id: 'sarımsaq',  label: '🧄 Sarımsaq' },
  { id: 'soğan',     label: '🧅 Soğan' },
  { id: 'un',        label: '🌾 Un' },
  { id: 'yumurta',   label: '🥚 Yumurta' },
  { id: 'süd',       label: '🥛 Süd' },
  { id: 'şəkər',     label: '🍬 Şəkər' },
  { id: 'tomat-s',   label: '🍅 Tomat sousu' },
  { id: 'tomat-x',   label: '🥫 Tomat pastəsi' },
  { id: 'limon',     label: '🍋 Limon' },
  { id: 'soya-sous', label: '🌶 Soya sousu' },
  { id: 'bal',       label: '🍯 Bal' },
  { id: 'xardal',   label: '🌿 Xardal' },
]

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
function parseRecipe(text: string) {
  // Render the raw text with basic markdown-like parsing for bold
  return text
}

/* -------------------------------------------------------
   SVG Icons (inline, no external dep)
------------------------------------------------------- */
function IconForkLeaf() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.5 2 5 5 5 9c0 2.5 1.5 4.5 3.5 5.5L8 22h8l-.5-7.5C17.5 13.5 19 11.5 19 9c0-4-3.5-7-7-7z" fill="url(#g1)" />
      <path d="M9 2v5M12 2v5M15 2v5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
      <defs>
        <linearGradient id="g1" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function IconChef() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="5" stroke="#fff" strokeWidth="1.5" />
      <path d="M7 8H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-3" stroke="#fff" strokeWidth="1.5" />
      <path d="M5 13v7h14v-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* -------------------------------------------------------
   Recipe Renderer – renders the Gemini output nicely
------------------------------------------------------- */
function RecipeRenderer({ text }: { text: string }) {
  const [showSteps, setShowSteps] = useState(false)
  
  useEffect(() => {
    setShowSteps(false)
  }, [text])

  const lines = text.split('\n')
  
  // Find where the steps start
  const stepsIndex = lines.findIndex(line => line.includes('Addım-addım Təlimatlar'))
  const hasSteps = stepsIndex !== -1
  
  const visibleLines = (showSteps || !hasSteps) ? lines : lines.slice(0, stepsIndex)

  const renderLine = (line: string, i: number) => {
    // Bold section headers (lines starting with ** or numbers like "1." "2." "3.")
    const isSectionNum = /^\d+\.\s/.test(line.trim())
    const isBold = line.startsWith('**') && line.endsWith('**')
    const isHeader = line.startsWith('#')
    const isEmpty = line.trim() === ''

    if (isEmpty) return <br key={i} />

    if (isHeader) {
      const content = line.replace(/^#+\s*/, '')
      return (
        <h2 key={i} style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '1.35rem', margin: '1.25rem 0 0.5rem' }}>
          {content}
        </h2>
      )
    }

    if (isBold) {
      return (
        <p key={i} style={{ fontWeight: 700, color: 'var(--text-primary)', margin: '1rem 0 0.25rem' }}>
          {line.replace(/\*\*/g, '')}
        </p>
      )
    }

    if (isSectionNum) {
      return (
        <p key={i} style={{ fontWeight: 700, color: 'var(--emerald-light)', margin: '1.2rem 0 0.25rem', fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {line.trim()}
        </p>
      )
    }

    // Bullet points
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const content = line.trim().replace(/^[-•]\s/, '')
      return (
        <p key={i} style={{ paddingLeft: '1rem', position: 'relative', margin: '0.3rem 0' }}>
          <span style={{ position: 'absolute', left: 0, color: 'var(--emerald)' }}>›</span>
          {content}
        </p>
      )
    }

    return (
      <p key={i} style={{ margin: '0.3rem 0' }}>
        {line}
      </p>
    )
  }

  return (
    <div className="recipe-content" role="article" aria-label="Generated recipe">
      {visibleLines.map((line, i) => renderLine(line, i))}
      
      {hasSteps && !showSteps && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => setShowSteps(true)}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            Addım-addım təlimatlar
          </button>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------
   Main Page Component
------------------------------------------------------- */
export default function HomePage() {
  const [ingredients, setIngredients] = useState('')
  const [pantrySelected, setPantrySelected] = useState<Set<string>>(new Set())
  const [showPantry, setShowPantry] = useState(false)
  const [recipe, setRecipe] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [serverError, setServerError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recipeRef = useRef<HTMLDivElement>(null)

  // Impact Tracker State
  const [recipesGenerated, setRecipesGenerated] = useState(0)
  const [globalImpact, setGlobalImpact] = useState(12450)

  // Load local tracker data
  useEffect(() => {
    const saved = localStorage.getItem('sambite_recipes_count')
    if (saved) {
      setRecipesGenerated(parseInt(saved, 10))
    }
  }, [])

  // Simulated global ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalImpact(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleChipClick = useCallback((combo: string) => {
    setIngredients(combo)
    setFieldError('')
    textareaRef.current?.focus()
  }, [])

  const togglePantry = useCallback((id: string) => {
    setPantrySelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
    setFieldError('')
  }, [])

  // Combine textarea + selected pantry items for submission
  const getFullIngredients = useCallback(() => {
    const pantryLabels = Array.from(pantrySelected)
      .map(id => {
        const staple = PANTRY_STAPLES.find(s => s.id === id)
        // Strip leading emoji + space to get the plain Azerbaijani name
        return staple ? staple.label.replace(/^[\p{Emoji}\s]+/u, '').trim() : id
      })
    const base = ingredients.trim()
    if (pantryLabels.length === 0) return base
    return base ? `${base}, ${pantryLabels.join(', ')}` : pantryLabels.join(', ')
  }, [ingredients, pantrySelected])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const fullIngredients = getFullIngredients()

    // Client-side validation
    if (!fullIngredients) {
      setFieldError('Resept hazırlamazdan əvvəl ən azı bir ərzaq daxil edin.')
      textareaRef.current?.focus()
      return
    }
    if (fullIngredients.length < 3) {
      setFieldError('Daha spesifik ərzaqlar daxil edin (ən azı bir söz).')
      textareaRef.current?.focus()
      return
    }

    setFieldError('')
    setServerError('')
    setRecipe('')
    setLoading(true)

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: fullIngredients }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`)
      }

      setRecipe(data.recipe)

      // Update Impact Stats
      const newCount = recipesGenerated + 1
      setRecipesGenerated(newCount)
      localStorage.setItem('sambite_recipes_count', newCount.toString())
      setGlobalImpact(prev => prev + 1)

      // Scroll to recipe
      setTimeout(() => {
        recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gözlənilməz xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.'
      setServerError(message)
    } finally {
      setLoading(false)
    }
  }, [ingredients])

  return (
    <>
      {/* Ambient background */}
      <div className="bg-fx" aria-hidden="true" />

      <div className="page-wrapper">
        {/* ── Header ── */}
        <header className="header" role="banner">
          <a href="/" className="header-logo" aria-label="Sambite home">
            <div className="header-logo-icon" aria-hidden="true">
              <IconForkLeaf />
            </div>
            <span className="header-logo-name">Sambite</span>
          </a>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/about" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Haqqımızda</a>
          </nav>
        </header>

        {/* ── Main ── */}
        <main className="main" id="main-content">

          {/* Hero */}
          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-eyebrow" role="text">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              AI Kulinariya Şefi
            </div>
            <h1 className="hero-title" id="hero-title">
              Soyuducunuzdakıları{' '}
              <span className="hero-title-accent">möhtəşəm ziyafətə çevirin.</span>
            </h1>
            <p className="hero-tagline">
              Əlinizdə olan ərzaqları yazın və qoyun Sambite-in AI şefi saniyələr içində sizə qurman resepti hazırlasın.
            </p>
          </section>

          {/* Input Card */}
          <section aria-label="Ərzaq daxiletməsi">
            <div className="card">
              <form className="form" onSubmit={handleSubmit} noValidate id="recipe-form">
                <div>
                  <label htmlFor="ingredients-input" className="form-label">
                    Soyuducunuzda nə var?
                  </label>
                  <div className="textarea-wrapper">
                    <textarea
                      id="ingredients-input"
                      ref={textareaRef}
                      className={`textarea${fieldError ? ' error' : ''}`}
                      placeholder="məs. toyuq döşü, pendir, pomidor, yarım soğan..."
                      value={ingredients}
                      onChange={(e) => {
                        setIngredients(e.target.value)
                        if (fieldError) setFieldError('')
                      }}
                      rows={3}
                      aria-describedby={fieldError ? 'field-error' : 'field-hint'}
                      aria-invalid={!!fieldError}
                      disabled={loading}
                    />
                  </div>

                  {fieldError ? (
                    <p id="field-error" className="error-message" role="alert">
                      <span aria-hidden="true">⚠</span> {fieldError}
                    </p>
                  ) : (
                    <p id="field-hint" className="form-hint">
                      Əsas ərzaqları yazın. Evdəki adi məhsulları aşağıdan seçin.
                    </p>
                  )}
                </div>

                {/* Pantry staples selector */}
                <div className="pantry-section">
                  <button
                    type="button"
                    className="pantry-toggle"
                    onClick={() => setShowPantry(v => !v)}
                    aria-expanded={showPantry}
                    disabled={loading}
                  >
                    <span>🏠 Evdə nə var?</span>
                    <span className="pantry-toggle-arrow" style={{ transform: showPantry ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                    {pantrySelected.size > 0 && (
                      <span className="pantry-badge">{pantrySelected.size} seçilib</span>
                    )}
                  </button>

                  {showPantry && (
                    <div className="pantry-grid" role="group" aria-label="Evdəki adi məhsullar">
                      {PANTRY_STAPLES.map(staple => {
                        const isSelected = pantrySelected.has(staple.id)
                        return (
                          <button
                            key={staple.id}
                            type="button"
                            className={`pantry-chip${isSelected ? ' selected' : ''}`}
                            onClick={() => togglePantry(staple.id)}
                            disabled={loading}
                            aria-pressed={isSelected}
                          >
                            {isSelected && <span className="pantry-check">✓</span>}
                            {staple.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Quick-fill chips */}
                <div>
                  <p className="form-label" id="examples-label">Nümunə yoxlayın</p>
                  <div className="chips" role="group" aria-labelledby="examples-label">
                    {EXAMPLE_COMBOS.map((combo) => (
                      <button
                        key={combo}
                        type="button"
                        className="chip"
                        onClick={() => handleChipClick(combo)}
                        disabled={loading}
                        aria-label={`Fill with: ${combo}`}
                      >
                        {combo.split(',')[0].trim()} + daha çox…
                      </button>
                    ))}
                  </div>
                </div>

                {/* Server-level error */}
                {serverError && (
                  <div className="server-error" role="alert" aria-live="assertive">
                    <span className="server-error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                  </div>
                )}

                <button
                  id="craft-recipe-btn"
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  aria-busy={loading}
                  aria-label={loading ? 'Resept hazırlanır, zəhmət olmasa gözləyin' : 'Reseptimi Hazırla'}
                >
                  {loading ? (
                    <>
                      <div className="spinner" aria-hidden="true" />
                      Sambite Şef AI reseptinizi hazırlayır…
                    </>
                  ) : (
                    <>
                      <IconChef />
                      Reseptimi Hazırla
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          {/* Recipe Output */}
          {recipe && (
            <>
              <div className="divider" aria-hidden="true">
                <div className="divider-line" />
                <span className="divider-text">Sizin reseptiniz</span>
                <div className="divider-line" />
              </div>

              <section ref={recipeRef} aria-label="Generated recipe" className="recipe-card">
                <div className="recipe-card-header">
                  <div className="recipe-card-icon" aria-hidden="true">🍽️</div>
                  <div className="recipe-card-title-group">
                    <span className="recipe-card-label">Sambite Mətbəxi</span>
                    <span className="recipe-card-subtitle">Süni İntellekt tərəfindən hazırlanıb</span>
                  </div>
                </div>
                <div className="recipe-body">
                  <RecipeRenderer text={recipe} />
                </div>
              </section>
            </>
          )}

          {/* Impact Tracker */}
          <section className="impact-tracker" aria-labelledby="impact-title">
            <div className="divider" aria-hidden="true" style={{ marginTop: '1rem' }}>
              <div className="divider-line" />
              <span className="divider-text" id="impact-title">Ekoloji Təsiriniz</span>
              <div className="divider-line" />
            </div>

            <div className="impact-stats-grid">
              <div className="impact-stat-card">
                <div className="impact-stat-value">{(recipesGenerated * 0.3).toFixed(1)} <span style={{fontSize: '1rem'}}>kq</span></div>
                <div className="impact-stat-label">Xilas Edilən Qida</div>
              </div>
              <div className="impact-stat-card">
                <div className="impact-stat-value">{(recipesGenerated * 0.75).toFixed(1)} <span style={{fontSize: '1rem'}}>kq</span></div>
                <div className="impact-stat-label">CO2 Azalması</div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Sizin Nailiyyətləriniz</h3>
              <div className="badges-container">
                <div className={`impact-badge ${recipesGenerated >= 1 ? 'unlocked' : ''}`}>
                  <div className="impact-badge-icon">🌱</div>
                  <div className="impact-badge-name">Eko Başlanğıc</div>
                </div>
                <div className={`impact-badge ${recipesGenerated >= 5 ? 'unlocked' : ''}`}>
                  <div className="impact-badge-icon">♻️</div>
                  <div className="impact-badge-name">İsraf Azaldan</div>
                </div>
                <div className={`impact-badge ${recipesGenerated >= 10 ? 'unlocked' : ''}`}>
                  <div className="impact-badge-icon">🌍</div>
                  <div className="impact-badge-name">Sıfır İsraf Qəhrəmanı</div>
                </div>
              </div>
            </div>

            <div className="global-mission-banner">
              <div className="impact-stat-label">Qlobal Missiyamız</div>
              <div className="global-mission-value">{globalImpact.toLocaleString('az-AZ')} kq qida xilas edilib!</div>
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="footer" role="contentinfo">
          © {new Date().getFullYear()} Sambite ·{' '}
          Süni intellektlə dəstəklənən kulinariya sehri
        </footer>
      </div>
    </>
  )
}
