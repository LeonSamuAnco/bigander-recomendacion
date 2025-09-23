"use client"

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaClock, FaFire, FaUserFriends, FaListUl, FaBookOpen } from "react-icons/fa";
import "./RecipeDetail.css"; // Asegúrate de que la ruta sea correcta

const API_URL = "http://localhost:3002";

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
        console.log(`Fetching recipe with ID: ${id}`);
        console.log(`API URL: ${API_URL}/recipes/${id}`);
        
        const response = await fetch(`${API_URL}/recipes/${id}`);
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`No se pudo cargar la receta: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Recipe data received:', data);
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        
        // Fallback: crear una receta de ejemplo si falla la carga
        const fallbackRecipe = {
          id: parseInt(id),
          titulo: `Receta ${id}`,
          descripcion: 'Esta es una receta de ejemplo mientras se resuelve la conexión con el backend.',
          tiempoPreparacion: 30,
          porciones: 4,
          dificultad: { nombre: 'Medio' },
          categoria: { nombre: 'Plato Principal' },
          autor: { nombres: 'Chef', apellidos: 'Admin' },
          imagenUrl: null,
          ingredientes: [
            {
              cantidad: '500g',
              unidadMedida: { nombre: 'gramos' },
              ingredienteMaestro: { nombre: 'Ingrediente principal' }
            }
          ],
          instrucciones: [
            { paso: 1, descripcion: 'Preparar los ingredientes.' },
            { paso: 2, descripcion: 'Cocinar según las instrucciones.' },
            { paso: 3, descripcion: 'Servir y disfrutar.' }
          ]
        };
        
        setRecipe(fallbackRecipe);
        setError(`⚠️ Usando datos de ejemplo - Backend no disponible (${err.message})`);
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
