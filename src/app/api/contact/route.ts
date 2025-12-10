import { NextRequest, NextResponse } from "next/server";
import { buildContactEmail, sendContactEmail } from "@/lib/email";

const MAX_MESSAGE_LENGTH = 2000;

const sanitizeHtml = (value: string) => value.replace(/[<>]/g, "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "No pudimos leer la información del formulario." }, { status: 400 });
  }

  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const rawCompany = typeof body.company === "string" ? body.company.trim() : "";
  const rawMessage = typeof body.message === "string" ? body.message.trim() : "";

  if (!rawName || !rawEmail || !rawMessage) {
    return NextResponse.json({ message: "Por favor completá nombre, correo y mensaje." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
    return NextResponse.json({ message: "Ingresá un correo válido." }, { status: 400 });
  }

  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ message: "El mensaje es demasiado extenso." }, { status: 400 });
  }

  const sanitizedPayload = {
    name: sanitizeHtml(rawName),
    email: rawEmail,
    company: sanitizeHtml(rawCompany),
    message: sanitizeHtml(rawMessage),
  };

  const emailContent = buildContactEmail(sanitizedPayload);
  const isProduction = process.env.NODE_ENV === "production";
  const toAddress = process.env.CONTACT_FORM_RECIPIENT || process.env.SMTP_USER || "contacto-pruebas@laofi.com";

  if (!isProduction) {
    return NextResponse.json({
      ok: true,
      preview: {
        to: toAddress,
        from: sanitizedPayload.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      },
    });
  }

  try {
    await sendContactEmail(sanitizedPayload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending contact email", error);
    return NextResponse.json({ message: "No pudimos enviar tu mensaje. Probá más tarde." }, { status: 500 });
  }
}
