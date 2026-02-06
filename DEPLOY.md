# 🚀 Deploy para Produção - Vercel

## ✅ Preparação Completa para Produção

Este guia descreve todas as configurações aplicadas para tornar a aplicação pronta para produção na Vercel e compatível com dispositivos móveis (PWA).

---

## 📱 Progressive Web App (PWA)

### Recursos Implementados

✅ **Manifest Web App** (`/public/manifest.json`)
- Nome da aplicação e ícones
- Configuração de cores e tema
- Modo standalone (funciona como app nativo)
- Atalhos rápidos para mapa e dashboard

✅ **Service Worker Automático**
- Cache inteligente do Google Maps
- Cache de imagens
- Funcionamento offline
- Atualizações automáticas

✅ **Meta Tags PWA Completas**
- SEO otimizado
- Open Graph e Twitter Cards
- Apple Web App configurado
- Ícones adaptativos para todos dispositivos

✅ **Responsividade Mobile**
- Navegação mobile otimizada
- Bottom navigation bar
- Sheet modal para detalhes em mobile
- Safe area support (entalhes/notches)
- Viewport height dinâmico

✅ **Otimizações de Performance**
- Turbopack configurado (Next.js 16)
- Compressão habilitada
- React Strict Mode
- Cabeçalhos de segurança

---

## 🔧 Configurações Aplicadas

### 1. **next.config.mjs**
```javascript
- PWA plugin configurado
- Turbopack habilitado
- Cache strategy para Maps e imagens
- Headers de segurança (XSS, Frame, MIME)
- Compressão ativada
```

### 2. **vercel.json**
```javascript
- Região: São Paulo (gru1)
- Headers para manifest e service worker
- Cache otimizado para workbox
```

### 3. **Novos Componentes**
- `<MobileNav />` - Navegação mobile bottom bar
- `<PWAInitializer />` - Inicializa utilitários PWA
- Mobile sheets para detalhes dos grupos

### 4. **Estilos Mobile**
- Safe area insets (entalhes)
- Viewport height dinâmico
- Touch optimizations
- Smooth scrolling

---

## 📦 Deploy na Vercel

### Passo 1: Preparar Variáveis de Ambiente

Crie as seguintes variáveis de ambiente no dashboard da Vercel:

#### **Firebase** (Obrigatório)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Server-side (sem NEXT_PUBLIC_)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

#### **Google Maps** (Obrigatório)
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

#### **Supabase** (Opcional, se usar)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

#### **Aplicação**
```bash
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

### Passo 2: Conectar Repositório

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Click em **"Add New Project"**
3. Importe seu repositório do GitHub
4. A Vercel detectará automaticamente Next.js

### Passo 3: Configurar Deploy

A Vercel detectará automaticamente:
- Framework: Next.js
- Build Command: `pnpm build` (já configurado no vercel.json)
- Output Directory: `.next`
- Install Command: `pnpm install`

### Passo 4: Adicionar Variáveis de Ambiente

No dashboard da Vercel:
1. Vá em **Settings → Environment Variables**
2. Adicione todas as variáveis listadas no Passo 1
3. Marque para usar em: Production, Preview, Development

### Passo 5: Deploy!

Click em **"Deploy"** e aguarde (~2-3 minutos)

---

## 🎨 Ícones PWA

### ⚠️ IMPORTANTE: Você precisa criar os ícones!

Os ícones são necessários para a PWA funcionar corretamente. Siga o guia em `ICONS-GUIDE.md`.

**Tamanhos necessários:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 180x180, 192x192, 384x384, 512x512

**Localização:** `/public/icons/`

**Opções para gerar:**
1. **PWA Builder**: https://www.pwabuilder.com/imageGenerator
2. **Sharp** (script Node.js já disponível)
3. **ImageMagick** (comando CLI)

---

## 🧪 Testar PWA Localmente

### 1. Build de Produção
```bash
pnpm build
pnpm start
```

### 2. Abrir no Navegador
- Chrome: `http://localhost:3000`
- Abra DevTools → Application → Manifest
- Verifique Service Worker em Service Workers

### 3. Testar Instalação
- Chrome Desktop: Ícone de instalação na barra de endereço
- Chrome Mobile: Menu → "Instalar app"
- iOS Safari: Compartilhar → "Adicionar à Tela Inicial"

---

## 📱 Funcionalidades Mobile

### Navegação Adaptativa
- **Desktop**: Sidebar fixa + painel lateral de detalhes
- **Tablet**: Mapa + painel de detalhes
- **Mobile**: Toggle mapa/lista + sheet para detalhes

### Bottom Navigation (Mobile)
- **Mapa**: Visualização do mapa com pins
- **Lista**: Lista de grupos em formato cards
- **Gerenciar**: Acesso ao dashboard (usuários logados)

### Touch Optimizations
- Tap highlight desabilitado
- Smooth scrolling
- Safe area support (iPhone notch)
- Orientação responsiva

---

## 🔒 Segurança

### Headers Configurados
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Boas Práticas
- Variáveis sensíveis apenas server-side (sem `NEXT_PUBLIC_`)
- Firebase Admin SDK isolado
- HTTPS forçado na Vercel
- Service Worker com cache controlado

---

## 🚦 Verificações Pós-Deploy

### ✅ Checklist de Produção

- [ ] Aplicação acessível via HTTPS
- [ ] Mapa carregando corretamente
- [ ] Login/Logout funcionando
- [ ] Service Worker registrado (DevTools → Application)
- [ ] Manifest carregado corretamente
- [ ] PWA instalável (ícone aparece no navegador)
- [ ] Responsividade em diferentes dispositivos
- [ ] Bottom nav funcionando em mobile
- [ ] Analytics da Vercel funcionando

### 🔍 Testar Performance

1. **Lighthouse** (Chrome DevTools)
   - Performance > 90
   - PWA score = 100
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90

2. **PWA Audit**
   - Service Worker registrado
   - Manifest válido
   - Ícones corretos
   - Offline fallback

---

## 🎯 Próximos Passos

### Melhorias Recomendadas

1. **Ícones PWA**: Criar todos os tamanhos necessários
2. **Screenshots**: Adicionar screenshots no manifest para app stores
3. **Offline Mode**: Melhorar experiência offline completa
4. **Push Notifications**: Implementar notificações (eventos, lembretes)
5. **Background Sync**: Sincronizar dados quando retornar online
6. **Analytics**: Configurar eventos customizados
7. **SEO**: Adicionar sitemap.xml e robots.txt
8. **i18n**: Adicionar suporte multi-idioma (pt-BR, en, es)

### Funcionalidades Futuras (do conceito original)

- ✅ Mapa interativo com pins
- ✅ Sistema de autenticação
- ✅ 3 níveis de usuários (admin, leader, member)
- ✅ Dashboard de gerenciamento
- ⏳ Gerenciamento de frequência (attendance)
- ⏳ Registro de homilias/sermões
- ⏳ Material de estudo
- ⏳ Leituras diárias
- ⏳ Intenções de oração
- ⏳ **Carpool** (funcionalidade de carona)
- ⏳ Gestão de categorias (idade/gênero)
- ⏳ Dados do grupo (endereço, horário, líder, contato)

---

## 📚 Recursos Adicionais

### Documentação
- [Next.js React](https://nextjs.org/docs)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)
- [Vercel Deployment](https://vercel.com/docs)
- [Firebase Setup](https://firebase.google.com/docs/web/setup)

### Ferramentas Úteis
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev Measure](https://web.dev/measure/)

---

## 🆘 Troubleshooting

### Service Worker não registra
```bash
# Limpar cache e recarregar
1. DevTools → Application → Clear Storage
2. Hard Reload (Ctrl+Shift+R ou Cmd+Shift+R)
```

### PWA não instalável
```bash
# Verificar:
1. HTTPS ativado (automático na Vercel)
2. Manifest.json acessível em /manifest.json
3. Ícones existem em /public/icons/
4. Service Worker sem erros (DevTools → Console)
```

### Variáveis de ambiente não funcionam
```bash
# Verificar:
1. Prefixo NEXT_PUBLIC_ para variáveis client-side
2. Sem aspas nas variáveis no dashboard Vercel
3. Redeploy após adicionar variáveis
```

### Erro de Build na Vercel
```bash
# Verificar:
1. pnpm-lock.yaml commitado
2. Node version compatível (18.x ou 20.x)
3. Todas dependências instaláveis
4. TypeScript errors (ignoreBuildErrors: true está ativo)
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no dashboard da Vercel
2. Teste localmente com `pnpm build && pnpm start`
3. Verifique o console do navegador para erros
4. Revise as variáveis de ambiente

---

**🎉 Pronto! Sua aplicação está preparada para produção na Vercel como uma PWA completa!**
