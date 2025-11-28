import React from 'react'
import ClickSpark from '../components/ClickSpark'

export default function Projects(){
  return (
    <div className="page">
      <header>
        <h1>Future Me</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/profile">Profile</a>
          <a href="/vision">Vision</a>
          <a href="/projects">Projects</a>
        </nav>
      </header>

      <h2>Projects</h2>
      <p>Your future project portfolio will be displayed here once you complete the onboarding journey.</p>
      <div className="project-card" style={{marginTop: '2rem', textAlign: 'center'}}>
        <h4>Start Your Journey</h4>
        <p>Begin the onboarding process to generate your personalized future portfolio and project ideas.</p>
        <a href="/onboarding" className="cta-button">Start Time Travel</a>
      </div>
    </div>
  )
}

