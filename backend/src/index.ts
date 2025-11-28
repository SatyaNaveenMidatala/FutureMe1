import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { savePortfolio, getPortfolio, portfolioStore, setDbAvailable } from './services/portfolioService'

dotenv.config()

const app = express()
const port = process.env.PORT ? parseInt(process.env.PORT) : 4000

app.use(cors())
app.use(bodyParser.json())

// Attempt to connect to MongoDB if MONGODB_URI is provided. If connection
// fails or the env var is missing, the service falls back to the in-memory store.
const mongoUri = process.env.MONGODB_URI || ''
let dbConnected = false
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => {
      dbConnected = true
      setDbAvailable(true)
      console.log('Connected to MongoDB')
    })
    .catch((err) => {
      dbConnected = false
      setDbAvailable(false)
      console.warn('Failed to connect to MongoDB, continuing with in-memory store:', err.message)
    })
} else {
  console.log('MONGODB_URI not set — using in-memory portfolio store')
}

// Returns a mock profile for the UI to consume. In a real app this would
// come from a user database or auth token. Keeping this endpoint so the
// existing Profile page doesn’t break.
app.get('/api/profile', (req, res) => {
  res.json({
    username: 'seeduser',
    displayName: 'Seed User',
    bio: 'A curious developer exploring AI-driven self-improvement.',
    skills: ['JavaScript', 'TypeScript', 'React']
  })
})

// Existing predict endpoint retained for backwards compatibility. It simply
// echoes back a few generic milestones based on a seed string. In the new
// version of the app a more advanced generator is available via
// `/api/generate-future`.
app.post('/api/predict', (req, res) => {
  const { seedText } = req.body || {}
  const milestones = [
    {
      id: 'm1',
      title: 'Lead a high-impact project',
      description: `Lead a project that delivers measurable results and grows your leadership profile. Seed: ${
        seedText?.slice(0, 40)
      }`
    },
    {
      id: 'm2',
      title: 'Publish a technical talk or blog',
      description:
        'Share your work via a conference talk or a well-received blog series.'
    },
    {
      id: 'm3',
      title: 'Mentor junior developers',
      description: 'Actively mentor others to solidify your expertise and grow influence.'
    }
  ]
  res.json({ visionSummary: 'A confident growth-focused trajectory', milestones })
})

/**
 * Simple helper to build a future career timeline, projects, skill roadmap and
 * message. A real implementation would call an LLM or external service.
 */
function generateFutureProfile({
  username,
  displayName,
  role,
  skills,
  interests,
  aspirations,
  horizonYears
}: any) {
  const years = parseInt(horizonYears) || 5
  const currentYear = new Date().getFullYear()

  // Build timeline milestones. We simply increment the year and create a
  // hypothetical milestone at each step. Titles and descriptions are
  // generated based on inputs to be inspiring yet plausible.
  // Build timeline milestones. Use a variety of templates to make each year
  // feel unique and personalised. Each template is a function that returns
  // a title given the user's role, skills, interests and aspirations.
  const timelineTemplates: ((r: string, s: string[], i: string, a: string) => string)[] = [
    (r, s, i, a) => `Promotion to Senior ${r}`,
    (r, s, i, a) => `Lead a ${i.split(',')[0] || 'cross-functional'} initiative`,
    (r, s, i, a) => `Launch an open-source ${s[0]} library`,
    (r, s, i, a) => `Speak at a major ${i.split(',')[0] || 'tech'} conference`,
    (r, s, i, a) => `Mentor and grow the next generation of ${r}s`,
    (r, s, i, a) => `Transition into ${a}`
  ]
  const timeline = Array.from({ length: years }).map((_, idx) => {
    const year = currentYear + idx + 1
    const template = timelineTemplates[idx % timelineTemplates.length]
    const title = template(role, skills, interests, aspirations)
    // Build a description that references one of the user's skills or interests to
    // create a cohesive narrative.
    const skillRef = skills[idx % skills.length] || skills[0]
    const interestRef = interests.split(',')[idx % interests.split(',').length] || interests
    const aspirationRef = aspirations || role
    const description = `In ${year}, you will ${title.toLowerCase()}. You will apply your ${skillRef} expertise while pushing the boundaries in ${interestRef}. This milestone moves you closer to becoming ${aspirationRef}.`
    return { year, title, description }
  })

  // Future projects: propose 3 projects that align with interests and
  // aspirations. We sprinkle in trending technologies and tailor the
  // description to the user's background.
  const technologyPool = [
    'GraphQL',
    'Docker',
    'Kubernetes',
    'Microservices',
    'Serverless',
    'AI/ML',
    'Blockchain'
  ]
  const futureProjects = [
    {
      title: `AI-driven ${interests.split(',')[0] || 'innovation'} Platform`,
      description: `Design and build a platform that leverages AI to enhance ${
        interests
      }. This project will help you showcase your leadership and deep knowledge of ${
        skills[0]
      } while embracing cutting-edge technology.`,
      techStack: [...skills, 'AI/ML', technologyPool[0]],
      impact: 'Empowers thousands of users to achieve their goals.'
    },
    {
      title: `Open Source ${role} Toolkit`,
      description: `Create a toolkit that highlights best practices in ${role.toLowerCase()} and helps the community adopt modern approaches. Contribute back to the ecosystem that nurtured your growth.`,
      techStack: [...skills, technologyPool[1], 'OpenAPI'],
      impact: 'Gains community adoption and grows your professional network.'
    },
    {
      title: `${aspirations.split(' ')[0] || 'Innovative'} Case Study`,
      description: `Publish a case study on your journey transitioning from ${role} to ${
        aspirations || 'your aspirational role'
      }. Share challenges, learnings, and your unique perspective to inspire others.`,
      techStack: ['Writing', 'Public Speaking', technologyPool[2]],
      impact: 'Inspires others and establishes you as a thought leader.'
    }
  ]

  // Skill roadmap broken into phases: early, mid, late horizon. We assume
  // three phases over the time horizon.
  const roadmapPhases = ['Foundations', 'Deepening Expertise', 'Thought Leadership']
  const phaseDuration = Math.ceil((years * 12) / roadmapPhases.length)
  // Trending skills to sprinkle into the roadmap for breadth. These are
  // deliberately generic to avoid external dependencies.
  const trendingSkills = [
    'GraphQL',
    'Docker',
    'Kubernetes',
    'Microservices',
    'Cloud Architecture',
    'Machine Learning'
  ]
  const skillRoadmap = roadmapPhases.map((phase, idx) => {
    const months = `${idx * phaseDuration}–${(idx + 1) * phaseDuration} months`
    // For each phase, combine user skills with a trending skill and an
    // interest domain to encourage both depth and breadth.
    const recommendedSkills = [
      // annotate 's' as string to avoid implicit any errors
      ...skills.map((s: string) => `${s} (advanced)`),
      trendingSkills[idx % trendingSkills.length],
      interests.split(',')[idx % interests.split(',').length] || 'Soft Skills'
    ]
    const briefPlan = `During the ${phase.toLowerCase()} phase, you should dive deeper into ${skills.join(
      ', '
    )}, explore ${trendingSkills[idx % trendingSkills.length]}, and cultivate your passion for ${
      interests.split(',')[idx % interests.split(',').length] || 'soft skills'
    }. This will set the stage for your transition to ${aspirations || 'your next role'}.`
    return { phase, months, skills: recommendedSkills, briefPlan }
  })

  // Motivational message from future self
  const futureSelfMessage = `Dear ${displayName || username},\n\nYou've come so far from your days as a ${role}. Stay curious, keep learning, and never lose sight of your passion for ${interests}. Your future self is proud of the way you balanced technical mastery with ${aspirations}. Keep going — the best is yet to come!`

  return { timeline, futureProjects, skillRoadmap, futureSelfMessage }
}

/**
 * Generate a complete future profile. Accepts a POST with the user’s
 * information. Returns a JSON structure with timeline, projects, roadmap
 * and a message. Does not save anything — use `/api/save-portfolio` to
 * persist the generated profile.
 */
app.post('/api/generate-future', (req, res) => {
  const { username, displayName, role, skills, interests, aspirations, horizonYears } =
    req.body || {}
  if (!username || !role) {
    return res.status(400).json({ error: 'username and role are required' })
  }
  const { timeline, futureProjects, skillRoadmap, futureSelfMessage } = generateFutureProfile({
    username,
    displayName,
    role,
    skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',') : [],
    interests: typeof interests === 'string' ? interests : '',
    aspirations: typeof aspirations === 'string' ? aspirations : '',
    horizonYears
  })
  res.json({ timeline, futureProjects, skillRoadmap, futureSelfMessage })
})

/**
 * Save a generated portfolio. Stores the profile and generated data in
 * memory under the provided username. In a real app this would persist
 * to a database.
 */
app.post('/api/save-portfolio', async (req, res) => {
  const { username, profile, timeline, futureProjects, skillRoadmap, futureSelfMessage } =
    req.body || {}
  const result = await savePortfolio({ username, profile, timeline, futureProjects, skillRoadmap, futureSelfMessage })
  if (!result.success) {
    return res.status(400).json({ error: result.error })
  }
  res.json({ status: 'saved', source: result.source })
})

/**
 * Retrieve a saved future portfolio by username. Returns 404 if not found.
 */
app.get('/api/get-portfolio/:username', async (req, res) => {
  const { username } = req.params
  const result = await getPortfolio(username)
  if (!result.success) return res.status(404).json({ error: result.error })
  res.json(result.data)
})

// Lightweight health endpoint for local/dev checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok', dbConnected })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
