import { pool } from '../config/database'
import dotenv from 'dotenv'

dotenv.config()

const createBookingsTable = async () => {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 10),
        room_type VARCHAR(20) NOT NULL CHECK (room_type IN ('standard', 'deluxe', 'suite', 'villa')),
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await client.query(createTableQuery)
    await client.query('COMMIT')
    
    console.log('✅ Bookings table created successfully')
    
    // Check if table exists and show structure
    const checkTable = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'bookings'
      ORDER BY ordinal_position
    `)
    
    console.log('\n📊 Table structure:')
    checkTable.rows.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}${row.character_maximum_length ? `(${row.character_maximum_length})` : ''}`)
    })
    
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Error creating table:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run migration
createBookingsTable()
  .then(() => {
    console.log('\n✅ Migration completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })

