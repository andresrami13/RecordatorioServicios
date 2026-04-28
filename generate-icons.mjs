/**
 * Generador de íconos PWA — MisRecibos
 * Produce tres archivos:
 *   icon-192.png   → regular, con esquinas redondeadas  (purpose: any)
 *   icon-512.png   → regular, con esquinas redondeadas  (purpose: any)
 *   icon-maskable.png → maskable, fondo full-bleed,
 *                       rayo en zona segura (80 %)       (purpose: maskable)
 *
 * Uso: node generate-icons.mjs
 */
import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('./public/icons', { recursive: true })

// ── Paleta ───────────────────────────────────────────────────
const C1 = '#667eea'   // inicio degradado
const C2 = '#764ba2'   // fin degradado

// ── Rayo base (diseñado en 512 × 512) ────────────────────────
// Vértices del polígono del rayo
const BOLT_512 = [
  [299, 68],
  [184, 284],
  [252, 284],
  [206, 444],
  [326, 228],
  [258, 228],
]

/**
 * Escala y centra los vértices del rayo.
 * @param {number} size   tamaño del lienzo
 * @param {number} factor escala relativa al tamaño (0–1)
 */
function scaleBolt(size, factor) {
  // Centro original del rayo en espacio 512×512
  const origCx = (184 + 326) / 2   // ≈ 255
  const origCy = (68  + 444) / 2   // ≈ 256
  const origSize = 512

  return BOLT_512.map(([x, y]) => {
    const nx = ((x - origCx) / origSize) * size * factor + size / 2
    const ny = ((y - origCy) / origSize) * size * factor + size / 2
    return `${nx.toFixed(1)},${ny.toFixed(1)}`
  }).join(' ')
}

// ── SVG regular (con esquinas redondeadas) ────────────────────
function svgRegular(size) {
  const r     = size * 0.195          // radio de esquinas
  const bolt  = scaleBolt(size, 0.78) // rayo ocupa el 78 % del lienzo
  const cx = size / 2, cy = size * 0.51, cr = size * 0.295

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C1}"/>
      <stop offset="100%" stop-color="${C2}"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="51%" r="50%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%"   stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#bg)"/>
  <rect x="1" y="1" width="${size-2}" height="${size-2}" rx="${r}" ry="${r}"
        fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="${size*0.008}"/>
  <circle cx="${cx}" cy="${cy}" r="${cr}" fill="url(#halo)"/>
  <polygon points="${bolt}" fill="white" opacity="0.97"/>
  <polygon points="${bolt}" fill="url(#shimmer)" opacity="0.18"/>
</svg>`
}

// ── SVG maskable (full-bleed, rayo en zona segura 65 %) ───────
// Android recorta el ícono en círculo/squircle — sin esquinas en la imagen,
// y el contenido debe caber dentro del 80 % central (zona segura).
// Usamos 65 % para tener margen cómodo en todos los launchers.
function svgMaskable(size) {
  const bolt = scaleBolt(size, 0.65) // rayo al 65 % → bien dentro de la zona segura
  const cx = size / 2, cy = size * 0.51, cr = size * 0.28

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${C1}"/>
      <stop offset="100%" stop-color="${C2}"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="51%" r="50%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%"   stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <!-- Sin rx/ry — Android aplica su propio recorte de forma -->
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="${cr}" fill="url(#halo)"/>
  <polygon points="${bolt}" fill="white" opacity="0.97"/>
  <polygon points="${bolt}" fill="url(#shimmer)" opacity="0.18"/>
</svg>`
}

// ── Generar archivos ──────────────────────────────────────────
const tasks = [
  { svg: svgRegular(192),  file: 'public/icons/icon-192.png',      label: 'regular  192×192' },
  { svg: svgRegular(512),  file: 'public/icons/icon-512.png',      label: 'regular  512×512' },
  { svg: svgMaskable(512), file: 'public/icons/icon-maskable.png', label: 'maskable 512×512' },
]

for (const { svg, file, label } of tasks) {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(file)
  console.log(`✓  ${file}  (${label})`)
}

console.log('\n✅ Íconos generados en public/icons/')
