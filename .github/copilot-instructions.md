<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrucciones para Copilot

Aplicación móvil para pedidos de café en La Ofi

Requerimientos funcionales y técnicos
1. Objetivo General
Crear una aplicación móvil para clientes registrados de La Ofi (coworkers y oficinas privadas) que permita:
•	Comprar café directamente desde el celular
•	Realizar el pago con Mercado Pago, MODO o efectivo
•	Notificar automáticamente el pedido a la recepción para su preparación
2. Características Funcionales
2.1 Autenticación de personas usuarias
•	Inicio de sesión con correo electrónico y contraseña
•	Alta y validación de personas usuarias por parte de la administración de La Ofi (no pública)
2.2 Pantalla de Inicio
•	Bienvenida personalizada (nombre de la persona usuaria)
•	Acceso directo a “Pedir Café”
•	Acceso al historial de pedidos
2.3 Menú de Cafetería
•	Solo muestra los productos que puede preparar la máquina de café automática Central de Café
•	Ejemplos de productos:
•	Espresso
•	Lungo
•	Capuccino
•	Cortado
•	Latte
Cada producto incluye:
Imagen (opcional)
Descripción
Precio
Botón "Agregar al carrito"
2.4 Carrito y Confirmación
•	Resumen de productos seleccionados
•	Opción de agregar comentarios (“sin azúcar”, “doble”, etc.)
•	Selección de método de pago:
o	Mercado Pago (link directo)
o	MODO (link directo)
o	Efectivo (se paga al retirar)
2.5 Confirmación y Notificación
•	Al confirmar el pedido:
o	Registro en el backend
o	Notificación automática a la recepción
•	Opciones de notificación:
o	Interfaz web en la PC de recepción (Windows), con alerta sonora y visual
2.6 Historial de la persona usuaria
•	Listado de pedidos anteriores
•	Opción de “Repetir pedido”
3. Notificaciones para Recepción
Aplicación Web de Recepción
•	Interfaz web en tiempo real
•	Vista en pantalla de pedidos entrantes
•	Alerta sonora 
•	Opción de “marcar como preparado”
5. Roles de personas usuarias
Rol: Cliente
Funcionalidad del rol Cliente: Hacer pedidor, ver historial de pedidos
Rol: Admin 
Funcionalidad del rol Admin: Ver y administrar pedidos, gestionar usuarios, estadísticas
