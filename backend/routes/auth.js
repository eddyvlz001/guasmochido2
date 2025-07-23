const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory database simulation (en producción usarías MongoDB)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@test.com',
    password: '$2a$10$8PYZrzSVMJwLKFJUbX.gtuT7gGsMbH5W8jiPtBgdFjEyOPtpEGt9O', // admin123
    createdAt: new Date()
  },
  {
    id: 2,
    username: 'demo',
    email: 'demo@piensa.com',
    password: '$2a$10$vaGGZJMAfVHJiH9Ymzb3reKS.9KhaRMLThtmUN7eET2aax9mDlwVe', // demo123
    createdAt: new Date()
  }
];

let nextUserId = 3;

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
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({
        message: 'Usuario o email ya existe'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: nextUserId++,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      message: '¡Cuenta creada exitosamente!',
      token,
      refreshToken: 'mock-refresh-token',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
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
    const user = users.find(u => 
      u.email === userIdentifier || u.username === userIdentifier
    );

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

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
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

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
  }
});

// Get all users (protected route example)
router.get('/users', (req, res) => {
  const publicUsers = users.map(({ password, ...user }) => user);
  res.json(publicUsers);
});

module.exports = router;