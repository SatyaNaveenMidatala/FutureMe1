import React, {useEffect, useState} from 'react'

type ProfileData = {
  username: string
  displayName: string
  bio: string
  skills: string[]
}

type Project = {
  id: string
  title: string
  description: string
  tech?: string[]
}

export default function Profile(){
  // sensible default profile (automation tester)
  const defaultProfile: ProfileData = {
    username: 'auto_tester_01',
    displayName: 'Asha Rao',
    bio: 'Automation Tester with 5+ years building robust test frameworks and improving product quality through automation and CI practices.',
    skills: ['Selenium', 'Cypress', 'Playwright', 'JavaScript/TypeScript', 'Jest', 'TestNG', 'CI/CD', 'API testing']
  }

  const sampleProjects: Project[] = [
    {
      id: 'p1',
      title: 'Web E2E Framework',
      description: 'Built a cross-browser end-to-end test framework using Playwright with page-object patterns and integrated visual regression checks.',
      tech: ['Playwright', 'TypeScript', 'GitHub Actions']
    },
    {
      id: 'p2',
      title: 'API Contract Tests',
      description: 'Implemented contract and integration tests for backend microservices using Pact and automated them in CI to prevent breaking changes.',
      tech: ['Pact', 'Jest', 'Node']
    },
    {
      id: 'p3',
      title: 'Test Data & Environment Orchestration',
      description: 'Created a lightweight service to seed test data and spin up ephemeral test environments for reliable automated runs.',
      tech: ['Docker', 'Node', 'Postgres']
    }
  ]

  const [profile, setProfile] = useState<ProfileData | null>(defaultProfile)
  const [projects] = useState<Project[]>(sampleProjects)
  const [goalInput, setGoalInput] = useState<string>('')

  useEffect(()=>{
    // Try fetching real profile but keep the default if backend not available
    fetch('/api/profile')
      .then(r => {
        if(!r.ok) throw new Error('no profile')
        return r.json()
      })
      .then((data: ProfileData) => setProfile(data))
      .catch(() => {
        // keep defaultProfile
      })
  }, [])

  if(!profile) return <div className="page">Loading...</div>

  const normalizedGoal = goalInput.trim().toLowerCase()
  const isTestLeadGoal = () => {
    if(!normalizedGoal) return false
    // match 'test lead', 'testlead', or both 'test' and 'lead' words present
    return normalizedGoal.includes('test lead') || normalizedGoal.includes('testlead') || (normalizedGoal.includes('test') && normalizedGoal.includes('lead'))
  }

  return (
    <div className="page">
      <h1>{profile.displayName}</h1>
      <p>{profile.bio}</p>

      <h3>Skills</h3>
      <ul>
        {profile.skills.map(s=> <li key={s}>{s}</li>)}
      </ul>

      <h3>Sample Projects</h3>
      <div className="projects">
        {projects.map(p => (
          <div key={p.id} className="project-card">
            <h4>{p.title}</h4>
            <p>{p.description}</p>
            {p.tech && <p className="muted">Tech: {p.tech.join(', ')}</p>}
          </div>
        ))}
      </div>

      <h3>Set Your Goal</h3>
      <p>Type a career goal (for example: "test lead") and get a short vision guidance.</p>
      <input
        aria-label="goals"
        value={goalInput}
        onChange={e => setGoalInput(e.target.value)}
        placeholder="e.g. test lead"
        style={{padding: '8px', width: '100%', maxWidth: 480, boxSizing: 'border-box'}}
      />

      {isTestLeadGoal() && (
        <div className="vision guidance" style={{marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 6, background: '#fafafa'}}>
          <h4>Vision Guidance — Transition to Test Lead</h4>
          <ul>
            <li>Develop people leadership: mentor junior testers, run bug triage, and lead retrospectives.</li>
            <li>Drive test strategy: define automation goals, coverage plans, and non-functional testing needs.</li>
            <li>Technical ownership: architect reliable test frameworks, CI pipelines and observability for test runs.</li>
            <li>Stakeholder communication: translate test results into risk statements for product and engineering managers.</li>
            <li>Career steps: build a portfolio of projects, show measurable impact (reduced regressions, faster release cadence).</li>
          </ul>
          <p className="muted">Suggested next projects: lead a cross-team automation initiative, propose CI optimizations, and run a knowledge-sharing series.</p>
        </div>
      )}

    </div>
  )
}
