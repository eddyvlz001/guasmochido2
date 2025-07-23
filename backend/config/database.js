const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'piensa_db',
  user: process.env.DB_USER || 'piensa_user',
  password: process.env.DB_PASSWORD,
  max: 10, // maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create speakers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS speakers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        speaker_id INTEGER REFERENCES speakers(id),
        user_id INTEGER REFERENCES users(id),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        initial_battery_percentage INTEGER DEFAULT 100,
        final_battery_percentage INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create energy_measurements table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS energy_measurements (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES sessions(id),
        timestamp_seconds INTEGER NOT NULL,
        voltage_v DECIMAL(5,2) NOT NULL,
        current_ma DECIMAL(8,2) NOT NULL,
        power_mw DECIMAL(10,2) NOT NULL,
        battery_remaining_percent INTEGER NOT NULL,
        total_consumed_mah DECIMAL(10,2) NOT NULL,
        sample_index INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default users if they don't exist
    const existingUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers.rows[0].count) === 0) {
      const bcrypt = require('bcryptjs');
      
      const adminPassword = await bcrypt.hash('admin123', 10);
      const demoPassword = await bcrypt.hash('demo123', 10);

      await pool.query(`
        INSERT INTO users (username, email, password, role) VALUES
        ('admin', 'admin@test.com', $1, 'admin'),
        ('demo', 'demo@piensa.com', $2, 'user')
      `, [adminPassword, demoPassword]);

      console.log('✅ Default users created');
    }

    // Insert default speakers if they don't exist
    const existingSpeakers = await pool.query('SELECT COUNT(*) FROM speakers');
    if (parseInt(existingSpeakers.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO speakers (name, position, status) VALUES
        ('Speaker 01', 'North side', 'active'),
        ('Speaker 02', 'South side', 'active'),
        ('Speaker 03', 'Center', 'active'),
        ('Speaker 04', 'East side', 'active'),
        ('Speaker 05', 'West side', 'active')
      `);

      console.log('✅ Default speakers created');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

module.exports = {
  pool,
  initializeDatabase
};