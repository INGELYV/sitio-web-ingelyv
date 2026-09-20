/**
 * POST /form/contacto — guarda una consulta del formulario en D1.
 *
 * Bindings (wrangler.toml / panel de Pages):
 *   DB                     -> base D1 "ingelyv-contacto"
 *   TURNSTILE_SECRET_KEY   -> secreto de Turnstile (variable de entorno cifrada)
 *
 * Responde siempre JSON. El sitio sigue abriendo WhatsApp aunque esto falle:
 * guardar la consulta es un respaldo, no un bloqueo para el visitante.
 */

const MAX = { nombre: 120, empresa: 120, telefono: 40, email: 160, servicio: 80, mensaje: 4000 };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const limpiar = (valor, max) =>
  typeof valor === 'string' ? valor.trim().replace(/\s+/g, ' ').slice(0, max) : '';

async function turnstileValido(token, secret, ip) {
  if (!secret) return true; // sin secreto configurado no se bloquea el envío
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = await r.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  let datos;
  try {
    datos = await request.json();
  } catch {
    return json({ ok: false, error: 'Formato inválido' }, 400);
  }

  const nombre = limpiar(datos.nombre, MAX.nombre);
  const mensaje = limpiar(datos.mensaje, MAX.mensaje);
  if (!nombre || !mensaje) return json({ ok: false, error: 'Faltan nombre o mensaje' }, 400);

  const ip = request.headers.get('cf-connecting-ip') || '';
  if (!(await turnstileValido(datos.turnstileToken, env.TURNSTILE_SECRET_KEY, ip))) {
    return json({ ok: false, error: 'Verificación antispam fallida' }, 403);
  }

  if (!env.DB) return json({ ok: false, error: 'Base de datos no configurada' }, 500);

  try {
    await env.DB.prepare(
      `INSERT INTO consultas (nombre, empresa, telefono, email, servicio, mensaje, pagina, ip_pais, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        nombre,
        limpiar(datos.empresa, MAX.empresa),
        limpiar(datos.telefono, MAX.telefono),
        limpiar(datos.email, MAX.email),
        limpiar(datos.servicio, MAX.servicio),
        mensaje,
        limpiar(datos.pagina, 200),
        request.cf?.country || '',
        (request.headers.get('user-agent') || '').slice(0, 300)
      )
      .run();
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: 'No se pudo guardar la consulta' }, 500);
  }
}

// Solo POST: cualquier otro método responde 405 (Pages resuelve el resto)
export const onRequestGet = () => json({ ok: false, error: 'Método no permitido' }, 405);
