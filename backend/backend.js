import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/laofi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Probar conexión a MongoDB
mongoose.connection.on('connected', () => {
  console.log('Conectado a MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// Esquema y modelo de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseñaHash: { type: String, required: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  activo: { type: Boolean, default: true }
}, { timestamps: true });
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Esquema y modelo de Pedido (nuevo)
const pedidoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  items: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, default: 1 },
    comentario: String
  }],
  metodoPago: { type: String, enum: ['mercadopago', 'modo', 'efectivo'], required: true }, // <-- corregido
  estado: { type: String, enum: ['pendiente', 'preparado', 'cancelado'], default: 'pendiente' },
  notificado: { type: Boolean, default: false }
}, { timestamps: true });
const Pedido = mongoose.model('Pedido', pedidoSchema);

// Esquema y modelo de Producto
const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  imagenUrl: String,
  disponible: { type: Boolean, default: true }
}, { timestamps: true });
const Producto = mongoose.model('Producto', productoSchema);

// Esquema y modelo de Notificación
const notificacionSchema = new mongoose.Schema({
  pedidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  tipo: { type: String, enum: ['nuevo_pedido'], required: true },
  entregado: { type: Boolean, default: false }
}, { timestamps: true });
const Notificacion = mongoose.model('Notificacion', notificacionSchema);

// --- Usuarios (ABM) ---
// Crear usuario
app.post('/api/usuarios', async (req, res) => {
  console.log('POST /api/usuarios body:', req.body);
  const { nombre, correo, contraseñaHash, rol, activo } = req.body;
  if (!nombre || !correo || !contraseñaHash) {
    return res.status(400).json({ error: 'Nombre, correo y contraseñaHash son requeridos' });
  }
  try {
    const nuevoUsuario = await Usuario.create({ nombre, correo, contraseñaHash, rol, activo });
    console.log('Usuario creado:', nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Listar usuarios
app.get('/api/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// Editar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  console.log('PUT /api/usuarios/:id', req.params.id, req.body);
  const { nombre, correo, rol, activo } = req.body;
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, correo, rol, activo },
      { new: true }
    );
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error('Error al editar usuario:', err);
    res.status(500).json({ error: 'Error al editar usuario' });
  }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  console.log('DELETE /api/usuarios/:id', req.params.id);
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(204).end();
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// --- Pedidos de café ---
// Crear pedido de café (nuevo modelo)
app.post('/api/pedidos', async (req, res) => {
  console.log('POST /api/pedidos body:', req.body);
  const { usuarioId, items, metodoPago } = req.body;
  if (!usuarioId || !items || !Array.isArray(items) || items.length === 0 || !metodoPago) {
    return res.status(400).json({ error: 'usuarioId, items (array) y metodoPago son requeridos' });
  }
  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    // Validar productos
    for (const item of items) {
      if (!item.productoId || !item.cantidad) {
        return res.status(400).json({ error: 'Cada item debe tener productoId y cantidad' });
      }
      const prod = await Producto.findById(item.productoId);
      if (!prod) return res.status(404).json({ error: `Producto no encontrado: ${item.productoId}` });
    }
    const nuevoPedido = await Pedido.create({
      usuarioId,
      items,
      metodoPago,
      estado: 'pendiente',
      notificado: false,
    });
    // Crear notificación asociada
    await Notificacion.create({ pedidoId: nuevoPedido._id, tipo: 'nuevo_pedido' });
    console.log('Pedido creado:', nuevoPedido);
    res.status(201).json(nuevoPedido);
  } catch (err) {
    console.error('Error al crear pedido:', err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

// Listar pedidos (popula usuario y productos)
app.get('/api/pedidos', async (req, res) => {
  const pedidos = await Pedido.find()
    .populate('usuarioId', 'nombre correo rol')
    .populate('items.productoId', 'nombre precio descripcion');
  res.json(pedidos);
});

// Actualizar estado y notificado
app.put('/api/pedidos/:id', async (req, res) => {
  console.log('PUT /api/pedidos/:id', req.params.id, req.body);
  const { estado, notificado } = req.body;
  try {
    const update = {};
    if (estado) update.estado = estado;
    if (typeof notificado === 'boolean') update.notificado = notificado;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (err) {
    console.error('Error al actualizar pedido:', err);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});

// Eliminar pedido
app.delete('/api/pedidos/:id', async (req, res) => {
  console.log('DELETE /api/pedidos/:id', req.params.id);
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.status(204).end();
  } catch (err) {
    console.error('Error al eliminar pedido:', err);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

// --- Productos (ABM) ---
// Crear producto
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, imagenUrl, disponible } = req.body;
  if (!nombre || precio == null) {
    return res.status(400).json({ error: 'Nombre y precio son requeridos' });
  }
  try {
    const nuevoProducto = await Producto.create({ nombre, descripcion, precio, imagenUrl, disponible });
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// Listar productos
app.get('/api/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Editar producto
app.put('/api/productos/:id', async (req, res) => {
  const { nombre, descripcion, precio, imagenUrl, disponible } = req.body;
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, precio, imagenUrl, disponible },
      { new: true }
    );
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al editar producto' });
  }
});

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Menú HTML simple en la raíz
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Menú Backend laofi</title>
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          h1 { color: #1e293b; }
          ul { margin-top: 1rem; }
          a { color: #2563eb; text-decoration: none; font-size: 1.1rem; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Menú Backend laofi</h1>
        <ul>
          <li><a href="/api/usuarios">ABM de Usuarios (GET)</a></li>
          <li><a href="/api/pedidos">ABM de Pedidos (GET)</a></li>
          <li><a href="/api/productos">ABM de Productos (GET)</a></li>
        </ul>
        <p>Usa herramientas como Postman o Insomnia para crear, editar o eliminar.</p>
      </body>
    </html>
  `);
});

// Endpoint para obtener notificaciones no entregadas
app.get('/api/notificaciones', async (req, res) => {
  const notificaciones = await Notificacion.find({ entregado: false }).populate({
    path: 'pedidoId',
    populate: [
      { path: 'usuarioId', select: 'nombre correo' },
      { path: 'items.productoId', select: 'nombre precio' }
    ]
  });
  res.json(notificaciones);
});

// Endpoint para marcar notificación como entregada
app.put('/api/notificaciones/:id', async (req, res) => {
  try {
    const notif = await Notificacion.findByIdAndUpdate(
      req.params.id,
      { entregado: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Express nuevo escuchando en puerto ${PORT}`);
});