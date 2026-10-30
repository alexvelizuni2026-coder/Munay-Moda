import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';

export default function GestorProveedores({ onBack }) {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:4700/api/proveedores';

  const fetchProveedores = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setProveedores(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar proveedores:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Eliminar
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setProveedores(proveedores.filter(p => p.id !== id));
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
        fetchProveedores(); // Recarga la tabla
      } else {
        alert("Error al guardar el proveedor. Revisa los datos.");
      }
    }).catch(err => console.error(err));
  };

  // Columnas exactas de tu JSON de proveedores
  const columns = [
    { header: 'ID', accessor: 'id', editable: false },
    { header: 'Empresa', accessor: 'nombreEmpresa' },
    { header: 'Contacto', accessor: 'contactoNombre' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Email', accessor: 'email' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando proveedores...</div>;

  return (
    <AdminTable 
      title="🚚 Gestión de Proveedores" 
      columns={columns} 
      data={proveedores} 
      onBack={onBack} 
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}