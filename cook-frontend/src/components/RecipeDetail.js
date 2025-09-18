"use client"

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaClock, FaFire, FaUserFriends, FaListUl, FaBookOpen } from "react-icons/fa";
import "./RecipeDetail.css"; // Asegúrate de que la ruta sea correcta

const API_URL = "http://localhost:3001/api";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado de la navegación
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Leemos los ingredientes que se pasaron desde la página principal.
  // Si no hay estado (navegación directa), es un array vacío.
  const ingredientsFromHome = location.state?.selectedIngredients || [];

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_URL}/recipes/${id}`);
        if (!response.ok) {
          throw new Error(`No se pudo cargar la receta: ${response.status}`);
        }
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="loading"><div className="loading-spinner"></div><p>Cargando receta...</p></div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!recipe) return <div className="error">No se encontró la receta</div>;

  return (
    <div className="recipe-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Volver
      </button>

      <div className="recipe-header">
        <h1>{recipe.title}</h1>
        <img src={recipe.image || "/default-recipe.jpg"} alt={recipe.title} className="recipe-image" />
      </div>

      <div className="recipe-meta">
        <div className="meta-item"><FaClock /> {recipe.time}</div>
        <div className="meta-item"><FaUserFriends /> {recipe.servings} porciones</div>
        <div className="meta-item"><FaFire /> {recipe.difficulty}</div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h2><FaListUl /> Ingredientes</h2>
          <ul>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingrediente, index) => {
                // Comprobamos si el ingrediente de la receta está en la lista que nos llegó
                const hasIngredient = ingredientsFromHome.includes(ingrediente);
                
                return (
                  <li key={index} className={hasIngredient ? "ingredient-owned" : "ingredient-missing"}>
                    <span className="ingredient-check">
                      {hasIngredient ? '✓' : '✗'}
                    </span>
                    {ingrediente}
                  </li>
                );
              })
            ) : (
              <li>No se especificaron ingredientes</li>
            )}
          </ul>
        </div>

        <div className="instructions-section">
          <h2><FaBookOpen /> Preparación</h2>
          {recipe.preparationSteps ? (
            <div
              className="preparation-steps"
              dangerouslySetInnerHTML={{ __html: recipe.preparationSteps.replace(/\n/g, "<br />") }}
            />
          ) : (
            <p>No hay instrucciones de preparación disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
