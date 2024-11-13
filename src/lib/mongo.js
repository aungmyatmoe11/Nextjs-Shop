import mongoose from "mongoose"

let cachedConnection = null

export async function dbConnect() {
  if (cachedConnection) {
    console.log("Using cached MongoDB connection")
    return cachedConnection
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Add your specific options here if needed
    })
    console.log("MongoDB connected")
    cachedConnection = conn // Cache the connection
    return conn
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw new Error("An unknown error occurred")
    }
  }
}
