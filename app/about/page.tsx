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
