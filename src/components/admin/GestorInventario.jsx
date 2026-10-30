import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';

export default function GestorInventario({ onBack }) {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:4700/api/inventario';

  const fetchInventario = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setInventario(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar inventario:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setInventario(inventario.filter(item => item.id !== id));
        } else {
          alert("Error al eliminar el registro");
        }
      })
      .catch(err => console.error(err));
  };

  const handleSave = (formData, id) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (res.ok) {
          fetchInventario(); // Recargamos la lista
        } else {
          alert("Error al guardar el registro");
        }
      })
      .catch(err => console.error(err));
  };

  // AQUÍ ESTÁN LOS CAMPOS EXACTOS DE TU TABLA
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Código de Barra', accessor: 'codigoBarra' },
    { header: 'ID Producto', accessor: 'productoId' },
    { header: 'Talla', accessor: 'talla' },
    { header: 'Estado Prenda', accessor: 'estadoPrenda' },
    { header: 'Disponibilidad', accessor: 'disponibilidad' },
    { header: 'Ubicación Tienda', accessor: 'ubicacionTienda' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando inventario...</div>;

  return (
    <AdminTable 
      title="📦 Inventario de Prendas" 
      columns={columns} 
      data={inventario} 
      onBack={onBack} 
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}