import type { APIRoute } from 'astro';
import {
  CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL,
  RESEND_API_KEY,
} from 'astro:env/server';
import { profile } from '@data/profile';

export const prerender = false;

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
};

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = RESEND_API_KEY;
  const toEmail = CONTACT_TO_EMAIL ?? profile.email;
  const fromEmail = CONTACT_FROM_EMAIL ?? `Portfolio <onboarding@resend.dev>`;

  if (!apiKey) {
    return json(
      {
        ok: false,
        error: 'El envío por correo no está configurado en el servidor.',
      },
      503,
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: 'Solicitud inválida.' }, 400);
  }

  if (payload.company?.trim()) {
    return json({ ok: true });
  }

  const name = String(payload.name ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const message = String(payload.message ?? '').trim();

  if (!name || !email || !message) {
    return json({ ok: false, error: 'Complete nombre, correo y mensaje.' }, 400);
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return json({ ok: false, error: 'El mensaje es demasiado largo.' }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ ok: false, error: 'Indique un correo válido.' }, 400);
  }

  const subject = `Contacto portafolio — ${name}`;
  const text = [`Nombre: ${name}`, `Correo: ${email}`, '', message].join('\n');
  const html = `
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Correo:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p><strong>Mensaje:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
  `.trim();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('Resend error', response.status, detail);
    return json(
      {
        ok: false,
        error: 'No se pudo enviar el correo. Intente de nuevo en unos minutos.',
      },
      502,
    );
  }

  return json({ ok: true });
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
