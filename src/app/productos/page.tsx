"use client";
import React, { useEffect, useState } from "react";

interface Producto {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagenUrl?: string;
  disponible: boolean;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [imagenUrl, setImagenUrl] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [editId, setEditId] = useState<string|null>(null);

  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(setProductos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || precio === null) return;
    if (editId) {
      await fetch(`/api/productos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio, imagenUrl, disponible })
      });
    } else {
      await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio, imagenUrl, disponible })
      });
    }
    setNombre(""); setDescripcion(""); setPrecio(0); setImagenUrl(""); setDisponible(true); setEditId(null);
    fetch("/api/productos").then(res => res.json()).then(setProductos);
  };

  const handleEdit = (producto: Producto) => {
    setEditId(producto._id);
    setNombre(producto.nombre);
    setDescripcion(producto.descripcion || "");
    setPrecio(producto.precio);
    setImagenUrl(producto.imagenUrl || "");
    setDisponible(producto.disponible);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    fetch("/api/productos").then(res => res.json()).then(setProductos);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input className="border p-2 w-full" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        <input className="border p-2 w-full" type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(Number(e.target.value))} required />
        <input className="border p-2 w-full" placeholder="URL de imagen" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={disponible} onChange={e => setDisponible(e.target.checked)} /> Disponible
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editId ? 'Actualizar' : 'Agregar'}</button>
        {editId && <button type="button" className="ml-2 text-gray-600" onClick={() => { setEditId(null); setNombre(""); setDescripcion(""); setPrecio(0); setImagenUrl(""); setDisponible(true); }}>Cancelar</button>}
      </form>
      <ul>
        {productos.map(producto => (
          <li key={producto._id} className="flex justify-between items-center border-b py-2">
            <span>
              <span className="font-semibold">{producto.nombre}</span> - ${producto.precio} {producto.disponible ? '' : <span className="text-xs text-red-500">(No disponible)</span>}<br />
              <span className="text-xs text-gray-600">{producto.descripcion}</span>
              {producto.imagenUrl && <img src={producto.imagenUrl} alt={producto.nombre} className="h-8 inline ml-2" />}
            </span>
            <span>
              <button className="text-blue-600 mr-2" onClick={() => handleEdit(producto)}>Editar</button>
              <button className="text-red-600" onClick={() => handleDelete(producto._id)}>Eliminar</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
