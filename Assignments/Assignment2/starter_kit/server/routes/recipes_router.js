import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// Helper function to clean recipe data
const cleanRecipeData = (data) => ({
  name: data.name?.trim(),
  description: data.description?.trim(),
  difficulty: data.difficulty,
  ingredients: data.ingredients?.map(i => i.trim()).filter(i => i),
  steps: data.steps?.map(s => s.trim()).filter(s => s),
  cookingTime: data.cookingTime
});

// Validate recipe data
const validateRecipe = (data) => {
  if (!data.name || !data.description || !data.difficulty) {
    return "Missing required fields";
  }
  if (data.cookingTime && (isNaN(data.cookingTime) || data.cookingTime <= 0)) {
    return "Invalid cooking time";
  }
  return null;
};

// CREATE
router.post('/', async (req, res) => {
  try {
    const recipeData = cleanRecipeData(req.body);
    const validationError = validateRecipe(recipeData);
    if (validationError) return res.status(400).json({ error: validationError });

    const recipe = await Recipe.create(recipeData);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ 
      error: "Failed to create recipe",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    res.json(await Recipe.find({}));
  } catch (err) {
    res.status(500).json({ 
      error: "Failed to fetch recipes",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    recipe ? res.json(recipe) : res.status(404).json({ error: "Recipe not found" });
  } catch (err) {
    res.status(400).json({
      error: "Failed to fetch recipe",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const recipeData = cleanRecipeData(req.body);
    const validationError = validateRecipe(recipeData);
    if (validationError) return res.status(400).json({ error: validationError });

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      recipeData,
      { new: true, runValidators: true }
    );
    recipe ? res.json(recipe) : res.status(404).json({ error: "Recipe not found" });
  } catch (err) {
    res.status(400).json({ 
      error: "Failed to update recipe",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    recipe ? res.json({ message: "Recipe deleted" }) : res.status(404).json({ error: "Recipe not found" });
  } catch (err) {
    res.status(400).json({
      error: "Failed to delete recipe",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;