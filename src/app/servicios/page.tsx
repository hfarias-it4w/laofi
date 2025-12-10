"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import {
  FaArrowRight,
  FaFacebookMessenger,
  FaPhoneAlt,
  FaWifi,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { MdKitchen, MdLock, MdOutlineCleaningServices } from "react-icons/md";
import { PiCoffeeBold, PiUsersThreeFill } from "react-icons/pi";
import { TbBuildingSkyscraper } from "react-icons/tb";

const heroImage = "http://localhost:3845/assets/ef4f6eb3143746c9fa2a3a07fe919842e92c98ac.png";
const heroOverlay = "http://localhost:3845/assets/5d56f887b01e7e2a4182728ed407b7807c0ad0dd.png";
const spaceImages = {
  shared: "http://localhost:3845/assets/80ef31a507e6794bd35596076285cbdf1466b2aa.png",
  private: "http://localhost:3845/assets/1770f4ac1152a70a157c5452373012a66c8a4621.png",
  meeting: "http://localhost:3845/assets/536e979a6f5da93dd0033f1a6249b785f9eacabc.png",
  virtual: "http://localhost:3845/assets/15c33a7e098e6e3c6236043dcc4e88b921f73834.png",
  custom: "http://localhost:3845/assets/2dbd54ff1074508bbef80ff949a8b3b8f3e7971d.png",
};

const devicesMock = "http://localhost:3845/assets/072267707a5455bd702aa5a4fe029ae8248ccd1c.png";

type ServiceFeature = {
  title: string;
  description: string;
  icon: ReactNode;
};

type SpaceCard = {
  title: string;
  description: string;
  badge: string;
  suitability: string;
  actionLabel: string;
  ctaVariant: "highlight" | "dark";
  image: string;
};

type ContactOption = {
  label: string;
  description: string;
  href: string;
  icon: ReactNode;
};

const services: ServiceFeature[] = [
  {
    title: "Wifi de alta velocidad",
    description:
      "Conexión estable y ultrarrápida para videollamadas y trabajo intensivo.",
    icon: <FaWifi className="h-6 w-6" />,
  },
  {
    title: "Salas de reuniones",
    description: "Ambientes profesionales con tecnología para tus encuentros clave.",
    icon: <HiMiniBuildingOffice2 className="h-6 w-6" />,
  },
  {
    title: "Cocina equipada",
    description: "Zonas de break con todo lo necesario para recargar energías.",
    icon: <MdKitchen className="h-6 w-6" />,
  },
  {
    title: "Servicio de limpieza",
    description: "Higiene diaria para que cada espacio se mantenga impecable.",
    icon: <MdOutlineCleaningServices className="h-6 w-6" />,
  },
  {
    title: "Comunidad activa",
    description: "Conectá con emprendedores y equipos que se potencian mutuamente.",
    icon: <PiUsersThreeFill className="h-6 w-6" />,
  },
  {
    title: "Control de acceso",
    description: "Seguridad y tranquilidad con sistemas modernos 24/7.",
    icon: <MdLock className="h-6 w-6" />,
  },
  {
    title: "Recepción",
    description: "Recibimos a tus visitas y gestionamos tus envíos.",
    icon: <PiCoffeeBold className="h-6 w-6" />,
  },
  {
    title: "Isla de impresión",
    description: "Impresión, copias y escaneos con soporte dedicado.",
    icon: <TbBuildingSkyscraper className="h-6 w-6" />,
  },
];

const spaces: SpaceCard[] = [
  {
    title: "Espacio compartido",
    description:
      "Enfocate en tu negocio mientras creás vínculos, con salas y servicios disponibles cuando los necesites.",
    badge: "24 puestos",
    suitability: "Especial para profesionales, freelance y pequeños emprendimientos.",
    actionLabel: "¡Agendá un día gratis!",
    ctaVariant: "highlight" as const,
    image: spaceImages.shared,
  },
  {
    title: "Oficina privada",
    description:
      "La tranquilidad de un espacio propio con infraestructura premium y soporte permanente.",
    badge: "10 puestos",
    suitability: "Ideal para equipos que necesitan privacidad y silencio.",
    actionLabel: "Reservá tu espacio",
    ctaVariant: "highlight" as const,
    image: spaceImages.private,
  },
  {
    title: "Sala de reuniones y eventos",
    description:
      "Espacios versátiles y equipados para workshops, clientes y team buildings.",
    badge: "Hasta 50 personas",
    suitability: "Perfecto para sesiones de coaching, reuniones y grupos grandes.",
    actionLabel: "Reservar espacio",
    ctaVariant: "highlight" as const,
    image: spaceImages.meeting,
  },
  {
    title: "Oficina virtual",
    description:
      "Dirección comercial, recepción de correspondencia y telefonía IP para fortalecer tu presencia.",
    badge: "Vacantes ilimitadas",
    suitability: "Ideal para equipos remotos y profesionales independientes.",
    actionLabel: "Solicitar servicio",
    ctaVariant: "dark" as const,
    image: spaceImages.virtual,
  },
  {
    title: "Oficina propia",
    description:
      "Buscamos, diseñamos y operamos tu oficina llave en mano. Vos definís el estilo, nosotros resolvemos todo.",
    badge: "Nos adaptamos a tu espacio",
    suitability: "Tu propia oficina como servicio by La Ofi.",
    actionLabel: "Solicitar servicio",
    ctaVariant: "dark" as const,
    image: spaceImages.custom,
  },
];

const contactOptions: ContactOption[] = [
  {
    label: "Whatsapp",
    description: "Envíanos un mensaje",
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
    description: "Llamanos al",
    href: "tel:+541152633006",
    icon: <FaPhoneAlt className="h-6 w-6" />,
  },
];

export default function ServiciosPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const primaryCta = user
    ? user.role === "admin"
      ? { href: "/pedidos", label: "Ir al panel" }
      : { href: "/pedidos/realizar", label: "Pedir café" }
    : { href: "/login", label: "Iniciar sesión" };

  const secondaryCta = user
    ? { href: "/pedidos/historial", label: "Historial" }
    : { href: "#contacto", label: "Contactanos" };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Ir al inicio" className="flex items-center">
            <Image src="/logolaofi.svg" alt="La Ofi" width={112} height={40} priority />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex">
            <Link className="hover:text-neutral-900" href="/">
              Inicio
            </Link>
            <Link className="rounded-lg bg-[#fae79a] px-3 py-1 text-neutral-900" href="/servicios">
              Servicios
            </Link>
            <Link className="hover:text-neutral-900" href="/pedidos/realizar">
              App Café
            </Link>
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
        <section className="relative isolate overflow-hidden" aria-labelledby="services-hero">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Personas trabajando en un espacio compartido"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <Image
              src={heroOverlay}
              alt="Personas colaborando"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-transparent" />
          <div className="relative mx-auto flex max-w-screen-xl flex-col gap-6 px-6 py-32 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-[#fdca00]">Servicios</p>
            <h1 id="services-hero" className="max-w-3xl text-4xl font-black uppercase leading-tight md:text-6xl">
              Simplificamos tu trabajo
            </h1>
            <p className="max-w-2xl text-lg text-neutral-200">
              Trabajar no tiene por qué ser complicado. En La Ofi tenés todo lo necesario para enfocarte en lo importante mientras nosotros nos encargamos del resto.
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

        <section className="bg-white py-24" aria-labelledby="services-benefits">
          <div className="mx-auto max-w-screen-xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">
              Disfrutá la experiencia completa
            </p>
            <h2 id="services-benefits" className="mt-3 text-3xl font-bold text-neutral-900 md:text-4xl">
              Todos nuestros espacios incluyen estos servicios
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex h-full flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                    {service.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900">{service.title}</h3>
                  <p className="text-sm text-neutral-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-screen-xl px-6 pb-8" aria-labelledby="spaces-heading">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">El espacio a tu medida</p>
            <h2 id="spaces-heading" className="mt-3 text-3xl font-bold text-neutral-900 md:text-4xl">
              Tu oficina como un servicio
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-600">
              Elegí la solución que acompaña el ritmo de tu equipo y escala cuando lo necesités.
            </p>
          </div>
          <div className="mt-14 flex flex-col gap-12">
            {spaces.map((space, index) => {
              const imageOnLeft = index % 2 !== 0;
              return (
                <article
                  key={space.title}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <div className={`grid gap-8 md:grid-cols-2 ${imageOnLeft ? "md:[&>div:first-child]:order-2" : ""}`}>
                    <div className="flex flex-col gap-6 px-8 py-10">
                      <div className="space-y-3 text-left">
                        <div className="inline-block rounded-md bg-neutral-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                          {space.badge}
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900">{space.title}</h3>
                        <p className="text-sm text-neutral-600">{space.description}</p>
                      </div>
                      <div className="flex flex-col gap-4 text-sm text-neutral-600">
                        <div className="flex items-start gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900">
                            <PiCoffeeBold className="h-6 w-6" />
                          </span>
                          <p className="pt-1 text-neutral-700">{space.suitability}</p>
                        </div>
                      </div>
                      <Link
                        href={primaryCta.href}
                        className={`inline-flex items-center gap-2 self-start rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                          space.ctaVariant === "highlight"
                            ? "bg-[#fdca00] text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] hover:bg-[#f1be00]"
                            : "bg-neutral-900 text-white shadow-[0_10px_40px_-10px_rgba(26,26,26,0.4)] hover:bg-neutral-800"
                        }`}
                      >
                        {space.actionLabel}
                        <FaArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="relative h-72 md:h-full">
                      <Image
                        src={space.image}
                        alt={space.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-white py-24" aria-labelledby="app-section">
          <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">
                Visitá nuestra app
              </p>
              <h2 id="app-section" className="mt-3 text-3xl font-bold text-neutral-900 md:text-4xl">
                Gestioná tus pedidos sin moverte del escritorio
              </h2>
              <p className="mt-4 max-w-xl text-neutral-600">
                Pedí café, consultá tu historial y elegí medios de pago desde tu teléfono o notebook. Todo pensado para que tu equipo no pierda tiempo.
              </p>
              <Link
                href="/pedidos/realizar"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#fdca00] px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
              >
                Ingresar
                <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative mx-auto h-80 w-72">
              <Image
                src={devicesMock}
                alt="Mockups de la app de La Ofi"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section id="contacto" className="bg-neutral-900 py-24 text-white" aria-labelledby="contact-heading">
          <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fdca00]">
                ¿Sabés qué servicio se adapta mejor a vos?
              </p>
              <h2 id="contact-heading" className="mt-4 text-4xl font-bold leading-tight">
                Contactanos y trabajemos en la solución perfecta para tu equipo.
              </h2>
              <p className="mt-6 text-neutral-300">
                Contanos qué necesitás y creamos una propuesta a tu medida. Elegí el canal que prefieras o completá el formulario y te respondemos a la brevedad.
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
            <form className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-200" htmlFor="contact-name">
                    Tu nombre*
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                    placeholder="Ej: Sofía Pérez"
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
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                    placeholder="hola@tuempresa.com"
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
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                    placeholder="Nombre de la empresa"
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
                    className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-neutral-400 focus:border-[#fdca00] focus:outline-none"
                    placeholder="Contanos qué necesitás"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#fdca00] px-6 py-3 text-base font-semibold text-neutral-900 shadow-[0_10px_40px_-10px_rgba(253,202,0,0.6)] transition hover:bg-[#f1be00]"
                >
                  Enviar mensaje
                  <FaArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        <footer className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto grid max-w-screen-xl gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-neutral-900 px-3 py-1 text-white">LAOFI</span>
                <p className="text-sm font-semibold text-neutral-900">Espacios flexibles para equipos que crecen.</p>
              </div>
              <p className="text-sm text-neutral-600">
                Creatividad y productividad conviven en nuestras sedes. Sumate a una comunidad que impulsa nuevas ideas cada día.
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
                <Link href="/" className="hover:text-neutral-900">
                  Inicio
                </Link>
                <Link href="/servicios" className="hover:text-neutral-900">
                  Servicios
                </Link>
                <Link href={primaryCta.href} className="hover:text-neutral-900">
                  App Café
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
      </main>
    </div>
  );
}
