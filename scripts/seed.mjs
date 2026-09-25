// Seeds MongoDB with the client-confirmed content: services, FAQs and the starting price.
//   npm run seed            → inserts anything missing, never touches records an admin has edited
//   npm run seed -- --force → also resets the seeded records back to these defaults
// Testimonials, team members and blog posts are deliberately not seeded: they must be real, added in /admin.
import mongoose from 'mongoose'
import { defaultFaqs, defaultImages, defaultServices } from '../lib/site.ts'

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI is not set. Add it to .env (see .env.example) and run again.')
  process.exit(1)
}
const force = process.argv.includes('--force')

// Collection names match the Mongoose models in lib/db.ts (Service → services, Faq → faqs, Setting → settings).
const plan = [
  { collection: 'services', key: 'slug', docs: defaultServices },
  { collection: 'faqs', key: 'question', docs: defaultFaqs },
  { collection: 'settings', key: 'key', docs: [{ key: 'pricingStartingPrice', value: defaultImages.pricingStartingPrice }] },
]

await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
const db = mongoose.connection.db
try {
  for (const { collection, key, docs } of plan) {
    const col = db.collection(collection)
    await col.createIndex({ [key]: 1 }, { unique: true })
    let inserted = 0, reset = 0
    for (const doc of docs) {
      const now = new Date()
      const update = force ? { $set: { ...doc, updatedAt: now }, $setOnInsert: { createdAt: now } } : { $setOnInsert: { ...doc, createdAt: now, updatedAt: now } }
      const res = await col.updateOne({ [key]: doc[key] }, update, { upsert: true })
      if (res.upsertedCount) inserted++
      else if (res.modifiedCount) reset++
    }
    console.log(`${collection.padEnd(9)} ${inserted} inserted, ${force ? `${reset} reset, ` : ''}${docs.length - inserted - reset} unchanged`)
  }
  console.log('Seed complete.')
} finally {
  await mongoose.disconnect()
}
