import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Quest from '../models/Quest.js'

dotenv.config()

async function checkQuests() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB\n')

    const count = await Quest.countDocuments()
    console.log(`Total quests in database: ${count}`)

    if (count === 0) {
      console.log('⚠️  No quests found! Need to seed quests.')
      console.log('💡 Run: cd ai-services && python seed_quests.py')
    } else {
      const sample = await Quest.find().limit(5).select('title domain difficulty isActive')
      console.log('\nSample quests:')
      sample.forEach(q => {
        console.log(`  - ${q.title} (${q.domain}, ${q.difficulty}, active: ${q.isActive})`)
      })
      
      const byDomain = await Quest.aggregate([
        { $group: { _id: '$domain', count: { $sum: 1 } } }
      ])
      console.log('\nQuests by domain:')
      byDomain.forEach(({ _id, count }) => {
        console.log(`  ${_id}: ${count} quests`)
      })
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkQuests()

