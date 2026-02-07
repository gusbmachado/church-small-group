# 🚀 Deploy no Vercel - Guia Rápido

Deploy do sistema de gerenciamento de células na Vercel em **5 passos simples**.

---

## 📋 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com) (gratuita)
- ✅ Conta no [Firebase](https://console.firebase.google.com)
- ✅ Repositório no GitHub sincronizado
- ✅ Google Maps API Key configurada

---

## 🔑 Passo 1: Preparar Variáveis de Ambiente

### Firebase (obrigatório)

Acesse [Firebase Console](https://console.firebase.google.com) → Seu projeto → ⚙️ **Project Settings** → **General** → "Your apps"

Copie as configurações do seu Web App:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=church-cell-groups.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=church-cell-groups
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=church-cell-groups.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Google Maps API

Acesse [Google Cloud Console](https://console.cloud.google.com) → seu projeto → APIs & Services → Credentials

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

**Importante:** Configure restrições de HTTP referrer na API Key:
- Adicione `https://*.vercel.app/*`
- Adicione seu domínio personalizado se tiver

---

## 🌐 Passo 2: Conectar Repositório à Vercel

### 2.1 Via Dashboard (mais fácil)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione **GitHub** e autorize
4. Escolha o repositório **`church-small-group`**
5. Clique em **"Import"**

### 2.2 Via CLI (alternativa)

```bash
npm install -g vercel
vercel login
vercel
```

---

## ⚙️ Passo 3: Configurar Projeto na Vercel

Na tela de configuração:

**Framework Preset:** Next.js  
**Root Directory:** `./`  
**Build Command:** `pnpm build` (ou deixe automático)  
**Output Directory:** `.next`  
**Install Command:** `pnpm install`

> ✅ A Vercel detecta automaticamente essas configurações via `vercel.json`

---

## 🔐 Passo 4: Adicionar Variáveis de Ambiente

No dashboard da Vercel, após importar o projeto:

1. Vá para **Settings** → **Environment Variables**
2. Adicione **uma por uma** as variáveis do Passo 1:

| Key | Value | Environments |
|-----|-------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | ☑️ Production ☑️ Preview ☑️ Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `church-cell-groups.firebaseapp.com` | ☑️ Production ☑️ Preview ☑️ Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `church-cell-groups` | ☑️ Production ☑️ Preview ☑️ Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `church-cell-groups.appspot.com` | ☑️ Production ☑️ Preview ☑️ Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | ☑️ Production ☑️ Preview ☑️ Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789:web:abc123` | ☑️ Production ☑️ Preview ☑️ Development |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIza...` | ☑️ Production ☑️ Preview ☑️ Development |

**Dica:** Use **"Paste Multiple"** para adicionar todas de uma vez:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=church-cell-groups.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=church-cell-groups
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=church-cell-groups.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
```

---

## 🚀 Passo 5: Deploy!

1. Clique em **"Deploy"** no dashboard da Vercel
2. Aguarde a build (~2-3 minutos)
3. ✅ Sucesso! Sua URL: `https://church-small-group-xxx.vercel.app`

---

## 🔧 Configurações Pós-Deploy

### 1. Autorizar Domínio no Firebase

Firebase Console → **Authentication** → **Settings** → **Authorized domains**

Adicione:
```
church-small-group-xxx.vercel.app
```

### 2. Atualizar Google Maps API Restrictions

Google Cloud Console → APIs & Services → Credentials → Sua API Key → **Application restrictions**

Adicione ao **HTTP referrers**:
```
https://church-small-group-*.vercel.app/*
https://church-small-group-xxx.vercel.app/*
```

### 3. Configurar Domínio Personalizado (Opcional)

Vercel Dashboard → Settings → **Domains** → Add Domain

Exemplo: `celulas.suaigreja.com.br`

---

## 📱 PWA - Progressive Web App

A aplicação já está configurada como PWA! Após o deploy:

### Instalar no celular:

**iPhone/iPad:**
1. Abra no Safari
2. Toque no ícone de **compartilhar** (quadrado com seta para cima)
3. Role e toque em **"Adicionar à Tela de Início"**

**Android:**
1. Abra no Chrome
2. Toque nos 3 pontinhos (menu)
3. Toque em **"Instalar app"** ou **"Adicionar à tela inicial"**

**Desktop (Chrome/Edge):**
1. Clique no ícone de **instalar** (+) na barra de endereço
2. Ou vá em Menu → **"Instalar Church Small Groups..."**

---

## 🐛 Problemas Comuns

### Build falha com erro de TypeScript
```bash
# Localmente, execute:
pnpm run build

# Corrija os erros de tipo e faça commit
```

### Maps não carrega
- Verifique se `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` está configurada
- Confirme que o domínio Vercel está nas restrições da API Key
- Aguarde ~5 min para propagação das configurações

### Autenticação não funciona
- Verifique se o domínio Vercel está nos **Authorized domains** do Firebase
- Confirme que as variáveis `NEXT_PUBLIC_FIREBASE_*` estão corretas

### Erro "permission-denied" no Firestore
- Configure as regras de segurança no Firebase Console
- Use as regras de [firestore.rules](firestore.rules) como base

---

## ♻️ Redesploy (atualizações)

O deploy é **automático** a cada push no Git! 

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push
```

Vercel detecta e faz deploy automaticamente.

### Deploy manual:
```bash
vercel --prod
```

---

## 📊 Monitoramento

### Vercel Analytics (já configurado)
Dashboard da Vercel → **Analytics** → veja:
- Pageviews
- Performance (Web Vitals)
- Geolocalização dos usuários

### Firebase Console
- **Authentication** → usuários ativos
- **Firestore Database** → dados em tempo real
- **Performance** → métricas de carregamento

---

## 💰 Custos

### Vercel (Free Hobby Plan)
- ✅ 100 GB bandwidth/mês
- ✅ Builds ilimitados
- ✅ Domínios personalizados
- ✅ Analytics básico
- ✅ SSL automático

Suficiente para **~5.000 visitantes/mês**

### Firebase (Spark - Free)
- ✅ 10k reads/dia
- ✅ 1k writes/dia
- ✅ 1 GB storage
- ✅ 10 GB transfer/mês

Suficiente para **~100-300 usuários ativos**

### Google Maps (Free Tier)
- ✅ $200 créditos/mês
- ✅ ~28.000 map loads/mês
- ✅ ~40.000 geocoding requests/mês

---

## 🎯 Próximos Passos

- [ ] Configure um domínio personalizado
- [ ] Teste a instalação do PWA em mobile
- [ ] Adicione o primeiro usuário admin no Firebase
- [ ] Configure notificações push (Firebase Cloud Messaging)
- [ ] Monitore analytics para otimizar performance

---

## 📚 Documentação Adicional

- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - Guia completo detalhado
- [GOOGLE-PLACES-SETUP.md](./GOOGLE-PLACES-SETUP.md) - Configuração do Google Maps
- [PWA-IMPLEMENTATION-SUMMARY.md](./PWA-IMPLEMENTATION-SUMMARY.md) - Recursos PWA
- [README.md](./README.md) - Visão geral do projeto

---

## 🆘 Suporte

- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Firebase:** [firebase.google.com/docs](https://firebase.google.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)

**Problemas?** Abra uma issue no GitHub com:
- ✅ Mensagem de erro completa
- ✅ Logs da build (se houver)
- ✅ Print da configuração (sem expor secrets!)
