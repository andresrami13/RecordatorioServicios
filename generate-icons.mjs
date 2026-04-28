/**
 * Genera iconos PNG para la PWA a partir del SVG.
 * Requiere: npm install sharp
 * Uso:       node generate-icons.mjs
 */
import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('./public/icons', { recursive: true })

const sizes = [192, 512]

for (const size of sizes) {
  await sharp('./public/icons/icon.svg')
    .resize(size, size)
    .png()
    .toFile(`./public/icons/icon-${size}.png`)
  console.log(`✓ icon-${size}.png`)
}

console.log('Iconos generados correctamente.')
