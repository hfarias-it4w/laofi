"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import type { IconType } from "react-icons";
import { FaArrowRight, FaMinus, FaMoneyBillWave, FaPlus, FaRegClock } from "react-icons/fa";
import { PiCoffeeBold } from "react-icons/pi";
import { RiSecurePaymentLine } from "react-icons/ri";

interface Producto {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

interface PedidoProducto {
  producto: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

const METODOS_PAGO: Array<{
  value: "mercadopago" | "efectivo";
  label: string;
  helper: string;
  badge: string;
  icon: IconType;
}> = [
  {
    value: "mercadopago",
    label: "Mercado Pago",
    helper: "Pago online con link seguro",
    badge: "Link directo",
    icon: RiSecurePaymentLine,
  },
  {
    value: "efectivo",
    label: "Efectivo",
    helper: "10% off abonando en recepción",
    badge: "Descuento 10%",
    icon: FaMoneyBillWave,
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);

export default function RealizarPedidoPage() {
  const { data: session } = useSession();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState("mercadopago");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isLoadingProductos, setIsLoadingProductos] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
  const [nota, setNota] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setProductos(Array.isArray(data) ? data : []);
      })
      .catch(() => setProductos([]))
      .finally(() => mounted && setIsLoadingProductos(false));
    return () => {
      mounted = false;
    };
  }, []);

  const preciosCalculados = useMemo(() => {
    if (!selectedProducto) {
      return { precioUnitario: 0, precioConDescuento: 0, total: 0, totalConDescuento: 0 };
    }
    const precioUnitario = selectedProducto.price;
    const applyDiscount = metodoPago === "efectivo";
    const precioConDescuento = applyDiscount ? precioUnitario * 0.9 : precioUnitario;
    const total = precioUnitario * cantidad;
    const totalConDescuento = applyDiscount ? total * 0.9 : total;
    return { precioUnitario, precioConDescuento, total, totalConDescuento };
  }, [selectedProducto, cantidad, metodoPago]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId) {
      setMensaje("Seleccioná un producto antes de continuar.");
      return;
    }
    const producto = productos.find((p) => p._id === productoId);
    if (!producto) {
      setMensaje("No encontramos ese producto. Actualizá la página e intentá nuevamente.");
      return;
    }
    const esEfectivo = metodoPago === "efectivo";
    const precioUnitario = producto.price;
    const precioUnitarioConDescuento = esEfectivo ? precioUnitario * 0.9 : precioUnitario;
    const productosPedido: PedidoProducto[] = [
      {
        producto: producto._id,
        nombre: producto.name,
        cantidad,
        precio: Number(precioUnitarioConDescuento.toFixed(2)),
      },
    ];
    const total = cantidad * precioUnitarioConDescuento;
    if (metodoPago === "mercadopago") {
      try {
        const external_reference = `${producto._id}-${Date.now()}`;
        const res = await fetch("/api/mercado-pago/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productos: productosPedido, external_reference }),
        });
        const data = await res.json();
        if (!res.ok || !data.preference || !data.preference.init_point) {
          setMensaje((data && (data.error || data.message || JSON.stringify(data))) || "Error al crear preferencia de pago");
          return;
        }
        setMensaje(null);
        window.location.href = data.preference.init_point;
        return;
      } catch (err) {
        setMensaje(
          "Error al conectar con Mercado Pago: " +
            (err instanceof Error ? err.message : String(err))
        );
      }
      return;
    }
    const payload: Record<string, unknown> = {
      productos: productosPedido,
      metodoPago,
      total,
    };
    if (nota.trim()) {
      payload.comentarios = nota.trim();
    }

    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setCantidad(1);
      setShowModal(false);
      setNota("");
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setMensaje(null);
      setTimeout(() => {
        window.location.href = "pedido-exitoso";
      }, 400);
    } else {
      const err = await res.json().catch(() => ({}));
      setMensaje(err.message || "No pudimos guardar tu pedido. Intentá nuevamente en unos segundos.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <audio ref={audioRef} src="/positive-notification.wav" preload="auto" />
      <section className="border-b border-neutral-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6 px-6 py-12 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#fae79a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900">
              <PiCoffeeBold className="h-4 w-4" /> Pedí tu café
            </span>
            <h1 className="text-4xl font-black uppercase leading-tight md:text-5xl">
              Tu café favorito llega directo a tu escritorio
            </h1>
            <p className="max-w-xl text-neutral-600">
              Elegí el producto, definí la cantidad y pagá como prefieras. Cuando confirmás tu pedido, recepción recibe la notificación al instante.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                <FaRegClock className="h-4 w-4 text-[#fdca00]" /> Listo en minutos
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm">
                <FaMoneyBillWave className="h-4 w-4 text-[#fdca00]" /> 10% off en efectivo
              </span>
            </div>
          </div>
          <div className="flex w-full flex-1 flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] md:max-w-sm">
            <h2 className="text-lg font-semibold">¿Cómo funciona?</h2>
            <ol className="space-y-3 text-sm text-neutral-600">
              <li><strong>1.</strong> Elegí tu café preferido.</li>
              <li><strong>2.</strong> Definí la cantidad y el método de pago.</li>
              <li><strong>3.</strong> Confirmá y esperá la notificación de recepción.</li>
            </ol>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
              onClick={() => {
                const section = document.getElementById("productos-listado");
                section?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver menú
              <FaArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-screen-xl px-6 pb-24" id="productos-listado">
        <header className="flex flex-col gap-2 pt-16 pb-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Seleccioná tu café</h2>
          <p className="mx-auto max-w-2xl text-neutral-600">
            Nuestros baristas preparan cada bebida con granos recién molidos. Podés pagar con Mercado Pago o en efectivo con descuento exclusivo para coworkers.
          </p>
        </header>

        {mensaje && (
          <div className="mx-auto mb-8 max-w-screen-md rounded-lg border border-[#fdca00]/40 bg-[#fff7d1] px-4 py-3 text-sm text-neutral-800">
            {mensaje}
          </div>
        )}

        {isLoadingProductos ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              >
                <div className="mb-4 h-40 w-full rounded-xl bg-neutral-100" />
                <div className="mb-3 h-4 w-2/3 rounded bg-neutral-200" />
                <div className="mb-6 h-4 w-1/2 rounded bg-neutral-200" />
                <div className="h-10 w-full rounded-lg bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-neutral-500">
            Aún no hay productos disponibles. Volvé más tarde o avisá a recepción.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => (
              <article
                key={producto._id}
                className="group flex flex-col justify-between rounded-2xl border border-transparent bg-white p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 hover:border-[#fdca00]"
              >
                <div>
                  <div className="relative mb-5 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    {producto.image ? (
                      <Image
                        src={producto.image}
                        alt={producto.name}
                        width={400}
                        height={160}
                        className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center text-neutral-400">
                        <PiCoffeeBold className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">{producto.name}</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {producto.description ?? "Preparado con nuestros granos seleccionados para que disfrutes cada pausa."}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-bold text-neutral-900">{formatCurrency(producto.price)}</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    onClick={() => {
                      setSelectedProducto(producto);
                      setProductoId(producto._id);
                      setShowModal(true);
                      setCantidad(1);
                      setMetodoPago("mercadopago");
                      setNota("");
                      setMensaje(null);
                    }}
                  >
                    Pedir ahora
                    <FaArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 px-4">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]">
            <button
              className="absolute right-5 top-5 text-2xl text-neutral-400 transition hover:text-neutral-700"
              onClick={() => {
                setShowModal(false);
                setNota("");
              }}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="grid gap-8 p-8 md:grid-cols-[280px_1fr]">
              <div className="flex flex-col gap-5 rounded-2xl bg-neutral-50 p-6">
                <div className="flex flex-col items-center text-center">
                  {selectedProducto?.image ? (
                    <Image
                      src={selectedProducto.image}
                      alt={selectedProducto.name}
                      width={160}
                      height={160}
                      className="h-40 w-40 rounded-2xl border border-neutral-200 object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-400">
                      <PiCoffeeBold className="h-10 w-10" />
                    </div>
                  )}
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                    Paso final
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-neutral-900">
                    {session?.user?.name ? `Hola, ${session.user.name.split(" ")[0]}!` : "Confirmá tu café"}
                  </h2>
                  <p className="mt-2 max-w-[16rem] text-sm text-neutral-600">
                    Estamos preparando <strong>{selectedProducto?.name}</strong>. Ajustá los detalles y avisamos a recepción.
                  </p>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
                  <span className="text-sm font-semibold text-neutral-800">Resumen rápido</span>
                  <div className="flex items-center justify-between text-sm text-neutral-600">
                    <span>Precio unitario</span>
                    <span className="font-semibold text-neutral-900">
                      {formatCurrency(preciosCalculados.precioConDescuento)}
                    </span>
                  </div>
                  {metodoPago === "efectivo" && (
                    <div className="flex items-center justify-between text-xs text-[#b07a00]">
                      <span>Incluye 10% OFF por efectivo</span>
                      <span>{formatCurrency(preciosCalculados.precioUnitario)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-3 text-base font-semibold text-neutral-900">
                    <span>Total</span>
                    <span>{formatCurrency(preciosCalculados.totalConDescuento)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Recepción recibe este resumen y tu nota al instante.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {session ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-neutral-800">Cantidad</span>
                      <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-2">
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                          onClick={() => setCantidad((prev) => (prev > 1 ? prev - 1 : 1))}
                          aria-label="Disminuir cantidad"
                        >
                          <FaMinus />
                        </button>
                        <div className="flex flex-1 items-center justify-center rounded-lg bg-white px-6 py-2 text-base font-semibold text-neutral-900">
                          {cantidad}
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                          onClick={() => setCantidad((prev) => prev + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    <fieldset className="flex flex-col gap-3">
                      <legend className="text-sm font-semibold text-neutral-800">Método de pago</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {METODOS_PAGO.map((metodo) => {
                          const MetodoIcon = metodo.icon;
                          const activo = metodoPago === metodo.value;
                          return (
                            <button
                              key={metodo.value}
                              type="button"
                              onClick={() => setMetodoPago(metodo.value)}
                              className={`flex h-full flex-col justify-between rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fdca00] ${
                                activo ? "border-[#fdca00] bg-[#fff7d1]" : "border-neutral-200 bg-white hover:border-neutral-300"
                              }`}
                              aria-pressed={activo}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-neutral-900">{metodo.label}</span>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  activo ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"
                                }`}>
                                  {metodo.badge}
                                </span>
                              </div>
                              <p className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
                                <MetodoIcon className="h-5 w-5 text-[#fdca00]" />
                                {metodo.helper}
                              </p>
                              <span className="sr-only">Seleccionar {metodo.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <label className="flex flex-col gap-2 text-sm font-semibold text-neutral-800" htmlFor="nota-pedido">
                      Nota para recepción (opcional)
                      <textarea
                        id="nota-pedido"
                        className="min-h-[80px] rounded-lg border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                        placeholder="Ej: sin azúcar, agregar hielo, entregar en sala Norte"
                        value={nota}
                        onChange={(event) => setNota(event.target.value)}
                        maxLength={200}
                      />
                    </label>

                    <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-500">
                      <span className="text-sm font-semibold text-neutral-800">Antes de confirmar</span>
                      <p>
                        Revisá la cantidad y el método de pago. Si elegís Mercado Pago te redirigimos al link seguro. Si pagás en efectivo, abonás al retirar en recepción.
                      </p>
                    </div>

                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-base font-semibold text-white transition hover:bg-neutral-800"
                      type="submit"
                    >
                      Confirmar pedido
                      <FaArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-neutral-600">Iniciá sesión para completar tu pedido.</p>
                    <button
                      className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
                      onClick={() => signIn()}
                    >
                      Iniciar sesión
                      <FaArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {mensaje && (
              <div className="border-t border-neutral-200 bg-neutral-50 px-8 py-4 text-center text-sm text-neutral-600">
                {mensaje}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
