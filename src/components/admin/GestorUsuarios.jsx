import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';

export default function GestorUsuarios({ onBack }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ruta de tu backend para usuarios
  const API_URL = 'http://localhost:4700/api/usuarios';

  const fetchUsuarios = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Eliminar
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setUsuarios(usuarios.filter(u => u.id !== id));
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
        fetchUsuarios(); // Recarga la tabla
      }
    }).catch(err => console.error(err));
  };

  // Definimos las columnas exactas de tu JSON de usuarios
  const columns = [
    { header: 'ID', accessor: 'id', editable: false },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Email', accessor: 'email' },
    { header: 'Contraseña', accessor: 'password' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Dirección', accessor: 'direccion' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando usuarios...</div>;

  return (
    <AdminTable 
      title="👤 Gestión de Usuarios (Clientes)" 
      columns={columns} 
      data={usuarios} 
      onBack={onBack} 
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}