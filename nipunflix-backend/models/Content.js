const mongoose = require('mongoose');
const validator = require('validator');

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['movie', 'tv-show', 'anime'],
    required: true
  },
  genre: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one genre is required'
    }
  },
  description: {
    type: String,
    required: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  releaseDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 minute']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [10, 'Rating cannot exceed 10']
  },
  contentRating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    required: true
  },
  thumbnail: {
    url: {
      type: String,
      required: true,
      validate: [validator.isURL, 'Invalid thumbnail URL']
    },
    altText: String
  },
  video: {
    url: {
      type: String,
      required: true,
      validate: [validator.isURL, 'Invalid video URL']
    },
    quality: {
      type: [String],
      enum: ['SD', 'HD', '4K', 'HDR']
    }
  },
  availability: {
    plans: {
      type: [String],
      enum: ['free', 'basic', 'premium'],
      required: true
    },
    regions: {
      type: [String],
      default: ['ALL']
    }
  },
  cast: [{
    name: String,
    role: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Text search indexes
ContentSchema.index({ title: 'text', description: 'text', genre: 'text' });

// Compound indexes
ContentSchema.index({ type: 1, releaseDate: -1 });
ContentSchema.index({ 'availability.plans': 1, type: 1 });

module.exports = mongoose.model('Content', ContentSchema);