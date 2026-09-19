export default function AboutPage() {
  return (
    <>
      {/* Ambient background */}
      <div className="bg-fx" aria-hidden="true" />

      <div className="page-wrapper">
        {/* ── Header ── */}
        <header className="header" role="banner">
          <a href="/" className="header-logo" aria-label="Sambite home">
            <div className="header-logo-icon" aria-hidden="true">
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
            </div>
            <span className="header-logo-name">Sambite</span>
          </a>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Ana Səhifə</a>
          </nav>
        </header>

        {/* ── Main ── */}
        <main className="main" id="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

          <section className="card" style={{ padding: '3rem' }}>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Haqqımızda</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              Sambite olaraq missiyamız mətbəxinizdəki ərzaq israfını azaltmaq və hər kəsin daxilindəki şefi ortaya çıxarmaqdır. Evdə qalan sadə ərzaqlarla belə möhtəşəm və ləziz yeməklər hazırlamağın mümkün olduğuna inanırıq. Süni intellektin gücü ilə sizə unikal və fərdiləşdirilmiş kulinariya təcrübəsi təqdim edirik.
            </p>
          </section>

          <section className="card" style={{ padding: '3rem' }}>
            <h2 className="hero-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Komandamız</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Cavidan Bayramlı</h3>
                <p style={{ color: 'var(--emerald)', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Co-founder</p>
              </div>

              <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Səma İsmayılova</h3>
                <p style={{ color: 'var(--emerald)', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Co-founder</p>
              </div>
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
