import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Recipe name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  ingredients: {
    type: [String],
    validate: {
      validator: v => v.length > 0,
      message: 'At least one ingredient is required'
    }
  },
  steps: {
    type: [String],
    validate: {
      validator: v => v.length > 0,
      message: 'At least one step is required'
    }
  }
}, { 
  collection: 'recipe', // Explicit collection name
  timestamps: true 
});

export default mongoose.model('Recipe', recipeSchema);