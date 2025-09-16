const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  handleValidationErrors
];

// Movie validation rules
const validateMovie = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('director')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Director name must be between 1 and 100 characters'),
  body('rating')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('releaseDate')
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid release date'),
  body('language')
    .trim()
    .notEmpty()
    .withMessage('Language is required'),
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('posterUrl')
    .isURL()
    .withMessage('Please provide a valid poster URL'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid trailer URL'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget cannot be negative'),
  body('boxOffice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Box office cannot be negative'),
  handleValidationErrors
];

const validateMovieUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('genre')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('director')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Director name must be between 1 and 100 characters'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('releaseDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Please provide a valid release date'),
  body('language')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Language is required'),
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('posterUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid poster URL'),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid trailer URL'),
  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Budget cannot be negative'),
  body('boxOffice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Box office cannot be negative'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateMovie,
  validateMovieUpdate,
  handleValidationErrors
};
