import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bookingRoutes from './routes/bookingRoutes'
import { pool } from './config/database'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Routes
app.use('/api', bookingRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  })
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
  
  // Test database connection
  try {
    const client = await pool.connect()
    console.log('Database connected successfully')
    client.release()
  } catch (error) {
    console.error('Database connection error:', error)
  }
})

export default app

