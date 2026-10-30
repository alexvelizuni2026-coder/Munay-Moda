import React, { useState, useEffect } from 'react';
import AdminTable from './AdminTable';

export default function GestorEmpleados({ onBack }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:4700/api/empleados';

  const fetchEmpleados = () => {
    setLoading(true);
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setEmpleados(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar empleados:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setEmpleados(empleados.filter(e => e.id !== id));
        } else {
          alert("Error al eliminar el empleado");
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
          fetchEmpleados(); // Recargamos la lista
        } else {
          alert("Error al guardar el empleado");
        }
      })
      .catch(err => console.error(err));
  };

  // CAMPOS EXACTOS DE TU TABLA DE EMPLEADOS
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Email', accessor: 'email' },
    { header: 'Contraseña', accessor: 'password' }, // Solo para pruebas
    { header: 'Rol', accessor: 'rol' },
    { header: 'Estado', accessor: 'estado' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando empleados...</div>;

  return (
    <AdminTable 
      title="👔 Gestión de Empleados" 
      columns={columns} 
      data={empleados} 
      onBack={onBack} 
      onDelete={handleDelete}
      onSave={handleSave}
    />
  );
}