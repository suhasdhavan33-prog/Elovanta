import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <section className="hero">
      <div className="hero-text">
        <span className="hero-eyebrow">Welcome to Elovanta</span>
        <h1>Learn English the Fun Way! 🎈</h1>
        <p>
          Friendly online tutoring for kids aged 4 to 14 — phonics, letter sounds, blending,
          and reading, taught through fun, interactive lessons.
        </p>
        <div className="hero-actions">
          <Link to="/courses" className="btn-primary">
            Explore Courses
          </Link>
          <Link to="/register" className="btn-secondary">
            Create Free Account
          </Link>
        </div>
      </div>
      <div className="hero-art">🧸📚🔤🦄</div>
    </section>

    <section className="features">
      <div className="feature-card">
        <div className="feature-emoji">🔤</div>
        <h3>Phonics</h3>
        <p>Master letter sounds with playful examples and audio practice.</p>
      </div>
      <div className="feature-card">
        <div className="feature-emoji">🔊</div>
        <h3>Sounds & Blending</h3>
        <p>Blend sounds together to build confidence reading new words.</p>
      </div>
      <div className="feature-card">
        <div className="feature-emoji">📖</div>
        <h3>Reading</h3>
        <p>Enjoy short stories designed to grow vocabulary and comprehension.</p>
      </div>
      <div className="feature-card">
        <div className="feature-emoji">🏆</div>
        <h3>Track Progress</h3>
        <p>Parents can see exactly how their child is improving over time.</p>
      </div>
    </section>

    <section className="cta-banner">
      <h2>Ready to start learning?</h2>
      <p>It only takes a minute to create an account and begin the first lesson.</p>
      <Link to="/register" className="btn-primary">
        Get Started
      </Link>
    </section>
  </div>
);

export default Home;
