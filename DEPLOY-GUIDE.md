# 🚀 Guia de Deploy para Produção na Vercel

Este guia detalha como preparar e fazer o deploy desta aplicação PWA na Vercel.

## 📋 Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Conta no [Firebase Console](https://console.firebase.google.com) (para autenticação)
3. API Key do Google Maps
4. Repositório Git (GitHub, GitLab ou Bitbucket)

## 🔧 Configuração Inicial

### 1. Prepare as Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.example`:

```bash
cp .env.example .env.local
```

Preencha com suas credenciais reais:

#### Firebase
- Acesse [Firebase Console](https://console.firebase.google.com)
- Crie um novo projeto ou use um existente
- Vá em **Project Settings** > **General**
- Em "Your apps", adicione um Web App
- Copie as configurações e cole em `.env.local`

#### Google Maps API
- Acesse [Google Cloud Console](https://console.cloud.google.com)
- Ative a API "Maps JavaScript API"
- Crie uma API Key
- Adicione restrições de domínio para produção

### 2. Gere os Ícones PWA

**IMPORTANTE:** Você precisa gerar os ícones antes do deploy!

1. Crie um ícone base 512x512px com o logo da sua igreja
2. Salve como `/public/icons/icon-512x512.png`
3. Siga as instruções em [ICONS-GUIDE.md](./ICONS-GUIDE.md) para gerar todos os tamanhos

Ou use este comando rápido com ImageMagick:

```bash
cd public/icons
# Coloque seu icon-512x512.png aqui primeiro
for size in 72 96 128 144 152 180 192 384; do
  convert icon-512x512.png -resize ${size}x${size} icon-${size}x${size}.png
done
```

### 3. Configure o Firebase para Produção

No Firebase Console:

1. **Authentication:**
   - Ative "Email/Password" em Authentication > Sign-in method
   - Adicione seu domínio Vercel em "Authorized domains"

2. **Firestore Database:**
   - Crie um banco Firestore (se ainda não tiver)
   - Configure as regras de segurança adequadas

3. **Firebase Admin SDK:**
   - Vá em Project Settings > Service Accounts
   - Gere uma nova chave privada
   - Extraia os valores para as variáveis de ambiente do servidor

## 🌐 Deploy na Vercel

### Opção 1: Deploy via Dashboard (Recomendado)

1. **Conecte seu Repositório:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe seu repositório Git

2. **Configure o Projeto:**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: pnpm build
   Output Directory: .next
   Install Command: pnpm install
   ```

3. **Adicione as Variáveis de Ambiente:**
   - Em Settings > Environment Variables
   - Adicione TODAS as variáveis do `.env.example`
   - Marque para todos os ambientes (Production, Preview, Development)

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde a build completar (3-5 minutos)

### Opção 2: Deploy via CLI

```bash
# Instale a CLI da Vercel
pnpm add -g vercel

# Login
vercel login

# Deploy para preview
vercel

# Deploy para produção
vercel --prod
```

## ⚙️ Variáveis de Ambiente na Vercel

Configure estas variáveis em **Settings > Environment Variables**:

### Públicas (prefixo NEXT_PUBLIC_)
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXT_PUBLIC_APP_URL
```

### Privadas (apenas servidor)
```
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

**⚠️ IMPORTANTE:** 
- Nunca commit `.env.local` no Git
- Use o formato correto para `FIREBASE_PRIVATE_KEY` (com `\n` para quebras de linha)
- Teste localmente antes de fazer deploy

## 📱 Verificação PWA

Após o deploy, verifique se a PWA está funcionando:

1. **Chrome DevTools:**
   - Abra DevTools (F12)
   - Vá em Application > Manifest
   - Verifique se o manifest está carregando
   - Vá em Service Workers e verifique se está ativo

2. **Lighthouse:**
   - Abra DevTools
   - Vá em Lighthouse
   - Execute auditoria PWA
   - Meta: Score > 90

3. **Teste de Instalação:**
   - No Chrome mobile: "Add to Home Screen"
   - Verifique se o app abre em modo standalone
   - Teste funcionalidades offline

## 🔒 Segurança

### Headers de Segurança
Os headers já estão configurados em `next.config.mjs`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Google Maps API
Adicione restrições na API Key:
1. Application restrictions: HTTP referrers
2. Adicione seu domínio: `*.vercel.app/*` e `seudominio.com/*`

### Firebase
Configure regras Firestore adequadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem ler
    match /groups/{groupId} {
      allow read: if true; // Todos podem ver grupos
      allow write: if request.auth != null; // Apenas autenticados podem editar
    }
  }
}
```

## 🎯 Domínio Customizado

1. Em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções da Vercel
4. Atualize `NEXT_PUBLIC_APP_URL` nas variáveis de ambiente
5. Adicione o domínio no Firebase Authorized domains

## 📊 Monitoramento

A aplicação já inclui:
- **Vercel Analytics:** Métricas de performance automáticas
- **Web Vitals:** Core Web Vitals tracking

Acesse em: Dashboard do projeto > Analytics

## 🐛 Troubleshooting

### Build Falha
```bash
# Teste localmente
pnpm build
# Verifique erros de TypeScript (temporariamente ignorados)
```

### PWA não instala
- Verifique se todos os ícones existem em `/public/icons/`
- Verifique manifest.json no DevTools
- Certifique-se de estar usando HTTPS (Vercel usa por padrão)

### Service Worker não atualiza
- Force refresh: Ctrl+Shift+R
- Clear cache no DevTools
- Verifique se `skipWaiting: true` em next.config.mjs

### Google Maps não carrega
- Verifique se API está ativa no Google Cloud
- Verifique restrições da API Key
- Confira se `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está configurada

## 📱 Recursos PWA Implementados

✅ Manifest.json configurado
✅ Service Worker automático (next-pwa)
✅ Caching de assets estáticos
✅ Caching de Google Maps
✅ Ícones em múltiplos tamanhos
✅ Splash screens (iOS)
✅ Standalone mode
✅ Theme color
✅ Safe area support (notch)
✅ Navegação mobile otimizada
✅ Touch gestures
✅ Viewport height fix

## 🚀 Próximos Passos

1. Configure notificações push (opcional)
2. Implemente estratégia de cache offline
3. Adicione analytics customizados
4. Configure logs de erro (Sentry)
5. Implemente testes E2E
6. Configure CI/CD no GitHub Actions

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Next.js PWA:** https://ducanh-next-pwa.vercel.app
- **Firebase Docs:** https://firebase.google.com/docs

---

**Última atualização:** 2026-02-06
