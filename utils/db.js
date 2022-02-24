import mongoose from 'mongoose'

async function db() {
  await mongoose.connect(process.env.MONGO_CONNECT);
}

export default db