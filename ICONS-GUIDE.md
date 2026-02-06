# Instruções para Criar Ícones PWA

Para gerar os ícones necessários para a PWA, você precisa criar uma imagem base de 512x512 pixels com o logo da sua igreja/aplicação.

## Opção 1: Usar um serviço online
1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload da sua imagem 512x512
3. Baixe os ícones gerados
4. Coloque-os na pasta `/public/icons/`

## Opção 2: Usar ImageMagick (linha de comando)
Se você tiver o ImageMagick instalado, execute no terminal:

```bash
# Certifique-se de ter uma imagem base chamada icon-512x512.png em /public/icons/
cd public/icons

# Gerar todos os tamanhos
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 180x180 icon-180x180.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```

## Opção 3: Usar Sharp (Node.js)
```bash
pnpm add -D sharp
```

Depois criar um script `generate-icons.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const inputImage = path.join(__dirname, 'public', 'icons', 'icon-base.png');

sizes.forEach(size => {
  sharp(inputImage)
    .resize(size, size)
    .toFile(path.join(__dirname, 'public', 'icons', `icon-${size}x${size}.png`))
    .then(() => console.log(`Generated ${size}x${size}`))
    .catch(err => console.error(err));
});
```

## Ícones Necessários
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-180x180.png (Apple touch icon)
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

**Nota:** Por enquanto, você pode usar placeholders ou um ícone simples. O importante é ter todos os tamanhos disponíveis para que a PWA funcione corretamente.
