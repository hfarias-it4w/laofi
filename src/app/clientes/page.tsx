"use client";

import React, { useEffect, useState } from 'react';

interface Usuario {
  _id: string;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('cliente');
  const [activo, setActivo] = useState(true);
  const [contraseña, setContraseña] = useState('');
  const [editId, setEditId] = useState<string|null>(null);

  useEffect(() => {
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(setUsuarios);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await fetch(`/api/usuarios/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, rol, activo })
      });
    } else {
      await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contraseñaHash: contraseña, rol, activo })
      });
    }
    setNombre(''); setCorreo(''); setRol('cliente'); setActivo(true); setContraseña(''); setEditId(null);
    fetch('/api/usuarios').then(res => res.json()).then(setUsuarios);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditId(usuario._id);
    setNombre(usuario.nombre);
    setCorreo(usuario.correo);
    setRol(usuario.rol);
    setActivo(usuario.activo);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    fetch('/api/usuarios').then(res => res.json()).then(setUsuarios);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input className="border p-2 w-full" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Correo" value={correo} onChange={e => setCorreo(e.target.value)} required />
        {!editId && (
          <input className="border p-2 w-full" placeholder="Contraseña" value={contraseña} onChange={e => setContraseña(e.target.value)} required />
        )}
        <select className="border p-2 w-full" value={rol} onChange={e => setRol(e.target.value)} required>
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} /> Activo
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" className="ml-2 text-gray-600" onClick={() => { setEditId(null); setNombre(''); setCorreo(''); setRol('cliente'); setActivo(true); setContraseña(''); }}>Cancelar</button>}
      </form>
      <ul>
        {usuarios.map(usuario => (
          <li key={usuario._id} className="flex justify-between items-center border-b py-2">
            <span>{usuario.nombre} ({usuario.correo}) - <span className="text-xs">{usuario.rol}{!usuario.activo && ' (inactivo)'}</span></span>
            <span>
              <button className="text-blue-600 mr-2" onClick={() => handleEdit(usuario)}>Editar</button>
              <button className="text-red-600" onClick={() => handleDelete(usuario._id)}>Eliminar</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
