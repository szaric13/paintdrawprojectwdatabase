const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const userSchema = z.object({
  username: z.string().min(2, 'username mora imati bar 2 karaktera').max(32, 'username ne sme imati preko 32 karaktera'),
  password: z.string().min(8, 'minimalno 8 karaktera za sifru').max(128, 'maksimalno 128 karaktera za sifru'),
  confirm_password: z.string().min(8, 'minimalno 8 karaktera za sifru').max(128, 'maksimalno 128 karaktera za sifru')
}).refine((data) => data.password === data.confirm_password, {
  message: 'sifre nisu iste',
  path: ['confirm_password'],
});
const register = async (req, res) => {
  try {
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        failed: true,
        code: 'INVALID_DATA',
        extra: validation.error.errors
      });
    }
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ failed: true, code: 'DUPLICATE_USERNAME' });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ failed: false, user_id: newUser._id });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};
const loginSchema = z.object({
  username: z.string().min(2, 'username mora imati bar 2 karaktera').max(32, 'username ne sme imati preko 32 karaktera'),
  password: z.string().min(8, 'minimalno 8 karaktera za sifru').max(128, 'maksimalno 128 karaktera za sifru'),
});
const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        failed: true,
        code: 'INVALID_DATA',
        extra: validation.error.errors
      });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ failed: true, code: 'INCORRECT_CREDENTIALS' });
    }

    const token = jwt.sign({ user_id: user._id, username: user.username }, 'secret_key');
    res.json({ failed: false, token, user_id: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ failed: true, code: 'INTERNAL_ERROR' });
  }
};

module.exports = { register, login };
