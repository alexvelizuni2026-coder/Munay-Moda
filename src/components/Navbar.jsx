import React, { useState } from 'react';

export default function Navbar({ user, onOpenAuth, onLogout, onOpenCart, cartCount, onNavigate }) {
  const [isDbMenuOpen, setIsDbMenuOpen] = useState(false);

  const handleDbClick = (view) => {
    onNavigate(view);
    setIsDbMenuOpen(false);
  };

  // Función para hacer scroll suave a la sección "¿Cómo funciona?"
  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    onNavigate('tienda');
    
    setTimeout(() => {
      const section = document.getElementById('como-funciona');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <div className="top-bar">
        ✨ ¡Temporada de Carnaval! Usa el código <b>FIESTA2026</b> para 15% OFF.
      </div>

      <header className="navbar">
        <div className="container nav-content">
          <div className="logo" onClick={() => onNavigate('tienda')} style={{ cursor: 'pointer' }}>
            Munay Moda
          </div>
          
          <nav className="nav-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('tienda'); }}>Inicio</a>
            
            {/* CAMBIO AQUÍ: Ahora navega a la vista 'catalogo' */}
            <a href="#catalogo" onClick={() => onNavigate('catalogo')}>Catálogo</a>
            
            <a href="#como-funciona" onClick={scrollToHowItWorks}>¿Cómo Funciona?</a>
            <a href="#resenas">Opiniones</a>
            <button 
              onClick={() => setIsDbMenuOpen(true)} 
              style={{ color: 'var(--brand-600)', fontWeight: 'bold', fontSize: '14px' }}
            >
              🗄️ Base de Datos
            </button>
            
            {/* BOTÓN DE PUBLICAR EN EL NAVBAR */}
            <button 
              onClick={() => onNavigate('publicar')} 
              style={{ color: 'white', background: 'var(--brand-600)', fontWeight: 'bold', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}
            >
              ✨ Publicar
            </button>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Hola, {user}</span>
                <button onClick={onLogout} style={{ fontSize: '12px', color: 'red' }}>Salir</button>
              </div>
            ) : (
              <>
                <button onClick={() => onOpenAuth('login')} style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--brand-700)' }}>
                  Iniciar Sesión
                </button>
                <button onClick={() => onOpenAuth('register')} style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', background: 'var(--brand-600)', padding: '8px 12px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                  Registrarse
                </button>
              </>
            )}
            <button className="cart-btn" onClick={onOpenCart}>
              🛒 <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MODAL DE BASE DE DATOS */}
      {isDbMenuOpen && (
        <div className="modal-overlay" onClick={() => setIsDbMenuOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗄️ Gestión de Base de Datos</h2>
              <button onClick={() => setIsDbMenuOpen(false)}>✖</button>
            </div>
            <div className="modal-body">
              <p>Selecciona una entidad para gestionar sus registros:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                
                <button className="db-option-btn" onClick={() => handleDbClick('inventario')}>📦 Inventario</button>
                <button className="db-option-btn" onClick={() => handleDbClick('empleados')}>👔 Empleado</button>
                
                <button className="db-option-btn">💳 Historial de Pago</button>
                
                <button className="db-option-btn" onClick={() => handleDbClick('productos')}>👗 Producto</button>
                
                <button className="db-option-btn" onClick={() => handleDbClick('proveedores')}>🚚 Proveedor</button>
                
                <button className="db-option-btn">💸 Transacción</button>
                
                <button className="db-option-btn" onClick={() => handleDbClick('usuarios')}>👤 Usuario (User)</button>
                
                <button className="db-option-btn" onClick={() => handleDbClick('categorias')}>🏷️ Categoría</button>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}