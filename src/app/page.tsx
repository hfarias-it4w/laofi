
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FormEvent, useMemo, useState } from "react";
import { FaArrowRight, FaQuoteLeft, FaWhatsapp, FaFacebookMessenger, FaPhoneAlt, FaWifi } from "react-icons/fa";
import { PiCoffeeBold, PiUsersThreeFill } from "react-icons/pi";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { MdOutlineCleaningServices, MdLock, MdKitchen } from "react-icons/md";
import { TbBuildingSkyscraper } from "react-icons/tb";

type UserWithRole = {
  name?: string | null;
  email?: string | null;
  role?: string;
};

type ContactPreviewData = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
};

const heroImage = "http://localhost:3845/assets/ef4f6eb3143746c9fa2a3a07fe919842e92c98ac.png";
const mapImage = "http://localhost:3845/assets/4e3ff1c2363ffb610f692c5a9c3936dc7ef76a1e.png";
const logoPartners = [
  "http://localhost:3845/assets/a4dcd49e038abf0396bc0713086563430cc74b3b.png",
  "http://localhost:3845/assets/e246b60348fdce321368209f3897d7f4741113c8.png",
  "http://localhost:3845/assets/4c465a6b513e7f549af5fd2327bc7a46d2d603a7.png",
  "http://localhost:3845/assets/536041cd5b491d20f950cc9e704e7740cb22e6a7.png",
  "http://localhost:3845/assets/0425ce4f6f05a49df1664f163a652d871a14d630.png",
];

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user as UserWithRole | undefined;
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactFeedback, setContactFeedback] = useState<string | null>(null);
  const [contactPreview, setContactPreview] = useState<ContactPreviewData | null>(null);
  const isSubmittingContact = contactStatus === "loading";

  // The marketing page still adapts CTAs if the user is authenticated.
  const primaryCta = useMemo(() => {
    if (!user) {
      return { href: "/login", label: "Iniciar sesión" };
    }
    if (user.role === "admin") {
      return { href: "/pedidos", label: "Ir al panel" };
    }
    return { href: "/pedidos/realizar", label: "Pedir café" };
  }, [user]);

  const secondaryCta = user ? { href: "/pedidos/historial", label: "Historial" } : { href: "#contacto", label: "Contactanos" };

  const spaces = useMemo(
    () => [
      {
        title: "Oficina privada",
        description: "Espacios equipados y listos para que tu equipo se enfoque en el negocio.",
        image: "http://localhost:3845/assets/15c33a7e098e6e3c6236043dcc4e88b921f73834.png",
        cta: "Reservar espacio",
        highlight: true,
      },
      {
        title: "Espacio compartido",
        description: "Conectá con otras personas, trabajá con calma y activá nuevas oportunidades.",
        image: "http://localhost:3845/assets/4e3ff1c2363ffb610f692c5a9c3936dc7ef76a1e.png",
        cta: "Ver detalles",
      },
      {
        title: "Salas y eventos",
        description: "Workshops, reuniones y presentaciones con equipamiento premium.",
        image: "http://localhost:3845/assets/d8ebc217c03292b30ef25380969390c7a504a59b.png",
        cta: "Consultar disponibilidad",
      },
      {
        title: "Oficina a medida",
        description: "Diseñamos, equipamos y operamos un espacio exclusivo para tu compañía.",
        image: "http://localhost:3845/assets/9191df615a2751b51b9dc87815d32c883a24e6be.png",
        cta: "Hablemos",
        dark: true,
      },
    ],
    []
  );

  const services = useMemo(
    () => [
      { title: "Wifi de alta velocidad", description: "Conexión estable y ultrarrápida para videollamadas y trabajo intensivo.", icon: <FaWifi className="h-6 w-6" /> },
      { title: "Salas de reuniones", description: "Ambientes profesionales con tecnología para tus encuentros clave.", icon: <HiMiniBuildingOffice2 className="h-6 w-6" /> },
      { title: "Cocina equipada", description: "Zonas de break con todo lo necesario para recargar energías.", icon: <MdKitchen className="h-6 w-6" /> },
      { title: "Servicio de limpieza", description: "Higiene diaria para que cada espacio se mantenga impecable.", icon: <MdOutlineCleaningServices className="h-6 w-6" /> },
      { title: "Comunidad activa", description: "Conectá con emprendedores y equipos que se potencian mutuamente.", icon: <PiUsersThreeFill className="h-6 w-6" /> },
      { title: "Control de acceso", description: "Seguridad y tranquilidad con sistemas modernos 24/7.", icon: <MdLock className="h-6 w-6" /> },
      { title: "Recepción", description: "Recibimos a tus visitas y gestionamos tus envíos.", icon: <PiCoffeeBold className="h-6 w-6" /> },
      { title: "Isla de impresión", description: "Impresión, copias y escaneos con soporte dedicado.", icon: <TbBuildingSkyscraper className="h-6 w-6" /> },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        initials: "MG",
        name: "María González",
        role: "Diseñadora freelance",
        quote: "La Ofi transformó mi forma de trabajar. El ambiente es perfecto para enfocarme y la comunidad es increíble.",
      },
      {
        initials: "AM",
        name: "Ana Martínez",
        role: "Content creator",
        quote: "Conocí personas clave para mis proyectos. El espacio inspira y el equipo siempre está cerca.",
      },
      {
        initials: "CR",
        name: "Carlos Ruiz",
        role: "Desarrollador de software",
        quote: "Encontré el equilibrio entre profesionalismo y flexibilidad. Las salas equipadas son un plus.",
      },
    ],
    []
  );

  const contactOptions = useMemo(
    () => [
      {
        label: "WhatsApp",
        description: "Envianos un mensaje",
        href: "https://wa.me/541152633006",
        icon: <FaWhatsapp className="h-6 w-6" />,
      },
      {
        label: "Facebook Chat",
        description: "Hablemos por Messenger",
        href: "https://m.me/laofi",
        icon: <FaFacebookMessenger className="h-6 w-6" />,
      },
      {
        label: "11 5263 3006",
        description: "Llamanos cuando quieras",
        href: "tel:+541152633006",
        icon: <FaPhoneAlt className="h-6 w-6" />,
      },
    ],
    []
  );

  const updateContactField = (field: "name" | "email" | "company" | "message") => (value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
    if (contactStatus !== "idle") {
      setContactStatus("idle");
      setContactFeedback(null);
    }
    if (contactPreview) {
      setContactPreview(null);
    }
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus("loading");
    setContactFeedback(null);
    setContactPreview(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message = typeof data?.message === "string" ? data.message : "No pudimos enviar el mensaje.";
        setContactStatus("error");
        setContactFeedback(message);
        return;
      }
      if (data?.preview) {
        setContactStatus("success");
        setContactFeedback("Vista previa generada. No se envió correo real.");
        setContactPreview({
          to: String(data.preview.to ?? ""),
          from: String(data.preview.from ?? contactForm.email),
          subject: String(data.preview.subject ?? ""),
          text: String(data.preview.text ?? ""),
          html: String(data.preview.html ?? ""),
        });
        return;
      }
      setContactStatus("success");
      setContactFeedback("¡Gracias! Recibimos tu mensaje y nos pondremos en contacto a la brevedad.");
      setContactForm({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("Error al enviar contacto", error);
      setContactStatus("error");
      setContactFeedback("No pudimos enviar el mensaje. Intentá nuevamente en unos minutos.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Ir al inicio" className="flex items-center">
            <Image src="/logolaofi.svg" alt="La Ofi" width={112} height={40} priority />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
            <a className="hover:text-neutral-900" href="#espacios">Espacios</a>
            <a className="hover:text-neutral-900" href="#servicios">Servicios</a>
            <a className="hover:text-neutral-900" href="#ubicacion">Ubicaciones</a>
            <a className="hover:text-neutral-900" href="#testimonios">Testimonios</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href={secondaryCta.href}
              className="hidden rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:text-neutral-900 md:inline"
            >
              {secondaryCta.label}
            </Link>
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-4 py-2 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
            >
              {primaryCta.label}
              <FaArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          className="relative isolate overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Personas trabajando en un espacio moderno"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-transparent" />
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-6 px-6 py-32 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-[#fdca00]">Coworking flexible y oficinas privadas</p>
            <h1 id="hero-heading" className="max-w-3xl text-4xl font-black uppercase leading-tight md:text-6xl">
              La oficina que crece y se adapta a tu ritmo.
            </h1>
            <p className="max-w-2xl text-lg text-neutral-200">
              Gestionamos soluciones que se adaptan a tu equipo, no al revés. Sumate a un espacio flexible con servicios premium y comunidad activa.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
              >
                {primaryCta.label}
                <FaArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:border-white"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </section>

        <section id="espacios" className="mx-auto max-w-screen-xl px-6 pb-16 pt-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">El espacio a tu medida</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">Tené la infraestructura que tu startup necesita</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
              Infraestructura flexible lista para acompañar el ritmo de tu equipo. Elegí la experiencia que se alinea con tu forma de trabajar.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {spaces.map((space, index) => (
              <article
                key={space.title}
                className={`flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
                  space.dark ? "bg-neutral-900 text-white" : ""
                }`}
              >
                <div className="relative h-56">
                  <Image
                    src={space.image}
                    alt={space.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" aria-hidden />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-8">
                  <h3 className="text-xl font-semibold">{space.title}</h3>
                  <p className={`flex-1 text-sm ${space.dark ? "text-neutral-300" : "text-neutral-600"}`}>{space.description}</p>
                  <Link
                    href={primaryCta.href}
                    className={`inline-flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      space.dark
                        ? "bg-white text-neutral-900 hover:bg-neutral-200"
                        : space.highlight
                        ? "bg-[#fdca00] text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] hover:bg-[#f1be00]"
                        : "border border-neutral-300 text-neutral-900 hover:border-neutral-900"
                    }`}
                  >
                    {space.cta}
                    <FaArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="servicios" className="bg-white py-24">
          <div className="mx-auto max-w-screen-xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">Todo lo que necesitás</p>
              <h2 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">Nos ocupamos del lugar, vos de tu negocio</h2>
              <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
                Servicios pensados para que cada jornada sea más simple, productiva y enfocada.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div key={service.title} className="flex h-full flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">{service.title}</h3>
                  <p className="text-sm text-neutral-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ubicacion" className="mx-auto max-w-screen-xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">Siempre cerca de vos</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">Sedes estratégicas para estar en el mapa</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
              Nuestra sede principal se ubica en Av. Rivadavia 14084, Ramos Mejía. Tres pisos pensados para equipos y profesionales.
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[420px_1fr]">
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <h3 className="text-2xl font-bold text-neutral-900">Rivadavia, Ramos Mejía</h3>
              <p className="mt-3 text-sm text-neutral-600">
                Av. Rivadavia 14084, B1704 Ramos Mejía, Buenos Aires. Tres pisos listos para 4 a 20 puestos, coworking flexible, salas y eventos.
              </p>
              <dl className="mt-6 space-y-3 text-sm text-neutral-600">
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-neutral-900">Coworking flexible</dt>
                  <dd>24 puestos</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-neutral-900">Oficinas privadas</dt>
                  <dd>8 oficinas de 2 a 15 puestos</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-neutral-900">Salas de reunión</dt>
                  <dd>2 salas para 6 personas</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-neutral-900">Horarios</dt>
                  <dd>9:00 — 19:00</dd>
                </div>
              </dl>
              <Link
                href={primaryCta.href}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Ver espacios
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <Image
                src={mapImage}
                alt="Mapa de la sede en Ramos Mejía"
                fill
                unoptimized
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-screen-xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">Eligen La Ofi</p>
            <p className="mx-auto mt-4 max-w-xl text-neutral-600">
              Somos el aliado flexible de equipos innovadores. Sumate a la red de empresas que marcan el rumbo.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-10 opacity-70">
              {logoPartners.map((logo) => (
                <Image
                  key={logo}
                  src={logo}
                  alt="Empresa que elige La Ofi"
                  width={160}
                  height={48}
                  unoptimized
                  className="h-12 w-auto object-contain"
                />
              ))}
            </div>
          </div>
        </section>

        <section id="testimonios" className="mx-auto max-w-screen-xl px-6 py-24">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">Un lugar de confianza</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl">Historias reales de nuestra comunidad</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
              Personas y equipos que encontraron el espacio perfecto para hacer crecer sus proyectos.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="flex h-full flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-8 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <FaQuoteLeft className="h-8 w-8 text-[#fdca00]" />
                <blockquote className="flex-1 text-neutral-700">“{testimonial.quote}”</blockquote>
                <figcaption className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-base font-semibold text-white">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                    <p className="text-sm text-neutral-600">{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="contacto" className="bg-neutral-900 py-24 text-white">
          <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">¿Sabés qué servicio se adapta mejor a vos?</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight">Contactanos y diseñemos juntos la próxima oficina de tu equipo.</h2>
              <p className="mt-6 text-neutral-300">
                Descubrí cómo potenciar tu productividad en un ambiente que cuida cada detalle. Elegí el canal que te resulte más cómodo o completá el formulario y nos pondremos en contacto.
              </p>
              <ul className="mt-10 space-y-4">
                {contactOptions.map((option) => (
                  <li key={option.label}>
                    <a
                      href={option.href}
                      className="flex items-center gap-4 rounded-xl border border-white/20 p-4 transition hover:border-white"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-[#fdca00]">
                        {option.icon}
                      </span>
                      <span>
                        <span className="block text-sm text-neutral-300">{option.description}</span>
                        <span className="text-lg font-semibold text-white">{option.label}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <form
              onSubmit={handleContactSubmit}
              className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur"
              noValidate
            >
              <div className="space-y-4">
                {contactFeedback && (
                  <div
                    className={`rounded-lg border px-4 py-3 text-sm ${
                      contactStatus === "success"
                        ? "border-green-300 bg-green-50/90 text-green-900"
                        : "border-red-300 bg-red-50/90 text-red-900"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {contactFeedback}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-neutral-200" htmlFor="contact-name">
                    Tu nombre*
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none disabled:opacity-60"
                    placeholder="Ej: Sofía Pérez"
                    value={contactForm.name}
                    onChange={(event) => updateContactField("name")(event.target.value)}
                    disabled={isSubmittingContact}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-200" htmlFor="contact-email">
                    Tu correo*
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none disabled:opacity-60"
                    placeholder="hola@tuempresa.com"
                    value={contactForm.email}
                    onChange={(event) => updateContactField("email")(event.target.value)}
                    disabled={isSubmittingContact}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-200" htmlFor="contact-company">
                    Empresa
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none disabled:opacity-60"
                    placeholder="Nombre de la empresa"
                    value={contactForm.company}
                    onChange={(event) => updateContactField("company")(event.target.value)}
                    disabled={isSubmittingContact}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-200" htmlFor="contact-message">
                    Mensaje*
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none disabled:opacity-60"
                    placeholder="Contanos qué necesitás"
                    value={contactForm.message}
                    onChange={(event) => updateContactField("message")(event.target.value)}
                    disabled={isSubmittingContact}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmittingContact ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensaje
                      <FaArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {contactPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 px-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.4)]">
            <button
              className="absolute right-5 top-5 text-2xl text-neutral-400 transition hover:text-neutral-700"
              onClick={() => setContactPreview(null)}
              aria-label="Cerrar vista previa"
            >
              ×
            </button>
            <div className="flex flex-col gap-6 p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">Vista previa (modo no productivo)</p>
                <h3 className="text-2xl font-bold text-neutral-900">Se generó un email simulado</h3>
                <p className="text-sm text-neutral-600">
                  No se envió ningún correo real. Usá esta vista para validar el contenido antes de publicar en producción.
                </p>
              </div>
              <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                <div className="flex items-baseline gap-3">
                  <span className="w-20 font-semibold text-neutral-500">Para</span>
                  <span className="truncate text-neutral-900" title={contactPreview.to}>{contactPreview.to}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-20 font-semibold text-neutral-500">De</span>
                  <span className="truncate text-neutral-900" title={contactPreview.from}>{contactPreview.from}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="w-20 font-semibold text-neutral-500">Asunto</span>
                  <span className="text-neutral-900">{contactPreview.subject}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold text-neutral-800">Mensaje</span>
                <pre className="max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800 whitespace-pre-wrap">
                  {contactPreview.text}
                </pre>
                <details className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-xs text-neutral-600">
                  <summary className="cursor-pointer text-neutral-700">Ver versión HTML</summary>
                  <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white p-3 text-[11px] text-neutral-800">
                    <code className="whitespace-pre-wrap break-words">{contactPreview.html}</code>
                  </div>
                </details>
              </div>
              <button
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                onClick={() => setContactPreview(null)}
                type="button"
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-screen-xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-neutral-900 px-3 py-1 text-white">LAOFI</span>
              <p className="text-sm font-semibold text-neutral-900">Espacios flexibles para equipos que crecen.</p>
            </div>
            <p className="text-sm text-neutral-600">
              Donde creatividad y productividad se encuentran. Sumate a una comunidad que impulsa nuevas ideas todos los días.
            </p>
            <div className="flex gap-4 text-neutral-500">
              <a href="https://www.linkedin.com" className="transition hover:text-neutral-900">LinkedIn</a>
              <a href="https://www.instagram.com" className="transition hover:text-neutral-900">Instagram</a>
              <a href="https://www.facebook.com" className="transition hover:text-neutral-900">Facebook</a>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Enlaces</h3>
            <nav className="flex flex-col gap-2 text-sm text-neutral-600">
              <a href="#espacios" className="hover:text-neutral-900">Inicio</a>
              <a href="#servicios" className="hover:text-neutral-900">Servicios</a>
              <Link href={primaryCta.href} className="hover:text-neutral-900">
                Aplicación café
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-900">Contacto</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Av. Rivadavia 14084, Ramos Mejía</li>
              <li>11 5263 3006</li>
              <li>hola@laofi.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-200 py-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} La Ofi. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
