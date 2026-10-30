import React, { useState, useEffect } from 'react';

// Recibimos limit y showFilters como propiedades
export default function Catalogo({ onAddToCart, limit, showFilters }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:4700/api/productos').then(res => res.json()),
      fetch('http://localhost:4700/api/categorias').then(res => res.json())
    ])
      .then(([dataProductos, dataCategorias]) => {
        setProductos(dataProductos);
        setCategorias(dataCategorias);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      });
  }, []);

  // Lógica de filtrado
  let filteredProducts = filter === 'todos' 
    ? productos 
    : productos.filter(p => p.categoriaId.toString() === filter.toString());

  // AQUÍ APLICAMOS EL LÍMITE (si es que nos pasan uno)
  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>Cargando catálogo...</div>;

  return (
    <section id="catalogo" className="catalog container">
      <h2 className="section-title">Catálogo Completo</h2>
      
      {/* Si showFilters es true, mostramos los botones. Si no, los ocultamos */}
      {showFilters && (
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'todos' ? 'active' : ''}`} 
            onClick={() => setFilter('todos')}
          >
            TODOS
          </button>
          
          {categorias.map(cat => (
            <button 
              key={cat.id}
              className={`filter-btn ${filter === cat.id.toString() ? 'active' : ''}`} 
              onClick={() => setFilter(cat.id.toString())}
            >
              {cat.nombre.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
             No hay productos en esta categoría.
           </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img 
                src={product.imagenUrl?.startsWith('http') ? product.imagenUrl : `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80`} 
                alt={product.nombre} 
                className="product-img" 
              />
              <div className="product-info">
                <span className="badge">ALQUILER / VENTA</span>
                <h3 className="product-title">{product.nombre}</h3>
                <div className="product-price">S/ {product.precioAlquiler}</div>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{product.descripcion}</p>
                
                <button className="add-btn" onClick={() => onAddToCart(product)}>
                  + Agregar al Carrito
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}