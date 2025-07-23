const express = require('express');
const router = express.Router();

// Mock users data
const users = [
  { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' },
  { id: 2, username: 'demo', email: 'demo@piensa.com', role: 'user' }
];

// Get all users
router.get('/', (req, res) => {
  res.json({
    users: users,
    total: users.length
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  
  res.json(user);
});

module.exports = router;