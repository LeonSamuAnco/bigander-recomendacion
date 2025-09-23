"use client"

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../App.css"; // Usa los estilos globales

const API_URL = "http://localhost:3002";

const getEmojiForIngredient = (name) => {
    const emojiMap = { "Pollo": "🐔", "Tomate": "🍅", "Cebolla": "🧅", "Ajo": "🧄", "Arroz": "🍚", "Pasta": "🍝", "Fideos": "🍝", "Queso": "🧀", "Huevos": "🥚", "Pescado": "🐟", "Verduras": "🥬", "Limón": "🍋", "Aceite": "🫒", "Carne de res": "🥩", "Papa": "🥔", "Camote": "🍠", "Zanahoria": "🥕", "Apio": "🥬", "Sal": "🧂", "Pimienta": "🌶️", "Comino": "🌿", "Ají amarillo": "🌶️", "Culantro": "🌿", "Leche": "🥛", "Agua": "💧" };
    return emojiMap[name] || "🍴";
};

const HomePage = () => {
  const [allIngredients, setAllIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showIngredients, setShowIngredients] = useState(false);
  const navigate = useNavigate();

  // --- Lógica de fetch (sin cambios) ---
  useEffect(() => {
    fetch(`${API_URL}/ingredients`).then(res => res.json()).then(data => {
      if (Array.isArray(data)) {
        const ingredientsWithEmojis = data.map(ing => ({ id: ing.id, name: ing.nombre, emoji: getEmojiForIngredient(ing.nombre) }));
        setAllIngredients(ingredientsWithEmojis);
      }
    }).catch(error => console.error("Error fetching ingredients:", error));
  }, []);

  useEffect(() => {
    let url = `${API_URL}/recipes`;
    if (selectedIngredients.length > 0) {
      url += `?ingredients=${selectedIngredients.join(',')}`;
    }
    fetch(url).then(res => res.json()).then(data => {
      if (Array.isArray(data)) setRecipes(data);
      else setRecipes([]);
    }).catch(error => {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    });
  }, [selectedIngredients]);

  const toggleIngredient = (ingredientName) => {
    const newSelected = selectedIngredients.includes(ingredientName)
      ? selectedIngredients.filter((ing) => ing !== ingredientName)
      : [...selectedIngredients, ingredientName];
    setSelectedIngredients(newSelected);
  };

  const clearIngredients = () => setSelectedIngredients([]);

  const handleNavigateToRecipe = (recipeId) => {
    navigate(`/receta/${recipeId}`, { state: { selectedIngredients } });
  };
  
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">🍳 RecetasFun</h1>
          <p className="subtitle">¡Descubre recetas deliciosas con tus ingredientes favoritos!</p>
        </header>

        <main>
          {/* --- SECCIÓN DE INGREDIENTES (JSX Original) --- */}
          <div className="ingredients-section">
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Selecciona tus ingredientes</h2>
              {selectedIngredients.length > 0 && (
                <button
                  onClick={clearIngredients}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                    background: "transparent",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    cursor: "pointer",
                    color: "var(--dark-gray)",
                  }}
                >
                  Limpiar todo
                </button>
              )}
            </div>

            <button onClick={() => setShowIngredients(!showIngredients)} className="ingredients-button">
              <span style={{ marginRight: "8px" }}>🍳</span>
              {showIngredients ? "Ocultar ingredientes" : "Mostrar ingredientes"}
              {selectedIngredients.length > 0 && (
                <span
                  style={{
                    marginLeft: "10px",
                    background: "var(--warm-yellow)",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  {selectedIngredients.length}
                </span>
              )}
            </button>

            {showIngredients && (
              <div className="ingredients-grid">
                {allIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient.name)}
                    className={`ingredient-item ${selectedIngredients.includes(ingredient.name) ? "selected" : ""}`}
                  >
                    <span className="ingredient-emoji">{ingredient.emoji}</span>
                    <span className="ingredient-name">{ingredient.name}</span>
                  </div>
                ))}
              </div>
            )}

            {selectedIngredients.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "10px" }}>
                  Ingredientes seleccionados:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {selectedIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      style={{
                        background: "var(--soft-pink)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {ingredient}
                      <button
                        onClick={() => toggleIngredient(ingredient)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* --- SECCIÓN DE RECETAS (JSX Original Restaurado) --- */}
          <div>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}
            >
              <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", margin: 0, color: "var(--dark-gray)" }}>
                Recetas recomendadas
                {selectedIngredients.length > 0 && (
                  <span style={{ fontSize: "1.2rem", color: "#6b7280", marginLeft: "10px" }}>
                    ({recipes.length} encontradas)
                  </span>
                )}
              </h2>
            </div>

            {recipes.length === 0 && selectedIngredients.length > 0 ? (
              <div className="no-recipes">
                <span className="no-recipes-emoji">👨‍🍳</span>
                <p className="no-recipes-text">No encontramos recetas con esos ingredientes</p>
                <p className="no-recipes-subtext">¡Prueba con otros ingredientes!</p>
              </div>
            ) : (
              <div className="recipes-grid">
                {recipes.map((recipe) => (
                  // ---> ESTE ES EL JSX IDÉNTICO AL DE TU DISEÑO ORIGINAL <---
                  <div key={recipe.id} className="recipe-card">
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="recipe-image" />
                      <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                        <button
                          style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "none",
                            padding: "8px",
                            borderRadius: "50%",
                            cursor: "pointer",
                            fontSize: "1.2rem",
                          }}
                        >
                          ❤️
                        </button>
                      </div>
                    </div>

                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <p className="recipe-description">{recipe.description}</p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          color: "#6b7280",
                          marginBottom: "15px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>⏰</span>
                          <span>{recipe.time}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>👥</span>
                          <span>{recipe.servings} personas</span>
                        </div>
                        <span
                          style={{
                            background: "var(--cream-white)",
                            color: "var(--dark-gray)",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          {recipe.difficulty}
                        </span>
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "8px" }}>Ingredientes:</p>
                        <div className="recipe-ingredients">
                          {recipe.ingredients.slice(0, 3).map((ingredient) => (
                            <span
                              key={ingredient}
                              className={`recipe-ingredient-tag ${
                                selectedIngredients.includes(ingredient) ? "selected" : ""
                              }`}
                              style={
                                selectedIngredients.includes(ingredient)
                                  ? {
                                      background: "var(--soft-pink)",
                                      color: "white",
                                      borderColor: "var(--soft-pink)",
                                    }
                                  : {}
                              }
                            >
                              {ingredient}
                            </span>
                          ))}
                           {recipe.ingredients.length > 3 && (
                            <span className="recipe-ingredient-tag">
                              +{recipe.ingredients.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleNavigateToRecipe(recipe.id)}
                        style={{
                          width: "100%",
                          background: "var(--warm-yellow)",
                          color: "white",
                          border: "none",
                          padding: "12px",
                          borderRadius: "12px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        Ver receta completa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
