import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Catalogo from './components/Catalogo';
import HowItWorks from './components/HowItWorks';
import GestorInventario from './components/admin/GestorInventario';
import GestorEmpleados from './components/admin/GestorEmpleados';
import GestorUsuarios from './components/admin/GestorUsuarios';
import GestorProductos from './components/admin/GestorProductos';
import PublicarProducto from './components/admin/PublicarProducto';
import GestorProveedores from './components/admin/GestorProveedores';
import GestorCategorias from './components/admin/GestorCategorias';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('tienda');

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || 'Usuario';
    setUser(name);
    setIsAuthModalOpen(false);
    alert(`¡Bienvenido/a, ${name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    alert('Sesión cerrada');
  };

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div>
      <Navbar 
        user={user}
        cartCount={totalItems}
        onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={setCurrentView}
      />

      {/* VISTA PRINCIPAL (HERO + 3 PRODUCTOS) */}
      {currentView === 'tienda' && (
        <>
          <section className="hero">
            <div className="container">
              <h1>Alquila o Compra el Disfraz Perfecto</h1>
              <p>Explora la colección más amplia de disfraces premium y trajes de época con envío a domicilio.</p>
              {/* CAMBIAMOS EL BOTÓN PARA QUE LLEVE AL CATALOGO COMPLETO */}
              <button onClick={() => setCurrentView('catalogo')} className="btn-primary">
                Ver Catálogo
              </button>
            </div>
          </section>

          {/* CATALOGO LIMITADO A 3 PRODUCTOS Y SIN FILTROS */}
          <Catalogo onAddToCart={addToCart} limit={3} showFilters={false} />

          <HowItWorks />
        </>
      )}

      {/* VISTA EXCLUSIVA DE CATALOGO (TODOS LOS PRODUCTOS Y CON FILTROS) */}
      {currentView === 'catalogo' && (
        <div style={{ paddingTop: '40px' }}>
          <Catalogo onAddToCart={addToCart} limit={null} showFilters={true} />
        </div>
      )}

      {/* RUTAS DE ADMINISTRACIÓN */}
      {currentView === 'inventario' && <GestorInventario onBack={() => setCurrentView('tienda')} />}
      {currentView === 'empleados' && <GestorEmpleados onBack={() => setCurrentView('tienda')} />}
      {currentView === 'usuarios' && <GestorUsuarios onBack={() => setCurrentView('tienda')} />}
      {currentView === 'productos' && <GestorProductos onBack={() => setCurrentView('tienda')} />}
      {currentView === 'publicar' && <PublicarProducto onBack={() => setCurrentView('tienda')} />}
      {currentView === 'proveedores' && <GestorProveedores onBack={() => setCurrentView('tienda')} />}
      {currentView === 'categorias' && <GestorCategorias onBack={() => setCurrentView('tienda')} />}

      {/* MODAL DE LOGIN / REGISTRO */}
      {isAuthModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
              <button onClick={() => setIsAuthModalOpen(false)}>✖</button>
            </div>
            
            <form className="modal-body" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div className="input-group">
                  <label>Nombre Completo</label>
                  <input type="text" name="name" placeholder="Tu nombre" required />
                </div>
              )}
              
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input type="email" name="email" placeholder="correo@ejemplo.com" required />
              </div>

              <div className="input-group">
                <label>Contraseña</label>
                <input type="password" placeholder="••••••••" required />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                {authMode === 'login' ? 'Entrar' : 'Registrarme'}
              </button>

              <p className="auth-switch">
                {authMode === 'login' ? (
                  <>¿No tienes cuenta? <span onClick={() => setAuthMode('register')}>Regístrate aquí</span></>
                ) : (
                  <>¿Ya tienes cuenta? <span onClick={() => setAuthMode('login')}>Inicia Sesión</span></>
                )}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}