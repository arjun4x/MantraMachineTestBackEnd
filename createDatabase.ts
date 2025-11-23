import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const createDatabase = async () => {
  // Connect to default 'postgres' database to create our database
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // Connect to default database
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  })

  const dbName = process.env.DB_NAME || 'resort_booking'

  try {
    const client = await adminPool.connect()
    
    // Check if database exists
    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    )

    if (checkDb.rows.length > 0) {
      console.log(`✅ Database "${dbName}" already exists`)
      client.release()
      await adminPool.end()
      return
    }

    // Create database (note: cannot use parameterized query for database name)
    await client.query(`CREATE DATABASE "${dbName}"`)
    console.log(`✅ Database "${dbName}" created successfully`)
    
    client.release()
    
    console.log('\n✅ Database creation completed successfully')
    console.log('You can now run: npm run migrate')
    
  } catch (error: any) {
    console.error('❌ Error creating database:', error.message)
    if (error.code === '42P04') {
      console.log(`Database "${dbName}" already exists`)
    } else {
      throw error
    }
  } finally {
    await adminPool.end()
  }
}

createDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Database creation failed:', error)
    process.exit(1)
  })

