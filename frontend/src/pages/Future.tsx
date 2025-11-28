import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ChromaGrid from '../components/ChromaGrid'
import ClickSpark from '../components/ClickSpark'

type LocationState = {
  profile: {
    username: string
    displayName?: string
    role: string
    skills: string[]
    interests: string
    aspirations: string
    horizonYears: string
  }
  result: {
    timeline: { year: number; title: string; description: string }[]
    futureProjects: {
      title: string
      description: string
      techStack: string[]
      impact: string
    }[]
    skillRoadmap: {
      phase: string
      months: string
      skills: string[]
      briefPlan: string
    }[]
    futureSelfMessage: string
  }
} | undefined

export default function Future() {
  const location = useLocation()
  const state = location.state as LocationState
  const [activeTab, setActiveTab] = useState<'now' | 'future'>('future')
  const [saved, setSaved] = useState(false)

  // When the component mounts, check if we have saved data for this user
  useEffect(() => {
    async function fetchSaved() {
      if (!state?.profile?.username) return
      try {
        const res = await fetch(`/api/get-portfolio/${state.profile.username}`)
        if (res.ok) {
          setSaved(true)
        }
      } catch (err) {
        // ignore
      }
    }
    fetchSaved()
  }, [state])

  if (!state) {
    return (
      <div className="page">
        <h1>Future</h1>
        <p>No future profile found. Please complete the onboarding first.</p>
      </div>
    )
  }
  const { profile, result } = state

  async function handleSave() {
    try {
      const res = await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.username,
          profile,
          timeline: result.timeline,
          futureProjects: result.futureProjects,
          skillRoadmap: result.skillRoadmap,
          futureSelfMessage: result.futureSelfMessage
        })
      })
      if (res.ok) setSaved(true)
    } catch (err) {
      alert('Failed to save portfolio')
    }
  }

  // Map future projects to ChromaGrid items
  const chromaItems = result.futureProjects.map((p, idx) => ({
    title: p.title,
    subtitle: p.description.slice(0, 80) + (p.description.length > 80 ? '…' : ''),
    handle: `#${idx + 1}`,
    borderColor: '#60A5FA',
    gradient: ['linear-gradient(135deg,#667eea,#764ba2)', 'linear-gradient(135deg,#ec4899,#f59e0b)', 'linear-gradient(135deg,#06b6d4,#0891b2)', 'linear-gradient(135deg,#8b5cf6,#7c3aed)'][idx % 4],
    url: '#'
  }))

  return (
    <div className="page future-page">
      <header>
        <h1>Future Me</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/profile">Profile</a>
          <a href="/vision">Vision</a>
        </nav>
      </header>

      <h2>Your Journey</h2>
      <div className="tab-toggle">
        <button
          className={activeTab === 'now' ? 'active' : ''}
          onClick={() => setActiveTab('now')}
        >
          Now
        </button>
        <button
          className={activeTab === 'future' ? 'active' : ''}
          onClick={() => setActiveTab('future')}
        >
          Future
        </button>
      </div>
      {activeTab === 'now' && (
        <div className="now-view">
          <h2>{profile.displayName || profile.username}</h2>
          <p><strong>Current Role:</strong> {profile.role}</p>
          {profile.skills.length > 0 && (
            <>
              <h3>Skills</h3>
              <ul>
                {profile.skills.map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </>
          )}
          {profile.interests && (
            <p><strong>Interests:</strong> {profile.interests}</p>
          )}
          {profile.aspirations && (
            <p><strong>Aspirations:</strong> {profile.aspirations}</p>
          )}
        </div>
      )}
      {activeTab === 'future' && (
        <div className="future-view">
          <section className="timeline-section">
            <h2>Timeline ({profile.horizonYears} years)</h2>
            <div className="timeline">
              {result.timeline.map(item => (
                <div key={item.year} className="timeline-item">
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="chroma-section">
            <h2>Future Projects Gallery</h2>
            <ChromaGrid items={chromaItems} radius={260} damping={0.5} fadeOut={0.5} ease="power3.out" />
          </section>

          <section className="projects-section">
            <h2>Future Projects</h2>
            {result.futureProjects.map((proj, idx) => (
              <div key={idx} className="project-card">
                <h4>{proj.title}</h4>
                <p>{proj.description}</p>
                <p className="muted">Tech: {proj.techStack.join(', ')}</p>
                <p className="muted">Impact: {proj.impact}</p>
              </div>
            ))}
          </section>
          <section className="roadmap-section">
            <h2>Skill Roadmap</h2>
            {result.skillRoadmap.map((phase, idx) => (
              <div key={idx} className="roadmap-item">
                <h4>{phase.phase}</h4>
                <p><strong>Duration:</strong> {phase.months}</p>
                <p><strong>Skills:</strong> {phase.skills.join(', ')}</p>
                <p>{phase.briefPlan}</p>
              </div>
            ))}
          </section>
          <section className="message-section">
            <h2>Message From Your Future Self</h2>
            <pre className="future-message">{result.futureSelfMessage}</pre>
          </section>
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        {!saved ? (
          <button onClick={handleSave}>Save Portfolio</button>
        ) : (
          <p className="muted">Portfolio saved! You can revisit this page anytime.</p>
        )}
      </div>
    </div>
  )
}