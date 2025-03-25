import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    difficulty: '',
    ingredients: [''],
    steps: [''],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
    setError(null);
  }

  function handleArrayChange(e, index, key) {
    const { value } = e.target;
    setRecipe(prev => {
      const updatedArray = [...prev[key]];
      updatedArray[index] = value;
      return { ...prev, [key]: updatedArray };
    });
  }

  function addArrayItem(key) {
    setRecipe(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  }

  function removeArrayItem(index, key) {
    setRecipe(prev => {
      const updatedArray = [...prev[key]];
      updatedArray.splice(index, 1);
      return { ...prev, [key]: updatedArray };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Filter empty values and trim
    const dataToSend = {
      ...recipe,
      name: recipe.name.trim(),
      description: recipe.description.trim(),
      ingredients: recipe.ingredients
        .map(i => i.trim())
        .filter(i => i !== ''),
      steps: recipe.steps
        .map(s => s.trim())
        .filter(s => s !== '')
    };

    // Validate
    if (!dataToSend.name || !dataToSend.description || !dataToSend.difficulty) {
      setError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    if (dataToSend.ingredients.length === 0 || dataToSend.steps.length === 0) {
      setError('Please add at least one ingredient and one step');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8001/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add recipe');
      }

      navigate('/');
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to add recipe');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="add-recipe-container">
      <h1>Add New Recipe</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Name: *
            <input
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Description: *
            <textarea
              name="description"
              value={recipe.description}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Difficulty: *
            <select
              name="difficulty"
              value={recipe.difficulty}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            >
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>

        <div className="array-section">
          <h3>Ingredients *</h3>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange(e, index, 'ingredients')}
                required
                disabled={isSubmitting}
              />
              {recipe.ingredients.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeArrayItem(index, 'ingredients')}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => addArrayItem('ingredients')}
            disabled={isSubmitting}
          >
            Add Ingredient
          </button>
        </div>

        <div className="array-section">
          <h3>Steps *</h3>
          {recipe.steps.map((step, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={step}
                onChange={(e) => handleArrayChange(e, index, 'steps')}
                required
                disabled={isSubmitting}
              />
              {recipe.steps.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeArrayItem(index, 'steps')}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => addArrayItem('steps')}
            disabled={isSubmitting}
          >
            Add Step
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Adding...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;