const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const router = express.Router();

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Register endpoint
router.post('/register', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email y password son requeridos'
      });
    }

    if (password.length < 4 || password.length > 12) {
      return res.status(400).json({
        message: 'La contraseña debe tener entre 4 y 12 caracteres'
      });
    }

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'Usuario o email ya existe'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );

    const user = newUser.rows[0];

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: '¡Cuenta creada exitosamente!',
      token,
      refreshToken: 'mock-refresh-token',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  } finally {
    client.release();
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { usernameOrEmail, email, password } = req.body;
    
    // Support both usernameOrEmail and email fields
    const userIdentifier = usernameOrEmail || email;

    // Validation
    if (!userIdentifier || !password) {
      return res.status(400).json({
        message: 'Email/username y password son requeridos'
      });
    }

    // Find user
    const result = await client.query(
      'SELECT id, username, email, password FROM users WHERE email = $1 OR username = $1',
      [userIdentifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login exitoso',
      token,
      refreshToken: 'mock-refresh-token',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  } finally {
    client.release();
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const result = await client.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(401).json({ 
      valid: false, 
      message: 'Token inválido' 
    });
  } finally {
    client.release();
  }
});

// Get all users (protected route example)
router.get('/users', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios'
    });
  } finally {
    client.release();
  }
});

module.exports = router;