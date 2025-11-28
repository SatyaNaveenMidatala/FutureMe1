import React, {useEffect, useState} from 'react'
import ClickSpark from '../components/ClickSpark'

type ProfileData = {
  username: string
  displayName: string
  bio: string
  skills: string[]
  role?: string
  interests?: string
  aspirations?: string
}

export default function Profile(){
  // sensible default profile (automation tester)
  const defaultProfile: ProfileData = {
    username: 'auto_tester_01',
    displayName: 'Asha Rao',
    bio: 'Automation Tester with 5+ years building robust test frameworks and improving product quality through automation and CI practices.',
    skills: ['Selenium', 'Cypress', 'Playwright', 'JavaScript/TypeScript', 'Jest', 'TestNG', 'CI/CD', 'API testing']
  }

  const [profile, setProfile] = useState<ProfileData | null>(defaultProfile)

  useEffect(()=>{
    // Try fetching real profile from session storage first
    const username = sessionStorage.getItem('futureme_username')
    if (username) {
      fetch(`/api/get-portfolio/${username}`)
        .then(r => {
          if(!r.ok) throw new Error('no profile')
          return r.json()
        })
        .then((data: any) => {
          if (data.profile) {
            setProfile(data.profile)
          }
        })
        .catch(() => {
          // keep defaultProfile
        })
    } else {
      // Fallback: Try fetching real profile but keep the default if backend not available
      fetch('/api/profile')
        .then(r => {
          if(!r.ok) throw new Error('no profile')
          return r.json()
        })
        .then((data: ProfileData) => setProfile(data))
        .catch(() => {
          // keep defaultProfile
        })
    }
  }, [])

  if(!profile) return <div className="page">Loading...</div>

  return (
    <ClickSpark sparkColor="#8acfd1" sparkSize={10} sparkRadius={18} sparkCount={8} duration={450}>
      <div className="page">
      <header>
        <h1>Future Me</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/profile">Profile</a>
          <a href="/vision">Vision</a>
        </nav>
      </header>

      <h2>{profile.displayName}</h2>
      <p>{profile.bio}</p>

      {profile.role && (
        <div className="project-card" style={{marginBottom: '1.5rem'}}>
          <h3>Current Role</h3>
          <p>{profile.role}</p>
        </div>
      )}

      <h3>Skills</h3>
      <ul>
        {profile.skills.map(s=> <li key={s}>{s}</li>)}
      </ul>

      {profile.interests && (
        <div className="project-card" style={{marginBottom: '1.5rem'}}>
          <h3>Interests</h3>
          <p>{profile.interests}</p>
        </div>
      )}

      {profile.aspirations && (
        <div className="project-card">
          <h3>Aspirations</h3>
          <p>{profile.aspirations}</p>
        </div>
      )}


      </div>
    </ClickSpark>
  )
}
