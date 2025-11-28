import FuturePortfolioModel from '../models/FuturePortfolio'

// In-memory fallback store; index.ts will import this same object instance
export const portfolioStore: Record<string, any> = {}

let dbAvailable = false

export function setDbAvailable(v: boolean) {
  dbAvailable = v
}

export async function savePortfolio(payload: any) {
  const { username, profile, timeline, futureProjects, skillRoadmap, futureSelfMessage } = payload
  if (!username || !profile) {
    return { success: false, error: 'username and profile are required' }
  }
  if (dbAvailable) {
    try {
      const doc = await FuturePortfolioModel.findOneAndUpdate(
        { username },
        { username, profile, timeline, futureProjects, skillRoadmap, futureSelfMessage },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).exec()
      return { success: true, data: doc?.toJSON ? doc.toJSON() : doc, source: 'db' }
    } catch (err: any) {
      console.warn('DB save failed, falling back to memory store:', err?.message || err)
      // fall through to memory fallback
    }
  }
  // memory fallback
  portfolioStore[username] = { username, profile, timeline, futureProjects, skillRoadmap, futureSelfMessage }
  return { success: true, data: portfolioStore[username], source: 'memory' }
}

export async function getPortfolio(username: string) {
  if (!username) return { success: false, error: 'username required' }
  if (dbAvailable) {
    try {
      const doc = await FuturePortfolioModel.findOne({ username }).exec()
      if (!doc) return { success: false, error: 'portfolio not found' }
      return { success: true, data: doc.toJSON(), source: 'db' }
    } catch (err: any) {
      console.warn('DB fetch failed, falling back to memory store:', err?.message || err)
      // fall through to memory fallback
    }
  }
  if (portfolioStore[username]) return { success: true, data: portfolioStore[username], source: 'memory' }
  return { success: false, error: 'portfolio not found' }
}

