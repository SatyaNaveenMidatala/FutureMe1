import mongoose from 'mongoose'

const TimelineItemSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String }
  },
  { _id: false }
)

const FutureProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    techStack: { type: [String], default: [] },
    impact: { type: String }
  },
  { _id: false }
)

const SkillRoadmapItemSchema = new mongoose.Schema(
  {
    phase: { type: String, required: true },
    months: { type: String },
    skills: { type: [String], default: [] },
    briefPlan: { type: String }
  },
  { _id: false }
)

const FuturePortfolioSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    profile: { type: mongoose.Schema.Types.Mixed, default: {} },
    timeline: { type: [TimelineItemSchema], default: [] },
    futureProjects: { type: [FutureProjectSchema], default: [] },
    skillRoadmap: { type: [SkillRoadmapItemSchema], default: [] },
    futureSelfMessage: { type: String }
  },
  { timestamps: true }
)

// Remove internal fields when converting to JSON
FuturePortfolioSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

export default mongoose.model('FuturePortfolio', FuturePortfolioSchema)

