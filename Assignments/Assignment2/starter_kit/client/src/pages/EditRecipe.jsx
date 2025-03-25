import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RecipeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    difficulty: 'Easy',
    ingredients: [''],
    steps: ['']
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8001/recipe/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRecipe({
          ...data,
          ingredients: data.ingredients.length > 0 ? data.ingredients : [''],
          steps: data.steps.length > 0 ? data.steps : ['']
        });
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    setRecipe(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setRecipe(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index, field) => {
    if (recipe[field].length <= 1) return; // Keep at least one item
    setRecipe(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...recipe,
        ingredients: recipe.ingredients.filter(i => i.trim() !== ''),
        steps: recipe.steps.filter(s => s.trim() !== '')
      };

      const response = await fetch(`http://localhost:8001/recipe/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update recipe');
      }

      navigate('/'); // Navigate to home after successful update
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading recipe...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="recipe-edit">
      <h1>Edit Recipe</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Name field */}
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

        {/* Description field */}
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

        {/* Difficulty field */}
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
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>

        {/* Ingredients section */}
        <div className="array-section">
          <h3>Ingredients *</h3>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
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

        {/* Steps section */}
        <div className="array-section">
          <h3>Steps *</h3>
          {recipe.steps.map((step, index) => (
            <div key={index} className="array-item">
              <textarea
                value={step}
                onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
                required
                disabled={isSubmitting}
                rows={3}
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

        {/* Submit button */}
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Saving...' : 'Save Recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecipeEdit;