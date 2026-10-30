import React, { useState, useEffect } from 'react';

export default function PublicarProducto({ onBack }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioCompra: '',
    precioAlquiler: '',
    categoriaId: '',
    proveedorId: '',
    imagenUrl: ''
  });

  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  // Cargar proveedores y categorías al abrir el formulario
  useEffect(() => {
    // Cargar Proveedores
    fetch('http://localhost:4700/api/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(data))
      .catch(err => console.error("Error cargando proveedores:", err));

    // Cargar Categorías
    fetch('http://localhost:4700/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensaje('Publicando...');

    // Convertimos los IDs a números (porque los <select> devuelven texto)
    const dataToSend = {
      ...formData,
      categoriaId: parseInt(formData.categoriaId),
      proveedorId: parseInt(formData.proveedorId)
    };

    // Petición POST a tu backend
    fetch('http://localhost:4700/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    })
      .then(res => {
        if (res.ok) {
          setMensaje('¡Producto publicado con éxito!');
          // Limpiar formulario
          setFormData({
            nombre: '', descripcion: '', precioCompra: '', precioAlquiler: '',
            categoriaId: '', proveedorId: '', imagenUrl: ''
          });
        } else {
          setMensaje('Error al publicar. Revisa los datos.');
        }
      })
      .catch(err => {
        console.error(err);
        setMensaje('Error de conexión con el servidor.');
      });
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh', maxWidth: '800px' }}>
      <button onClick={onBack} className="back-btn">← Volver al catálogo</button>
      
      <div className="admin-header">
        <h2>✨ Publicar Nuevo Producto</h2>
      </div>

      <div className="form-card" style={{ maxWidth: '100%' }}>
        <form onSubmit={handleSubmit} className="admin-form">
          
          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Nombre del Producto / Disfraz</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Ej. Vestido de Gala Rojo Glamour" />
          </div>

          <div className="input-group">
            <label>Precio de Compra (S/)</label>
            <input type="number" step="0.01" name="precioCompra" value={formData.precioCompra} onChange={handleChange} required placeholder="Ej. 350.00" />
          </div>

          <div className="input-group">
            <label>Precio de Alquiler (S/)</label>
            <input type="number" step="0.01" name="precioAlquiler" value={formData.precioAlquiler} onChange={handleChange} required placeholder="Ej. 80.00" />
          </div>

          {/* SELECT DE CATEGORÍA */}
          <div className="input-group">
            <label>Categoría</label>
            <select 
              name="categoriaId" 
              value={formData.categoriaId} 
              onChange={handleChange} 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }}
            >
              <option value="">Seleccione una categoría...</option>
              {categorias.map(cat => (
                // NOTA: Si tu tabla de categorías usa otro campo, cámbialo aquí (ej. cat.nombreCategoria)
                <option key={cat.id} value={cat.id}>{cat.nombre || cat.nombreCategoria}</option>
              ))}
            </select>
          </div>

          {/* SELECT DE PROVEEDOR */}
          <div className="input-group">
            <label>Proveedor</label>
            <select 
              name="proveedorId" 
              value={formData.proveedorId} 
              onChange={handleChange} 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }}
            >
              <option value="">Seleccione un proveedor...</option>
              {proveedores.map(prov => (
                <option key={prov.id} value={prov.id}>{prov.nombreEmpresa}</option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>URL de la Imagen (Opcional)</label>
            <input type="text" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} placeholder="Ej. https://misitio.com/imagen.jpg" />
          </div>

          <div className="input-group" style={{ gridColumn: '1 / -1' }}>
            <label>Descripción</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange} 
              rows="3"
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }}
            ></textarea>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              📤 Publicar Producto
            </button>
          </div>
        </form>

        {mensaje && (
          <p style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold', color: mensaje.includes('Error') ? 'red' : 'green' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}