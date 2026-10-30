import React, { useState } from 'react';

export default function AdminTable({ title, columns, data, onBack, onDelete, onSave }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formData, setFormData] = useState({});

  // Abrir formulario para Crear
  const handleAddNew = () => {
    setEditingRow(null);
    setFormData({});
    setIsFormOpen(true);
  };

  // Abrir formulario para Editar
  const handleEdit = (row) => {
    setEditingRow(row);
    setFormData({ ...row });
    setIsFormOpen(true);
  };

  // Eliminar
  const handleDeleteClick = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.')) {
      onDelete(id);
    }
  };

  // Guardar (Crear o Editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, editingRow ? editingRow.id : null);
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      {/* Botón Volver */}
      <button onClick={onBack} className="back-btn">← Volver al catálogo</button>
      
      {/* Encabezado con Botón de Agregar */}
      <div className="admin-header">
        <h2>{title}</h2>
        <button className="btn-primary" onClick={handleAddNew}>+ Agregar Nuevo</button>
      </div>

      {/* FORMULARIO DINÁMICO (Oculto por defecto) */}
      {isFormOpen && (
        <div className="form-card">
          <h3>{editingRow ? 'Editar Registro' : 'Nuevo Registro'}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            {columns.map((col) => {
              // Ocultar el campo si está marcado como no editable (ej. el ID)
              if (col.editable === false) return null;

              return (
                <div className="input-group" key={col.accessor}>
                  <label>{col.header}</label>
                  
                  {/* LÓGICA DE SELECT vs INPUT */}
                  {col.type === 'select' ? (
                    <select 
                      name={col.accessor} 
                      value={formData[col.accessor] || ''} 
                      onChange={handleChange} 
                      required
                      style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-200)', fontFamily: 'inherit' }}
                    >
                      <option value="">Seleccione...</option>
                      {col.options.map(opt => {
                        // Si las opciones son objetos (ej. {value: 1, label: "Terror"})
                        if (typeof opt === 'object') {
                          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                        }
                        // Si las opciones son texto simple (ej. "ADMIN")
                        return <option key={opt} value={opt}>{opt}</option>;
                      })}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      name={col.accessor} 
                      value={formData[col.accessor] || ''} 
                      onChange={handleChange} 
                      required 
                      placeholder={`Ingrese ${col.header.toLowerCase()}`}
                    />
                  )}
                </div>
              );
            })}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', gridColumn: '1 / -1' }}>
              <button type="submit" className="btn-primary">Guardar Cambios</button>
              <button type="button" className="back-btn" style={{ marginBottom: 0 }} onClick={() => setIsFormOpen(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA DE DATOS */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '30px' }}>
                  No hay registros en la base de datos.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      <span title={row[col.accessor]}>
                        {row[col.accessor]}
                      </span>
                    </td>
                  ))}
                  <td style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button className="action-btn edit" onClick={() => handleEdit(row)}>Editar</button>
                    <button className="action-btn delete" onClick={() => handleDeleteClick(row.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}