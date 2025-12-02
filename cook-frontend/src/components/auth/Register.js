import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./AuthForms.css"

const Register = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    tipoDocumentoId: 1, // Default to DNI
    numeroDocumento: "",
    telefono: "",
    fechaNacimiento: "",
    genero: "O",
    aceptaTerminos: false,
    aceptaMarketing: false,
    rolId: 1, // Cliente por defecto
    nombreTienda: "",
    horarioAtencion: "",
    metodosPago: "",
    tipoServicio: "Ambos",
    whatsapp: "",
    instagram: "",
    facebook: "",
    sitioWeb: "",
    direccionNegocio: "",
  })
  const [horarioDias, setHorarioDias] = useState({
    Lun: true, Mar: true, Mie: true, Jue: true, Vie: true, Sab: false, Dom: false
  })
  const [horarioInicio, setHorarioInicio] = useState("09:00")
  const [horarioFin, setHorarioFin] = useState("18:00")

  const [metodosPagoSeleccionados, setMetodosPagoSeleccionados] = useState({
    Yape: false, Plin: false, Efectivo: false, Tarjeta: false, Transferencia: false
  })
  const [roles, setRoles] = useState([])
  const [documentTypes, setDocumentTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  // Function to get icon for category
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Celulares': '📱',
      'Tortas': '🧁',
      'Lugares': '🏡',
      'Salud & Belleza': '🧴',
      'Deportes': '🏃',
      'Libros': '📖',
      'Juguetes': '🧸',
      'Recetas': '🍳'
    }
    return icons[categoryName] || '📦'
  }

  // Cargar roles, tipos de documento y categorías al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, docTypesResponse, categoriesResponse] = await Promise.all([
          fetch("http://localhost:3002/auth/roles"),
          fetch("http://localhost:3002/auth/document-types"),
          fetch("http://localhost:3002/products/categories")
        ])

        if (rolesResponse.ok) {
          const rolesData = await rolesResponse.json()
          console.log('🔍 Todos los roles:', rolesData)

          // Buscar específicamente Cliente y Vendedor por ID
          const clienteRole = rolesData.find(role => role.id === 1)
          const vendedorRole = rolesData.find(role => role.id === 2)

          const filteredRoles = []
          if (clienteRole) filteredRoles.push(clienteRole)
          if (vendedorRole) filteredRoles.push(vendedorRole)

          console.log('✅ Roles filtrados:', filteredRoles)
          setRoles(filteredRoles)
        } else {
          console.error('❌ Error al cargar roles:', rolesResponse.statusText);
        }

        if (docTypesResponse.ok) {
          const docTypesData = await docTypesResponse.json()
          setDocumentTypes(docTypesData)
        } else {
          console.error('❌ Error al cargar tipos de documento:', docTypesResponse.statusText);
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          console.log('✅ Categorías cargadas:', categoriesData)
          setCategories(categoriesData)
        } else {
          console.error('❌ Error al cargar categorías:', categoriesResponse.statusText);
        }
      } catch (error) {
        console.error("❌ Error cargando datos:", error)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'tipoDocumentoId' || name === 'rolId' ? parseInt(value) : value),
    }))
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleDiaChange = (dia) => {
    setHorarioDias(prev => ({ ...prev, [dia]: !prev[dia] }))
  }

  const handleMetodoPagoChange = (metodo) => {
    setMetodosPagoSeleccionados(prev => ({ ...prev, [metodo]: !prev[metodo] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    // Validar que los vendedores seleccionen al menos una categoría
    if (formData.rolId === 2 && selectedCategories.length === 0) {
      setError("Como vendedor, debes seleccionar al menos una categoría de productos")
      return
    }

    // Validar campos obligatorios de vendedor
    if (formData.rolId === 2) {
      if (!formData.nombreTienda || formData.nombreTienda.trim() === '') {
        setError("El nombre del negocio es obligatorio para vendedores")
        return
      }

      const diasSeleccionados = Object.keys(horarioDias).filter(d => horarioDias[d]);
      if (diasSeleccionados.length === 0) {
        setError("Debes seleccionar al menos un día de atención")
        return
      }

      const metodosSeleccionados = Object.keys(metodosPagoSeleccionados).filter(m => metodosPagoSeleccionados[m]);
      if (metodosSeleccionados.length === 0) {
        setError("Debes seleccionar al menos un método de pago")
        return
      }
    }

    try {
      setLoading(true)
      const response = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          password: formData.password,
          tipoDocumentoId: formData.tipoDocumentoId,
          numeroDocumento: formData.numeroDocumento,
          telefono: formData.telefono || undefined,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          genero: formData.genero,
          aceptaTerminos: formData.aceptaTerminos,
          aceptaMarketing: formData.aceptaMarketing,
          rolId: formData.rolId,
          // Solo enviar categorías y datos de negocio si es vendedor
          ...(formData.rolId === 2 && {
            categorias: selectedCategories,
            nombreTienda: formData.nombreTienda,
            horarioAtencion: Object.keys(horarioDias).filter(d => horarioDias[d]).length > 0
              ? `${Object.keys(horarioDias).filter(d => horarioDias[d]).join('-')} ${horarioInicio}-${horarioFin}`
              : "",
            metodosPago: Object.keys(metodosPagoSeleccionados).filter(m => metodosPagoSeleccionados[m]).join(", "),
            tipoServicio: formData.tipoServicio,
            whatsapp: formData.whatsapp,
            instagram: formData.instagram,
            facebook: formData.facebook,
            sitioWeb: formData.sitioWeb,
            direccionNegocio: formData.direccionNegocio,
          })
        }),
      })

      console.log('📤 Datos enviados al registro:', {
        ...JSON.parse(JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          rolId: formData.rolId,
          ...(formData.rolId === 2 && {
            nombreTienda: formData.nombreTienda,
            horarioAtencion: Object.keys(horarioDias).filter(d => horarioDias[d]).length > 0
              ? `${Object.keys(horarioDias).filter(d => horarioDias[d]).join('-')} ${horarioInicio}-${horarioFin}`
              : "",
            metodosPago: Object.keys(metodosPagoSeleccionados).filter(m => metodosPagoSeleccionados[m]).join(", "),
          })
        }))
      });

      if (response.ok) {
        const userData = await response.json()

        // Si el registro incluye login automático
        if (userData.access_token) {
          localStorage.setItem("authToken", userData.access_token)
          localStorage.setItem("user", JSON.stringify(userData.user))
          navigate("/dashboard")
        } else {
          // Si no, redirigir al login
          navigate("/login")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Error al registrar el usuario")
      }
    } catch (err) {
      setError("Error al conectar con el servidor")
      console.error("Error en registro:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modern-auth-container">
      {/* Lado izquierdo - Información */}
      <div className="auth-left-side">
        <div className="auth-brand">
          <span className="brand-icon">🍳</span>
          <span className="brand-text">CookSync</span>
        </div>

        <div className="auth-welcome">
          <h1>Crea tu cuenta y <span className="highlight">disfruta</span></h1>
          <p>Únete a miles de usuarios satisfechos y accede a recetas personalizadas, ofertas especiales y la mejor experiencia culinaria.</p>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span className="feature-text">Recomendaciones personalizadas</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⭐</span>
            <span className="feature-text">Acceso a recetas exclusivas</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">Garantía de calidad en ingredientes</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <span className="feature-text">Soporte técnico prioritario</span>
          </div>
        </div>

        <div className="auth-image">
          <img
            src="/cooking-ingredients.jpg"
            alt="Ingredientes de cocina"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="image-placeholder">
            <span className="placeholder-icon">🥘</span>
            <p>Ingredientes frescos y recetas deliciosas</p>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="auth-right-side">
        <div className="auth-form-container">
          <div className="form-header">
            <div className="form-logo">
              <span className="logo-icon">🍳</span>
            </div>
            <h2>Crear Cuenta</h2>
            <p>Únete a la familia CookSync</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="modern-form">
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="nombres">Nombre</label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    required
                    placeholder="Juan"
                  />
                </div>
              </div>

              <div className="form-group half-width">
                <label htmlFor="apellidos">Apellido</label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    placeholder="Pérez"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <div className="input-container">
                <span className="input-icon">📱</span>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="987 654 321"
                />
              </div>
            </div>
            {/* Campos adicionales para Vendedor */}
            {formData.rolId === 2 && (
              <div className="vendor-fields-section" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#2d3748' }}>Información del Negocio</h3>

                <div className="form-group">
                  <label htmlFor="nombreTienda">Nombre del Negocio</label>
                  <div className="input-container">
                    <span className="input-icon">🏪</span>
                    <input
                      type="text"
                      id="nombreTienda"
                      name="nombreTienda"
                      value={formData.nombreTienda}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Pastelería Dulce Sabor"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Horario de Atención</label>
                  <div className="schedule-container" style={{ background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div className="days-selector" style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {Object.keys(horarioDias).map(dia => (
                        <label key={dia} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={horarioDias[dia]}
                            onChange={() => handleDiaChange(dia)}
                          />
                          {dia}
                        </label>
                      ))}
                    </div>
                    <div className="time-selector" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="time"
                        value={horarioInicio}
                        onChange={(e) => setHorarioInicio(e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                      />
                      <span>a</span>
                      <input
                        type="time"
                        value={horarioFin}
                        onChange={(e) => setHorarioFin(e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Métodos de Pago</label>
                  <div className="payment-methods-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    {Object.keys(metodosPagoSeleccionados).map(metodo => (
                      <label key={metodo} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={metodosPagoSeleccionados[metodo]}
                          onChange={() => handleMetodoPagoChange(metodo)}
                        />
                        {metodo}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="direccionNegocio">Dirección del Negocio</label>
                  <div className="input-container">
                    <span className="input-icon">📍</span>
                    <input
                      type="text"
                      id="direccionNegocio"
                      name="direccionNegocio"
                      value={formData.direccionNegocio}
                      onChange={handleChange}
                      placeholder="Av. Comercial 123, Distrito"
                      required={formData.rolId === 2}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          const btn = document.getElementById('geo-btn');
                          if (btn) btn.innerText = 'Obteniendo ubicación...';

                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setFormData(prev => ({
                                ...prev,
                                latitud: position.coords.latitude,
                                longitud: position.coords.longitude
                              }));
                              if (btn) btn.innerText = '✅ Ubicación exacta guardada';
                              // Opcional: Intentar obtener dirección inversa aquí si se tuviera API Key
                            },
                            (error) => {
                              console.error(error);
                              if (btn) btn.innerText = '❌ Error al obtener ubicación';
                              alert('No se pudo obtener la ubicación. Por favor ingrese la dirección manualmente.');
                            }
                          );
                        } else {
                          alert('Geolocalización no soportada en este navegador');
                        }
                      }}
                      id="geo-btn"
                      style={{
                        background: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      📍 Usar mi ubicación actual exacta
                    </button>
                    {(formData.latitud && formData.longitud) && (
                      <p style={{ fontSize: '0.8rem', color: 'green', marginTop: '5px' }}>
                        Coordenadas: {formData.latitud.toFixed(6)}, {formData.longitud.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="sitioWeb">Sitio Web (Opcional)</label>
                  <div className="input-container">
                    <span className="input-icon">🌐</span>
                    <input
                      type="url"
                      id="sitioWeb"
                      name="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={handleChange}
                      placeholder="https://mitienda.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tipoServicio">Tipo de Servicio</label>
                  <div className="input-container">
                    <span className="input-icon">🚚</span>
                    <select
                      id="tipoServicio"
                      name="tipoServicio"
                      value={formData.tipoServicio}
                      onChange={handleChange}
                    >
                      <option value="Ambos">Delivery y Recojo</option>
                      <option value="Delivery">Solo Delivery</option>
                      <option value="Recojo">Solo Recojo en Tienda</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half-width">
                    <label htmlFor="whatsapp">WhatsApp Business</label>
                    <div className="input-container">
                      <span className="input-icon">💬</span>
                      <input
                        type="text"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="999888777"
                      />
                    </div>
                  </div>

                  <div className="form-group half-width">
                    <label htmlFor="instagram">Instagram</label>
                    <div className="input-container">
                      <span className="input-icon">📸</span>
                      <input
                        type="text"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="@tu_negocio"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selección de categorías - solo para vendedores */}
            {formData.rolId === 2 && (
              <div className="form-group categories-section">
                <label>¿Qué categorías de productos vendes?</label>
                <p className="categories-subtitle">Selecciona todas las categorías que aplican a tu negocio</p>
                <div className="categories-grid">
                  {console.log('🔍 Renderizando categorías:', categories, 'Total:', categories.length)}
                  {categories.map(category => (
                    <div key={category.id} className="category-checkbox">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                      <label htmlFor={`category-${category.id}`} className="category-label">
                        <span className="category-icon">{getCategoryIcon(category.nombre)}</span>
                        <span className="category-name">{category.nombre}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="category-warning">⚠️ Por favor selecciona al menos una categoría</p>
                )}
              </div>
            )}

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="password">Contraseña</label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              <div className="form-group half-width">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="tipoDocumentoId">Tipo de Documento</label>
                <div className="input-container">
                  <span className="input-icon">📄</span>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    value={formData.tipoDocumentoId}
                    onChange={handleChange}
                    required
                  >
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group half-width">
                <label htmlFor="numeroDocumento">Número de Documento</label>
                <div className="input-container">
                  <span className="input-icon">🆔</span>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    required
                    placeholder="12345678"
                    maxLength="20"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="rolId">Tipo de Usuario</label>
              <div className="input-container">
                <span className="input-icon">👥</span>
                <select
                  id="rolId"
                  name="rolId"
                  value={formData.rolId}
                  onChange={handleChange}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  required
                />
                <span className="checkmark"></span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                Acepto los <a href="#" className="terms-link">términos y condiciones</a> y la <a href="#" className="terms-link">política de privacidad</a>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="aceptaMarketing"
                  checked={formData.aceptaMarketing}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Quiero recibir ofertas especiales y novedades por email
              </label>
            </div>

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? "Creando Cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="auth-footer">
            <p>¿Ya tienes una cuenta? <span onClick={() => navigate("/login")} className="auth-link">Inicia sesión aquí</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
