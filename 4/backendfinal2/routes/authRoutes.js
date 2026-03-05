const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', (req, res) => {
  try {
    res.json({ failed: false, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
