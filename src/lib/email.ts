import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 0;
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
const SMTP_SECURE = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
const CONTACT_FORM_RECIPIENT = process.env.CONTACT_FORM_RECIPIENT ?? "";

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

const ensureEnv = () => {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_FORM_RECIPIENT) {
    throw new Error("SMTP configuration is incomplete. Check CONTACT_FORM_RECIPIENT and SMTP_* variables.");
  }
};

const createTransporter = async () => {
  ensureEnv();
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.verify();
  return transporter;
};

const getTransporter = () => {
  if (!transporterPromise) {
    transporterPromise = createTransporter();
  }
  return transporterPromise;
};

export type ContactEmailPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export type ContactEmailContent = {
  subject: string;
  text: string;
  html: string;
};

export const buildContactEmail = ({ name, email, company, message }: ContactEmailPayload): ContactEmailContent => {
  const subject = `Nuevo contacto desde la web: ${name}`;
  const companyLine = company ? `\nEmpresa: ${company}` : "";
  const text = `Nombre: ${name}\nCorreo: ${email}${companyLine}\n\nMensaje:\n${message}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
      <h2 style="color: #111827;">Nuevo mensaje desde el formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ""}
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, "<br />")}</p>
    </div>
  `;
  return { subject, text, html };
};

export const sendContactEmail = async (payload: ContactEmailPayload) => {
  const transporter = await getTransporter();
  const content = buildContactEmail(payload);

  await transporter.sendMail({
    from: {
      name: "La Ofi Contacto",
      address: SMTP_USER,
    },
    to: CONTACT_FORM_RECIPIENT,
    replyTo: payload.email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });
};
