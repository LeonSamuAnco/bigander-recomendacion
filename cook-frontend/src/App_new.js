"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/dashboard/Dashboard"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import RecipesPage from "./components/recipes/RecipesPage"
import FavoritesPage from "./components/favorites/FavoritesPage"
import favoritesService from "./services/favoritesService"
import { AuthProvider, useAuth } from "./context/AuthContext"
import "./App.css"
import RecipeDetail from "./components/RecipeDetail"

const API_URL = "http://localhost:3002"

const getEmojiForIngredient = (name) => {
  const emojiMap = {
    Pollo: "🐔",
    Tomate: "🍅",
    Cebolla: "🧅",
    Ajo: "🧄",
    Arroz: "🍚",
    Pasta: "🍝",
    Fideos: "🍝",
    Papas: "🥔",
    Zanahoria: "🥕",
    Apio: "🥬",
    Pimiento: "🫑",
    Limón: "🍋",
    Aceite: "🫒",
    Sal: "🧂",
    Pimienta: "⚫",
    Comino: "🌰",
    "Ají amarillo": "🌶️",
    Culantro: "🌿",
    Leche: "🥛",
    Agua: "💧",
  }
  return emojiMap[name] || "🍴"
}

const TopBar = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, getDashboardRoute } = useAuth()

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate(getDashboardRoute())
    } else {
      navigate("/")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header
      style={{
        background: "linear-gradient(135deg, #dc2626, #f59e0b)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(220, 38, 38, 0.2)",
        position: "relative",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "1.8rem",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onClick={handleLogoClick}
        title={isAuthenticated ? "Ir al Dashboard" : "Ir al Inicio"}
      >
        🍳 CookSync
      </div>

      <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "0.95rem",
            transition: "all 0.3s ease",
          }}
        >
          🏠 Inicio
        </button>
        <button
          onClick={() => navigate("/recetas")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "0.95rem",
            transition: "all 0.3s ease",
          }}
        >
          📖 Recetas
        </button>
        <button
          onClick={() => navigate("/favoritas")}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "0.95rem",
            transition: "all 0.3s ease",
          }}
        >
          💖 Favoritas
        </button>

        {/* Mostrar diferentes opciones según autenticación */}
        {isAuthenticated ? (
          <>
            <div style={{
              color: "white",
              fontSize: "0.9rem",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              👋 {user?.nombres || 'Usuario'}
            </div>
            <button
              onClick={() => navigate(getDashboardRoute())}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              📊 Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "rgba(255, 107, 107, 0.8)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              🚪 Salir
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
                e.target.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                e.target.style.transform = "translateY(0)"
              }}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate("/registro")}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "none",
                color: "#dc2626",
                padding: "0.75rem 1.5rem",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "white"
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.15)"
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
                e.target.style.transform = "translateY(0)"
                e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              Registrarse
            </button>
          </>
        )}
      </nav>
    </header>
  )
}

const HomePage = () => {
  const [allIngredients, setAllIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [showIngredients, setShowIngredients] = useState(false)
  const [favorites, setFavorites] = useState({}) // Estado para manejar favoritas {recipeId: boolean}
  const [loadingFavorites, setLoadingFavorites] = useState({}) // Estado para loading de favoritas

  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/recipes/ingredients/all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const ingredientsWithEmojis = data.map((ing) => ({
            id: ing.id,
            name: ing.nombre,
            emoji: getEmojiForIngredient(ing.nombre),
          }))
          setAllIngredients(ingredientsWithEmojis)
        }
      })
      .catch((error) => console.error("Error fetching ingredients:", error))
  }, [])

  useEffect(() => {
    let url = `${API_URL}/recipes`

    if (selectedIngredients.length > 0) {
      url = `${API_URL}/recipes/by-ingredients?ingredients=${selectedIngredients.join(",")}`
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Para la nueva API, las recetas pueden estar en data.recipes o directamente en data
        const recipesArray = data.recipes || data
        if (Array.isArray(recipesArray)) {
          setRecipes(recipesArray)
        } else {
          console.error("La respuesta de la API de recetas no es un arreglo:", data)
          setRecipes([])
        }
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error)
        setRecipes([])
      })
  }, [selectedIngredients])

  // Cargar estado de favoritas cuando cambien las recetas
  useEffect(() => {
    if (recipes.length > 0) {
      loadFavoritesStatus(recipes);
    }
  }, [recipes])

  const toggleIngredient = (ingredientName) => {
    const newSelected = selectedIngredients.includes(ingredientName)
      ? selectedIngredients.filter((ing) => ing !== ingredientName)
      : [...selectedIngredients, ingredientName]

    setSelectedIngredients(newSelected)
  }

  const clearIngredients = () => {
    setSelectedIngredients([])
  }

  const handleRecipeClick = (recipe) => {
    navigate(`/receta/${recipe.id}`, { state: { selectedIngredients } })
  }

  // Función para cargar el estado de favoritas de las recetas actuales
  const loadFavoritesStatus = async (recipesToCheck) => {
    if (!recipesToCheck || recipesToCheck.length === 0) return;
    
    try {
      const recipeIds = recipesToCheck.map(recipe => recipe.id);
      const favoritesStatus = await favoritesService.checkMultipleFavorites(recipeIds);
      setFavorites(prevFavorites => ({
        ...prevFavorites,
        ...favoritesStatus
      }));
    } catch (error) {
      console.error('Error cargando estado de favoritas:', error);
    }
  }

  // Función para alternar favorita
  const handleToggleFavorite = async (recipeId, event) => {
    event.stopPropagation(); // Evitar que se active el click de la receta
    
    setLoadingFavorites(prev => ({ ...prev, [recipeId]: true }));
    
    try {
      const currentIsFavorite = favorites[recipeId] || false;
      const response = await favoritesService.toggleFavorite(recipeId, currentIsFavorite);
      
      // Actualizar el estado local
      setFavorites(prev => ({
        ...prev,
        [recipeId]: response.isFavorite
      }));
      
      // Mostrar mensaje de éxito (opcional)
      console.log(response.message);
      
    } catch (error) {
      console.error('Error al cambiar favorita:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setLoadingFavorites(prev => ({ ...prev, [recipeId]: false }));
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">🍳 RecetasFun</h1>
          <p className="subtitle">¡Descubre recetas deliciosas con tus ingredientes favoritos!</p>
        </header>

        <main>
          <div className="ingredients-section">
            <div className="ingredients-header">
              <h2>Ingredientes disponibles</h2>
              <button
                onClick={() => setShowIngredients(!showIngredients)}
                className="toggle-ingredients-btn"
                style={{
                  background: showIngredients ? "var(--soft-pink)" : "var(--warm-yellow)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {showIngredients ? "Ocultar ingredientes" : "Mostrar ingredientes"}
              </button>
            </div>

            {showIngredients && (
              <div className="ingredients-grid">
                {allIngredients.map((ingredient) => (
                  <span
                    key={ingredient.id}
                    className={`ingredient-tag ${
                      selectedIngredients.includes(ingredient.name) ? "selected" : ""
                    }`}
                    onClick={() => toggleIngredient(ingredient.name)}
                    style={{
                      background: selectedIngredients.includes(ingredient.name)
                        ? "var(--soft-pink)"
                        : "white",
                      color: selectedIngredients.includes(ingredient.name) ? "white" : "var(--dark-gray)",
                      border: selectedIngredients.includes(ingredient.name)
                        ? "2px solid var(--soft-pink)"
                        : "2px solid var(--light-gray)",
                      padding: "0.75rem 1rem",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      boxShadow: selectedIngredients.includes(ingredient.name)
                        ? "0 4px 15px rgba(255, 107, 107, 0.3)"
                        : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      transform: selectedIngredients.includes(ingredient.name) ? "translateY(-2px)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{ingredient.emoji}</span>
                    {ingredient.name}
                    {selectedIngredients.includes(ingredient.name) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleIngredient(ingredient.name)
                        }}
                        style={{
                          background: "rgba(255, 255, 255, 0.2)",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="recipes-section">
            <div className="recipes-header">
              <h2>
                {selectedIngredients.length > 0
                  ? `Recetas con: ${selectedIngredients.join(", ")}`
                  : "Todas las recetas"}
              </h2>
              {selectedIngredients.length > 0 && (
                <button
                  onClick={clearIngredients}
                  className="clear-btn"
                  style={{
                    background: "var(--soft-pink)",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {recipes.length === 0 ? (
              <div className="no-recipes">
                <span className="no-recipes-emoji">👨‍🍳</span>
                <p className="no-recipes-text">No encontramos recetas con esos ingredientes</p>
                <p className="no-recipes-subtext">¡Prueba con otros ingredientes!</p>
              </div>
            ) : (
              <div className="recipes-grid">
                {recipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img src={recipe.imagenPrincipal || recipe.image || "/placeholder.svg"} alt={recipe.nombre || recipe.title} className="recipe-image" />
                      <div style={{ position: "absolute", top: "15px", right: "15px" }}>
                        <button
                          onClick={(e) => handleToggleFavorite(recipe.id, e)}
                          disabled={loadingFavorites[recipe.id]}
                          style={{
                            background: favorites[recipe.id] 
                              ? "rgba(255, 107, 107, 0.9)" 
                              : "rgba(255, 255, 255, 0.9)",
                            border: "none",
                            padding: "8px",
                            borderRadius: "50%",
                            cursor: loadingFavorites[recipe.id] ? "not-allowed" : "pointer",
                            fontSize: "1.2rem",
                            opacity: loadingFavorites[recipe.id] ? 0.6 : 1,
                            transform: favorites[recipe.id] ? "scale(1.1)" : "scale(1)",
                            transition: "all 0.2s ease",
                          }}
                          title={favorites[recipe.id] ? "Quitar de favoritas" : "Agregar a favoritas"}
                        >
                          {loadingFavorites[recipe.id] ? "⏳" : (favorites[recipe.id] ? "💖" : "🤍")}
                        </button>
                      </div>
                    </div>

                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.nombre || recipe.title}</h3>
                      <p className="recipe-description">{recipe.descripcion || recipe.description}</p>

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
                          <span>{recipe.tiempoTotal || recipe.time || 'N/A'} min</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>👥</span>
                          <span>{recipe.porciones || recipe.servings || 'N/A'} personas</span>
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
                          {recipe.dificultad?.nivel || recipe.difficulty || 'Medio'}
                        </span>
                      </div>

                      <div style={{ marginBottom: "20px" }}>
                        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "8px" }}>Ingredientes:</p>
                        <div className="recipe-ingredients">
                          {(recipe.ingredientes || recipe.ingredients || []).map((ingredient, index) => {
                            const ingredientName = ingredient.ingredienteMaestro?.nombre || ingredient.nombre || ingredient;
                            return (
                              <span
                                key={index}
                                className={`recipe-ingredient-tag ${
                                  selectedIngredients.includes(ingredientName) ? "selected" : ""
                                }`}
                                style={
                                  selectedIngredients.includes(ingredientName)
                                    ? {
                                        background: "var(--soft-pink)",
                                        color: "white",
                                        borderColor: "var(--soft-pink)",
                                      }
                                    : {}
                                }
                              >
                                {ingredientName}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRecipeClick(recipe)}
                        style={{
                          width: "100%",
                          background: "var(--warm-yellow)",
                          color: "white",
                          border: "none",
                          padding: "0.75rem",
                          borderRadius: "12px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: "600",
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
  )
}

const AppContent = () => {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <h2>🍳 CookSync</h2>
          <p>Cargando tu experiencia culinaria...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Rutas con TopBar para usuarios no autenticados */}
        <Route path="/home" element={
          <>
            <TopBar />
            <div style={{ minHeight: "calc(100vh - 80px)" }}>
              <HomePage />
            </div>
          </>
        } />
        <Route path="/receta/:id" element={
          <>
            <TopBar />
            <div style={{ minHeight: "calc(100vh - 80px)" }}>
              <RecipeDetail />
            </div>
          </>
        } />
        <Route path="/recetas" element={
          <>
            <TopBar />
            <div style={{ minHeight: "calc(100vh - 80px)" }}>
              <RecipesPage />
            </div>
          </>
        } />
        <Route path="/favoritas" element={
          <>
            <TopBar />
            <div style={{ minHeight: "calc(100vh - 80px)" }}>
              <FavoritesPage />
            </div>
          </>
        } />
        
        {/* Dashboard protegido para todos los usuarios autenticados */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['CLIENTE', 'VENDEDOR', 'ADMIN', 'MODERADOR']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Rutas específicas por rol */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/moderador/*" element={
          <ProtectedRoute allowedRoles={['MODERADOR']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/vendedor/*" element={
          <ProtectedRoute allowedRoles={['VENDEDOR']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/cliente/*" element={
          <ProtectedRoute allowedRoles={['CLIENTE']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Redireccionamiento por defecto */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AuthProvider>
  )
}

export default App
