import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';

export default function GestorCategorias({ onBack }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:4700/api/categorias';

  const fetchCategorias = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setCategorias(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar categorías:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Eliminar
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setCategorias(categorias.filter(c => c.id !== id));
        }
      })
      .catch(err => console.error(err));
  };

  // Crear o Editar
  const handleSave = (formData, id) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(res => {
      if (res.ok) {
        fetchCategorias(); // Recarga la tabla
      } else {
        alert("Error al guardar la categoría.");
      }
    }).catch(err => console.error(err));
  };

  // Columnas de la tabla
  // NOTA: Si tu base de datos usa otro campo (ej. nombreCategoria), cámbialo aquí.
  const columns = [
    { header: 'ID', accessor: 'id', editable: false },
    { header: 'Nombre de Categoría', accessor: 'nombre' },
    { header: 'Descripción', accessor: 'descripcion' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando categorías...</div>;

  return (
    <AdminTable 
      title="🏷️ Gestión de Categorías" 
      columns={columns} 
      data={categorias} 
      onBack={onBack} 
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}