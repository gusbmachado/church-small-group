#!/usr/bin/env node

/**
 * Gerador de ícones placeholder para PWA
 * Este script cria ícones SVG simples temporários para você testar a PWA
 * Substitua depois pelos ícones reais da sua igreja
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Criar diretório se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Template SVG simples com uma cruz (símbolo cristão)
function generateSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#1a1a2e"/>
  
  <!-- Cross -->
  <g transform="translate(${size/2}, ${size/2})">
    <!-- Vertical bar -->
    <rect x="${-size * 0.08}" y="${-size * 0.35}" width="${size * 0.16}" height="${size * 0.7}" fill="#F4E3C1" rx="${size * 0.02}"/>
    <!-- Horizontal bar -->
    <rect x="${-size * 0.25}" y="${-size * 0.08}" width="${size * 0.5}" height="${size * 0.16}" fill="#F4E3C1" rx="${size * 0.02}"/>
  </g>
  
  <!-- Border -->
  <rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="none" stroke="#F4E3C1" stroke-width="3" rx="${size * 0.05}"/>
</svg>`;
}

console.log('🎨 Gerando ícones placeholder para PWA...\n');

sizes.forEach(size => {
  const svg = generateSVG(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
  
  // Por enquanto, salvamos como SVG (você pode converter para PNG depois)
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  
  console.log(`✅ Criado: icon-${size}x${size}.svg`);
});

console.log('\n⚠️  IMPORTANTE:');
console.log('Os ícones gerados são SVG temporários.');
console.log('Para converter para PNG, use:');
console.log('  1. Inkscape: inkscape --export-type=png --export-filename=icon-72x72.png icon-72x72.svg');
console.log('  2. ImageMagick: convert icon-72x72.svg icon-72x72.png');
console.log('  3. Online: https://cloudconvert.com/svg-to-png\n');
console.log('Ou substitua pelos ícones reais da sua igreja! 🙏');
