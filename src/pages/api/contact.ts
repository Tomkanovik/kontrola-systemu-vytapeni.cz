import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Error parsing form data:', error);
    return new Response(
      JSON.stringify({ message: 'Chyba při zpracování dat formuláře.' }),
      { status: 400 }
    );
  }

  // Extract fields
  const gotcha = formData.get('_gotcha');
  const objectType = formData.get('object-type');
  const power = formData.get('power');
  const location = formData.get('location');
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone') || 'neuvedeno';

  // 1. Honeypot check
  if (gotcha) {
    return new Response(
      JSON.stringify({ message: 'Spam detected' }),
      { status: 400 }
    );
  }

  // 2. Validation
  if (!objectType || !power || !location || !name || !email) {
    return new Response(
      JSON.stringify({ message: 'Všechna povinná pole musí být vyplněna.' }),
      { status: 400 }
    );
  }

  // Basic email format validation
  const emailStr = email.toString();
  if (!emailStr.includes('@') || !emailStr.includes('.')) {
    return new Response(
      JSON.stringify({ message: 'Neplatný formát e-mailu.' }),
      { status: 400 }
    );
  }

  // 3. Send email via Resend
  // Access environment variables from Cloudflare context
  // @ts-ignore - runtime/env might not be typed in all environments
  const env = locals.runtime?.env || process.env;
  const RESEND_API_KEY = env?.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY');
    return new Response(
      JSON.stringify({ message: 'Chyba konfigurace serveru.' }),
      { status: 500 }
    );
  }

  const emailBody = `
    Nová poptávka na kontrolu systému vytápění

    Jméno: ${name}
    E-mail: ${email}
    Telefon: ${phone}

    Typ objektu: ${objectType}
    Příkon: ${power} kW
    Lokalita: ${location}
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Nová poptávka <noreply@mg.kontrola-systemu-vytapeni.cz>',
        to: 'info@kontrola-systemu-vytapeni.cz',
        reply_to: emailStr,
        subject: `Poptávka kontroly: ${name} - ${location}`,
        text: emailBody,
      }),
    });

    if (res.ok) {
      return new Response(
        JSON.stringify({ message: 'Email sent successfully' }),
        { status: 200 }
      );
    } else {
      const errorData = await res.json();
      console.error('Resend error:', errorData);
      return new Response(
        JSON.stringify({ message: 'Chyba při odesílání e-mailu.' }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return new Response(
      JSON.stringify({ message: 'Selhalo spojení s e-mailovou službou.' }),
      { status: 500 }
    );
  }
};
