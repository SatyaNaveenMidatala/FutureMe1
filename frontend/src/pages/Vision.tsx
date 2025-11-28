import React, {useState, useEffect} from 'react'
import ClickSpark from '../components/ClickSpark'

type SavedPortfolio = {
  username: string
  profile: any
  timeline: any[]
  futureProjects: any[]
  skillRoadmap: any[]
  futureSelfMessage: string
}

export default function Vision(){
  const [savedPortfolio, setSavedPortfolio] = useState<SavedPortfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch saved portfolio for current user from session storage
    async function fetchSavedPortfolio() {
      try {
        const username = sessionStorage.getItem('futureme_username')
        if (!username) {
          setLoading(false)
          return
        }
        const res = await fetch(`/api/get-portfolio/${username}`)
        if (res.ok) {
          const data = await res.json()
          setSavedPortfolio(data)
        }
      } catch (err) {
        console.error('Failed to fetch saved portfolio:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSavedPortfolio()
  }, [])

  return (
    <div className="page vision-page">
      <header>
        <h1>Future Me</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/profile">Profile</a>
          <a href="/vision">Vision</a>
        </nav>
      </header>

      {savedPortfolio && (
        <div className="roadmap-section">
          <h2>📋 Your Saved Portfolio</h2>

          <div className="project-card">
            <h3>Timeline ({savedPortfolio.profile.horizonYears} years)</h3>
            {savedPortfolio.timeline && savedPortfolio.timeline.map((item: any, idx: number) => (
              <div key={idx} className="timeline-item" style={{marginBottom: '1rem'}}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="project-card">
            <h3>Future Projects</h3>
            {savedPortfolio.futureProjects && savedPortfolio.futureProjects.map((proj: any, idx: number) => (
              <div key={idx} style={{marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--accent)'}}>
                <h4>{proj.title}</h4>
                <p>{proj.description}</p>
                <p className="muted"><strong>Tech:</strong> {proj.techStack?.join(', ')}</p>
                <p className="muted"><strong>Impact:</strong> {proj.impact}</p>
              </div>
            ))}
          </div>

          <div className="project-card">
            <h3>Skill Roadmap</h3>
            {savedPortfolio.skillRoadmap && savedPortfolio.skillRoadmap.map((phase: any, idx: number) => (
              <div key={idx} className="roadmap-item">
                <h4>{phase.phase}</h4>
                <p><strong>Duration:</strong> {phase.months}</p>
                <p><strong>Skills:</strong> {phase.skills?.join(', ')}</p>
                <p>{phase.briefPlan}</p>
              </div>
            ))}
          </div>

          <div className="message-section">
            <div className="future-message">
              <h3>💭 Message From Your Future Self</h3>
              <pre>{savedPortfolio.futureSelfMessage}</pre>
            </div>
          </div>
        </div>
      )}

      {!savedPortfolio && !loading && (
        <div className="project-card" style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h3>No Saved Portfolio Yet</h3>
          <p>Complete the onboarding and save your portfolio to view it here.</p>
        </div>
      )}

      {loading && (
        <div className="project-card" style={{textAlign: 'center'}}>
          <p>Loading your portfolio...</p>
        </div>
      )}
    </div>
  )
}

