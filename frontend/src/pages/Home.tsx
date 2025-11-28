import React from 'react'
import { Link } from 'react-router-dom'
import ClickSpark from '../components/ClickSpark'

export default function Home() {
  return (
    <ClickSpark sparkColor="#d04f99" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
      <div className="page home-page">
        <header className="home-header">
          <h1>Future&nbsp;Me</h1>
          <nav>
            <Link to="/profile">Profile</Link> |{' '}
            <Link to="/vision">Vision</Link>
          </nav>
        </header>
        <main>
          <section className="hero">
            <h2>A portfolio not just about who you are… but who you <em>will be</em>.</h2>
            <p>
              Explore your current achievements, imagine future milestones, and plan the
              skills you'll need along the way. Take a journey through time with an
              AI‑powered roadmap for your career.
            </p>
            <Link to="/onboarding" className="cta-button">
              Start Time Travel
            </Link>
          </section>
        </main>
      </div>
    </ClickSpark>
  )
}

