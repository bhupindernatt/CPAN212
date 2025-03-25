import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ListRecipe.css';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track which recipe is being deleted

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:8001/recipe');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return; // Exit if user cancels
    }

    setDeletingId(recipeId); // Mark this recipe as being deleted
    
    try {
      const response = await fetch(`http://localhost:8001/recipe/${recipeId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Optimistically remove the recipe from state
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (err) {
      console.error('Delete error:', err);
      setError(`Failed to delete recipe: ${err.message}`);
    } finally {
      setDeletingId(null); // Reset deleting state
    }
  };

  const ListRecipe = ({ recipe, onDelete, isDeleting }) => {
    return (
      <div className="recipe-card">
        <h2>{recipe.name}</h2>
        <p>{recipe.description}</p>
        <div className="recipe-actions">
          <Link to={`/recipes/${recipe._id}`}>View</Link>
          <Link to={`/recipes/${recipe._id}/edit`}>Edit</Link>
          <button 
            onClick={() => onDelete(recipe._id)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="recipe-list-container">
      <h1>All Recipes</h1>
      <Link to="/recipes/new">Add New Recipe</Link>
      
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <ListRecipe 
            key={recipe._id} 
            recipe={recipe} 
            onDelete={handleDeleteRecipe}
            isDeleting={deletingId === recipe._id}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;