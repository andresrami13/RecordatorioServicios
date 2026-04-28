/**
 * Generador de íconos PWA para MisRecibos
 * Usa sharp (renderizado de SVG con libvips) — sin dependencias nativas extra.
 * Uso: node generate-icons.mjs
 */
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'

mkdirSync('./public/icons', { recursive: true })

// ── Paleta ──────────────────────────────────────────────────
const GRAD_START = '#667eea'
const GRAD_END   = '#764ba2'

// ── SVG maestro (512 × 512) ──────────────────────────────────
// Diseño: fondo degradado morado con esquinas redondeadas
// + símbolo de rayo blanco centrado y un halo suave detrás
function buildSVG(size) {
  const r   = size * 0.195   // radio esquinas (~22% del tamaño)
  const pad = size * 0.16    // padding interior para el rayo

  // Puntos del rayo escalados al tamaño (diseñados en 512, escalamos)
  const s   = size / 512
  const boltPoints = [
    [299, 68],   // vértice superior derecho
    [184, 284],  // pico izquierdo medio
    [252, 284],  // entrada al codillo
    [206, 444],  // base inferior izquierda
    [326, 228],  // pico derecho medio
    [258, 228],  // salida del codillo
  ].map(([x, y]) => `${x * s},${y * s}`).join(' ')

  // Halo circular detrás del rayo
  const cx  = size / 2
  const cy  = size * 0.51
  const cr  = size * 0.295

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <!-- Degradado de fondo diagonal -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${GRAD_START}"/>
      <stop offset="100%" stop-color="${GRAD_END}"/>
    </linearGradient>
    <!-- Halo suave detrás del rayo -->
    <radialGradient id="halo" cx="50%" cy="51%" r="50%">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <!-- Sombra interior para dar profundidad -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="${size * 0.018}" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Fondo con esquinas redondeadas -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#bg)"/>

  <!-- Capa de profundidad: borde interno sutil -->
  <rect x="1" y="1" width="${size - 2}" height="${size - 2}"
        rx="${r}" ry="${r}"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        stroke-width="${size * 0.008}"/>

  <!-- Halo circular detrás del rayo -->
  <circle cx="${cx}" cy="${cy}" r="${cr}" fill="url(#halo)"/>

  <!-- Rayo principal -->
  <polygon
    points="${boltPoints}"
    fill="white"
    opacity="0.97"
    filter="url(#glow)"/>

  <!-- Rayo: capa de brillo superior izquierdo -->
  <polygon
    points="${boltPoints}"
    fill="url(#shimmer)"
    opacity="0.18"/>

  <defs>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="60%" y2="100%">
      <stop offset="0%"   stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>
</svg>`
}

// ── Generar PNGs ─────────────────────────────────────────────
const sizes = [
  { size: 192, file: 'public/icons/icon-192.png' },
  { size: 512, file: 'public/icons/icon-512.png' },
]

for (const { size, file } of sizes) {
  const svg = buildSVG(size)
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(file)
  console.log(`✓  ${file}  (${size}×${size})`)
}

console.log('\n✅ Íconos generados en public/icons/')
