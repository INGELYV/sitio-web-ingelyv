/**
 * Resuelve los parciales de partials/ y escribe el HTML final en dist/.
 *
 * Sintaxis en las páginas:
 *   <!-- include: header.html CTA_LABEL="Cotizar" CTA_MSG="Hola..." -->
 * Dentro del parcial, las variables se escriben como {{CTA_LABEL}}.
 * Una variable sin valor queda vacía; si sobra alguna sin reemplazar, el build falla.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'dist');
// El valor de una variable puede contener ">" (markup), así que se corta en el "-->"
const INCLUDE = /^([ \t]*)<!--\s*include:\s*([\w.-]+)([\s\S]*?)-->[ \t]*$/gm;

const leerParcial = (nombre) => readFileSync(join(ROOT, 'partials', nombre), 'utf8').trimEnd();

// Acepta KEY="valor" y KEY='valor' (las comillas simples permiten markup con atributos)
const parsearVars = (texto) =>
  Object.fromEntries(
    [...texto.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)')/g)].map((m) => [m[1], m[2] ?? m[3]])
  );

const resolver = (html, pagina) =>
  html.replace(INCLUDE, (_, sangria, parcial, attrs) => {
    let contenido = leerParcial(parcial);
    const vars = parsearVars(attrs);
    contenido = contenido.replace(/\{\{(\w+)\}\}/g, (m, clave) => {
      if (!(clave in vars)) throw new Error(`${pagina}: falta la variable ${clave} en <!-- include: ${parcial} -->`);
      return vars[clave];
    });
    // Respeta la sangría del comentario original
    return contenido.split('\n').map((l, i) => (i === 0 ? sangria + l : l)).join('\n');
  });

mkdirSync(OUT, { recursive: true });
const paginas = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
for (const pagina of paginas) {
  const html = resolver(readFileSync(join(ROOT, pagina), 'utf8'), pagina);
  if (html.includes('<!-- include:')) throw new Error(`${pagina}: quedaron includes sin resolver`);
  if (/\{\{\w+\}\}/.test(html)) throw new Error(`${pagina}: quedaron variables sin reemplazar`);
  writeFileSync(join(OUT, pagina), html);
}
console.log(`HTML generado: ${paginas.length} páginas con parciales resueltos.`);
