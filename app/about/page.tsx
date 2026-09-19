export default function AboutPage() {
  return (
    <>
      {/* Ambient background */}
      <div className="bg-fx" aria-hidden="true" />

      <div className="page-wrapper">
        {/* ── Header ── */}
        <header className="header" role="banner">
          <a href="/" className="header-logo" aria-label="Sambite home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sambitelogo.png" alt="Sambite" className="header-logo-img" />
          </a>
          <nav className="header-nav">
            <a href="/" className="nav-link">Ana Səhifə</a>
            <a href="/about" className="nav-link active">Haqqımızda</a>
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
