const validateSignup = (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Validate role if provided
  if (role && !['customer', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['customer', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  next();
};

module.exports = { validateSignup, validateLogin }; 