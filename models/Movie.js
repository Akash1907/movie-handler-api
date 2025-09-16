const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide movie title'],
    trim: true,
    maxlength: [200, 'Movie title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide movie description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  genre: [{
    type: String,
    required: [true, 'Please provide at least one genre'],
    enum: [
      'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 
      'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 
      'History', 'Horror', 'Music', 'Mystery', 'Romance', 
      'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
    ]
  }],
  director: {
    type: String,
    required: [true, 'Please provide director name'],
    trim: true,
    maxlength: [100, 'Director name cannot be more than 100 characters']
  },
  cast: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      trim: true
    }
  }],
  rating: {
    type: Number,
    required: [true, 'Please provide movie rating'],
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot be more than 10']
  },
  duration: {
    type: Number,
    required: [true, 'Please provide movie duration in minutes'],
    min: [1, 'Duration must be at least 1 minute']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please provide release date']
  },
  language: {
    type: String,
    required: [true, 'Please provide movie language'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please provide country of origin'],
    trim: true
  },
  posterUrl: {
    type: String,
    required: [true, 'Please provide poster URL'],
    match: [
      /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
      'Please provide a valid image URL'
    ]
  },
  trailerUrl: {
    type: String,
    match: [
      /^https?:\/\/.+/,
      'Please provide a valid URL'
    ]
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative']
  },
  boxOffice: {
    type: Number,
    min: [0, 'Box office cannot be negative']
  },
  awards: [{
    name: String,
    year: Number,
    category: String
  }],
  imdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming-soon'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ createdBy: 1 });

// Virtual for movie age
movieSchema.virtual('movieAge').get(function() {
  const now = new Date();
  const releaseYear = this.releaseDate.getFullYear();
  const currentYear = now.getFullYear();
  return currentYear - releaseYear;
});

// Pre-save middleware
movieSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedBy = this.createdBy; // Will be overridden by controller
  }
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
