import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';

export default function GestorProductos({ onBack }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:4700/api/productos';

  // Cargar datos iniciales
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resCat, resProv] = await Promise.all([
        fetch(API_URL).then(r => r.json()),
        fetch('http://localhost:4700/api/categorias').then(r => r.json()),
        fetch('http://localhost:4700/api/proveedores').then(r => r.json())
      ]);
      setProductos(resProd);
      setCategorias(resCat);
      setProveedores(resProv);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Eliminar
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) setProductos(productos.filter(p => p.id !== id));
      })
      .catch(err => console.error(err));
  };

  // Crear o Editar
  const handleSave = (formData, id) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    // Convertimos los IDs a números
    const dataToSend = {
      ...formData,
      categoriaId: parseInt(formData.categoriaId),
      proveedorId: parseInt(formData.proveedorId)
    };

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    }).then(res => {
      if (res.ok) fetchData();
      else alert("Error al guardar. Revisa los datos.");
    }).catch(err => console.error(err));
  };

  // Columnas con los campos exactos de tu JSON
  // Para categoriaId y proveedorId usamos "type: 'select'" y le pasamos las opciones dinámicamente
  const columns = [
    { header: 'ID', accessor: 'id', editable: false },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Precio Compra (S/)', accessor: 'precioCompra' },
    { header: 'Precio Alquiler (S/)', accessor: 'precioAlquiler' },
    { 
      header: 'Categoría', 
      accessor: 'categoriaId', 
      type: 'select', 
      options: categorias.map(c => ({ value: c.id, label: c.nombre }))
    },
    { 
      header: 'Proveedor', 
      accessor: 'proveedorId', 
      type: 'select', 
      options: proveedores.map(p => ({ value: p.id, label: p.nombreEmpresa }))
    },
    { header: 'Imagen (URL)', accessor: 'imagenUrl' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando catálogo...</div>;

  return (
    <AdminTable 
      title="👗 Gestión de Productos" 
      columns={columns} 
      data={productos} 
      onBack={onBack} 
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}