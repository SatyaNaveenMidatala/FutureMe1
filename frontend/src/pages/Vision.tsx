import React, {useState} from 'react'

type Milestone = { id: string, title: string, description: string }

export default function Vision(){
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [seed, setSeed] = useState('')
  const [generating, setGenerating] = useState(false)

  async function generate(){
    setGenerating(true)
    try{
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({seedText: seed, tone: 'aspirational', horizon: '5y', maxMilestones: 3})
      })
      const data = await res.json()
      // accept predicted milestones
      setMilestones(data.milestones || [])
    }catch(err){
      console.error(err)
    }finally{setGenerating(false)}
  }

  return (
    <div className="page">
      <h1>Vision Editor</h1>
      <textarea value={seed} onChange={e=>setSeed(e.target.value)} placeholder="Write a short seed about your goals..." />
      <div>
        <button onClick={generate} disabled={generating}>{generating ? 'Generating...' : 'Generate Future'}</button>
      </div>
      <h2>Milestones</h2>
      <ul>
        {milestones.map(m=> (
          <li key={m.id}>
            <strong>{m.title}</strong>
            <p>{m.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

