import './App.css';

const features = [
  {
    title: 'Crowd Detection',
    description: 'Track audience size and excitement in real time. Our system senses movement, noise, and presence so every screen knows when the room is paying attention.',
    icon: '👁',
  },
  {
    title: 'Smart Promotions',
    description: 'Show ads and deals at the moments when engagement is highest. No more wasted impressions—content appears when it’s most likely to convert.',
    icon: '📢',
  },
  {
    title: 'Interactive Games & Polls',
    description: 'Let visitors participate via their phones. Run live polls, trivia, and games that turn passive viewers into active participants.',
    icon: '🎮',
  },
  {
    title: 'Real-Time Analytics',
    description: 'Give venues and advertisers clear engagement and revenue metrics. See what’s working and optimize on the fly.',
    icon: '📊',
  },
  {
    title: 'Automated Content Engine',
    description: 'AI decides what to display based on crowd mood and event data. The right message, at the right time, without manual switching.',
    icon: '⚡',
  },
  {
    title: 'Screen Synchronization',
    description: 'All displays react together for a unified experience. One crowd, one story—across every screen in the venue.',
    icon: '🔄',
  },
];

function App() {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner page">
          <span className="logo-text">AtmosAI</span>
          <a href="#contact" className="nav-cta">Get in touch</a>
        </div>
      </nav>

      <header className="hero">
        <span className="hero-badge">Intelligent venue displays</span>
        <h1>
          TVs can <span className="highlight">feel the crowd</span>
        </h1>
        <p className="hero-sub">
          AtmosAI transforms ordinary venue screens into intelligent, crowd-aware displays that dynamically adapt to the room’s energy and engagement.
        </p>
        <div className="hero-cta-row">
          <a href="#how-it-works" className="btn-primary">See how it works</a>
          <a href="#features" className="btn-secondary">Explore features</a>
        </div>
      </header>

      <section className="section pitch" id="how-it-works">
        <div className="pitch-inner">
          <p>
            By sensing crowd reactions through movement, noise, or interactive mobile inputs, AtmosAI automatically adjusts content—showing promotions, ads, or interactive games—at the moments when the audience is most attentive.
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            The platform creates a more engaging experience for visitors while maximizing advertising impact and revenue opportunities, turning every screen into a smart, data-driven revenue engine.
          </p>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-header">
          <p className="section-tag">Platform</p>
          <h2 className="section-title">Built for engagement and revenue</h2>
          <p className="section-desc">
            Six pillars that make venue screens intelligent, responsive, and profitable.
          </p>
        </div>
        <div className="features">
          {features.map((f) => (
            <article key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-section" id="contact">
        <div className="cta-box">
          <h2>Ready to make your screens feel the crowd?</h2>
          <p>
            Join venues and advertisers who are turning passive displays into intelligent, crowd-aware revenue engines.
          </p>
          <a href="#" className="btn-primary">Request a demo</a>
        </div>
      </section>

      <footer className="footer">
        <p>AtmosAI — TVs can feel the crowd. © 2026</p>
      </footer>
    </>
  );
}

export default App;
