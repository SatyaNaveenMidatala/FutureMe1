import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Onboarding wizard collects basic information about the user and their
 * aspirations. At the end of the flow we call the backend generator to
 * create a future profile and navigate to the dashboard page.
 */
export default function Onboarding() {
  // Step index: 0 = intro, 1 = current, 2 = interests, 3 = horizon
  const [step, setStep] = useState(0)
  // Basic profile fields
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [interests, setInterests] = useState('')
  const [aspirations, setAspirations] = useState('')
  const [horizonYears, setHorizonYears] = useState('5')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Split comma-separated skills into array
  const parseSkills = (input: string) =>
    input
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate-future', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          displayName,
          role,
          skills: parseSkills(skillsInput),
          interests,
          aspirations,
          horizonYears
        })
      })
      const data = await res.json()
      // Pass along both the input profile and generated data to the
      // dashboard. We also persist the username in session storage so the
      // dashboard can fetch saved data later if needed.
      sessionStorage.setItem('futureme_username', username)
      navigate('/future', {
        state: {
          profile: {
            username,
            displayName,
            role,
            skills: parseSkills(skillsInput),
            interests,
            aspirations,
            horizonYears
          },
          result: data
        }
      })
    } catch (err) {
      console.error(err)
      alert('Failed to generate future profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function nextStep() {
    setStep(Math.min(step + 1, 3))
  }
  function prevStep() {
    setStep(Math.max(step - 1, 0))
  }

  return (
    <div className="page onboarding">
      <h1>Onboarding</h1>
      {/* progress indicator */}
      <div className="onboarding-progress">
        {[0, 1, 2, 3].map(i => (
          <span
            key={i}
            className={
              'dot' + (step === i ? ' active' : '')
            }
          ></span>
        ))}
      </div>
      {step === 0 && (
        <div className="onboarding-step">
          <h2>Welcome</h2>
          <p>
            Let’s gather a few details about you and your aspirations. This will help
            us generate a personalized future timeline and growth plan.
          </p>
          <button onClick={nextStep}>Start</button>
        </div>
      )}
      {step === 1 && (
        <div className="onboarding-step">
          <h2>About You</h2>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your unique handle"
              required
            />
          </label>
          <label>
            Display Name
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="how you'd like to be known"
            />
          </label>
          <label>
            Current Role
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              required
            />
          </label>
          <label>
            Key Skills (comma‑separated)
            <input
              type="text"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="e.g. JavaScript, React, Node"
            />
          </label>
          <div className="onboarding-nav">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep} disabled={!username || !role}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="onboarding-step">
          <h2>Passions & Goals</h2>
          <label>
            Interests / Domains
            <input
              type="text"
              value={interests}
              onChange={e => setInterests(e.target.value)}
              placeholder="e.g. AI, fintech, open source"
            />
          </label>
          <label>
            Aspirational Role or Achievement
            <input
              type="text"
              value={aspirations}
              onChange={e => setAspirations(e.target.value)}
              placeholder="e.g. CTO, founder, principal engineer"
            />
          </label>
          <div className="onboarding-nav">
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep}>Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="onboarding-step">
          <h2>Time Horizon</h2>
          <label>
            How far into the future should we plan (years)?
            <select value={horizonYears} onChange={e => setHorizonYears(e.target.value)}>
              <option value="3">3 Years</option>
              <option value="5">5 Years</option>
              <option value="10">10 Years</option>
            </select>
          </label>
          <div className="onboarding-nav">
            <button onClick={prevStep}>Back</button>
            <button onClick={handleGenerate} disabled={loading || !username || !role}>
              {loading ? 'Generating…' : 'Generate My Future'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}