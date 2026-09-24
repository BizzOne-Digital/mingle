import mongoose, { Schema, type Model } from 'mongoose'
import { DEPOSIT_STATUSES, INQUIRY_STATUSES, UPLOAD_FOLDERS, resources, type FieldType } from './content'

// Cached across hot reloads (dev) and warm serverless invocations (prod).
const cache = globalThis as unknown as { mongoose?: Promise<typeof mongoose> | null }

export async function db() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')
  cache.mongoose ??= mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 })
  try {
    await cache.mongoose
  } catch (error) {
    cache.mongoose = null
    throw error
  }
}

const types: Record<FieldType, unknown> = { text: String, textarea: String, slug: String, email: String, tel: String, select: String, image: String, number: Number, bool: Boolean, date: Date }

function define(name: string, definition: Record<string, unknown>, index?: [Record<string, 1>, { unique: true }]): Model<any> {
  if (mongoose.models[name]) return mongoose.models[name]
  const schema = new Schema(definition as any, { timestamps: true })
  if (index) schema.index(...index)
  return mongoose.model(name, schema) as Model<any>
}

const inquiryExtra = {
  status: { type: String, enum: INQUIRY_STATUSES, default: 'new', index: true },
  depositStatus: { type: String, enum: DEPOSIT_STATUSES, default: 'none' },
  depositAmount: Number, // cents, entered by an admin per booking
  depositUrl: String,
  stripeSessionId: { type: String, index: true },
  paidAt: Date,
}

export const models: Record<string, Model<any>> = Object.fromEntries(
  Object.entries(resources).map(([key, r]) => [key, define(
    r.model,
    { ...Object.fromEntries(r.fields.map((f) => [f.name, { type: types[f.type], default: f.default }])), ...(key === 'inquiries' ? inquiryExtra : {}) },
    r.unique ? [{ [r.unique]: 1 }, { unique: true }] : undefined,
  )]),
)

export const StoredUpload = define('StoredUpload', {
  folder: { type: String, enum: UPLOAD_FOLDERS, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
}, [{ folder: 1, filename: 1 }, { unique: true }])

export const Setting = define('Setting', { key: { type: String, required: true, unique: true }, value: String })

export const toPlain = <T,>(doc: T): T => JSON.parse(JSON.stringify(doc))
