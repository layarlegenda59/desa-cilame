const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const winston = require('winston');
const bcrypt = require('bcryptjs');
const config = require('../config/app');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Register new user
const register = catchAsync(async (req, res, next) => {
  const { username, email, password, full_name, phone, role } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new AppError('Email sudah terdaftar', 400));
  }
  
  const existingUsername = await User.findByUsername(username);
  if (existingUsername) {
    return next(new AppError('Username sudah digunakan', 400));
  }
  
  // Create user
  const userData = {
    username,
    email,
    password,
    full_name,
    phone,
    role: role || 'user'
  };
  
  const user = await User.create(userData);
  
  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });
  
  // Remove password from response
  delete user.password;
  
  logger.info(`User registered: ${user.email}`);
  
  res.status(201).json({
    success: true,
    message: 'User berhasil didaftarkan',
    data: {
      user,
      access_token: token,
      token_type: 'Bearer',
      expires_in: config.security.jwtExpiresIn
    }
  });
});

// Login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    return next(new AppError('Email atau password salah', 401));
  }
  
  // Check if user is active
  if (user.status !== 'active') {
    return next(new AppError('Akun Anda tidak aktif. Hubungi administrator', 401));
  }
  
  // Verify password
  const isPasswordValid = await User.comparePassword(password, user.password);
  if (!isPasswordValid) {
    return next(new AppError('Email atau password salah', 401));
  }
  
  // Update last login
  await User.updateLastLogin(user.id);
  
  // Generate token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });
  
  // Remove password from response
  delete user.password;
  
  logger.info(`User logged in: ${user.email}`);
  
  res.json({
    success: true,
    message: 'Login berhasil',
    data: {
      user,
      access_token: token,
      token_type: 'Bearer',
      expires_in: config.security.jwtExpiresIn
    }
  });
});

// Get current user profile
const getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  
  // Remove password from response
  delete user.password;
  
  res.json({
    success: true,
    data: { user }
  });
});

// Update user profile
const updateProfile = catchAsync(async (req, res, next) => {
  const { username, email, full_name, phone, bio, avatar } = req.body;
  
  // Check if email is being changed and already exists
  if (email && email !== req.user.email) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('Email sudah digunakan', 400));
    }
  }
  
  // Check if username is being changed and already exists
  if (username && username !== req.user.username) {
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return next(new AppError('Username sudah digunakan', 400));
    }
  }
  
  const updateData = {
    username,
    email,
    full_name,
    phone,
    bio,
    avatar
  };
  
  const updatedUser = await User.update(req.user.id, updateData);
  
  // Remove password from response
  delete updatedUser.password;
  
  logger.info(`User profile updated: ${updatedUser.email}`);
  
  res.json({
    success: true,
    message: 'Profil berhasil diperbarui',
    data: { user: updatedUser }
  });
});

// Change password
const changePassword = catchAsync(async (req, res, next) => {
  const { current_password, new_password } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  
  // Verify current password
  const isCurrentPasswordValid = await User.comparePassword(current_password, user.password);
  if (!isCurrentPasswordValid) {
    return next(new AppError('Password saat ini salah', 400));
  }
  
  // Update password
  await User.changePassword(req.user.id, new_password);
  
  logger.info(`Password changed for user: ${user.email}`);
  
  res.json({
    success: true,
    message: 'Password berhasil diubah'
  });
});

// Get all users (Admin only)
const getAllUsers = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    role,
    status,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = req.query;
  
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    role,
    status: status === 'active' ? true : status === 'inactive' ? false : undefined,
    search,
    sortBy,
    sortOrder
  };
  
  const result = await User.findAll(options);
  
  // Remove passwords from response
  result.data.forEach(user => delete user.password);
  
  res.json({
    success: true,
    data: result.data,
    pagination: result.pagination
  });
});

// Get user by ID (Admin only)
const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  
  // Remove password from response
  delete user.password;
  
  res.json({
    success: true,
    data: { user }
  });
});

// Update user (Admin only)
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { username, email, full_name, phone, role, is_active, bio, avatar } = req.body;
  
  // Check if user exists
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  
  // Check if email is being changed and already exists
  if (email && email !== existingUser.email) {
    const emailExists = await User.findByEmail(email);
    if (emailExists) {
      return next(new AppError('Email sudah digunakan', 400));
    }
  }
  
  // Check if username is being changed and already exists
  if (username && username !== existingUser.username) {
    const usernameExists = await User.findByUsername(username);
    if (usernameExists) {
      return next(new AppError('Username sudah digunakan', 400));
    }
  }
  
  const updateData = {
    username,
    email,
    full_name,
    phone,
    role,
    is_active,
    bio,
    avatar
  };
  
  const updatedUser = await User.update(id, updateData);
  
  // Remove password from response
  delete updatedUser.password;
  
  logger.info(`User updated by admin: ${updatedUser.email}`);
  
  res.json({
    success: true,
    message: 'User berhasil diperbarui',
    data: { user: updatedUser }
  });
});

// Delete user (Admin only)
const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { permanent = false } = req.query;
  
  // Check if user exists
  const user = await User.findById(id);
  if (!user) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  
  // Prevent admin from deleting themselves
  if (id == req.user.id) {
    return next(new AppError('Anda tidak dapat menghapus akun sendiri', 400));
  }
  
  if (permanent === 'true') {
    await User.permanentDelete(id);
    logger.info(`User permanently deleted: ${user.email}`);
  } else {
    await User.softDelete(id);
    logger.info(`User soft deleted: ${user.email}`);
  }
  
  res.json({
    success: true,
    message: permanent === 'true' ? 'User berhasil dihapus permanen' : 'User berhasil dinonaktifkan'
  });
});

// Restore deleted user (Admin only)
const restoreUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const updateData = { is_active: true };
  const restoredUser = await User.update(id, updateData);
  
  if (!restoredUser) {
    return next(new AppError('User tidak ditemukan', 404));
  }
  
  // Remove password from response
  delete restoredUser.password;
  
  logger.info(`User restored: ${restoredUser.email}`);
  
  res.json({
    success: true,
    message: 'User berhasil dipulihkan',
    data: { user: restoredUser }
  });
});

// Get user statistics (Admin only)
const getUserStats = catchAsync(async (req, res, next) => {
  const stats = await User.getStatistics();
  
  res.json({
    success: true,
    data: { statistics: stats }
  });
});

// Logout user
const logout = catchAsync(async (req, res, next) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just return a success message
  
  logger.info(`User logged out: ${req.user.email}`);
  
  res.json({
    success: true,
    message: 'Logout berhasil'
  });
});

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  restoreUser,
  getUserStats
};