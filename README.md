# Church Small Groups Management System 📱⛪

Uma plataforma de gerenciamento completa para pequenos grupos de igreja com mapas interativos, rastreamento de membros, gestão de presença e registro de sermões/homilias.

> **✨ Agora disponível como Progressive Web App (PWA)**: Instale no seu dispositivo móvel e use como aplicativo nativo!

## 🌟 Características

### 📍 Vista de Mapa Interativo
- Integração com Google Maps (ou mapa de fallback)
- Pin da igreja e locais de reunião dos grupos
- Indicadores visuais de quantidade de membros
- Clique nos pins para ver detalhes do grupo

### 🔍 Filtragem Avançada
- Busca por nome, endereço ou líder
- Filtrar por categoria (Jovens, Homens, Mulheres, Ministério Sênior, etc.)
- Filtrar por gênero (Misto, Somente Homens, Somente Mulheres)
- Filtrar por faixa etária

### ⚙️ Dashboard de Gerenciamento (Requer Login)
- Editar detalhes e informações do grupo
- Gerenciar membros e funções
- Rastrear presença por data
- Registrar sermões/homilias com referências bíblicas
- Funcionalidade de carona (carpool)

### 🔐 Autenticação
- Login e cadastro seguros com Firebase Authentication
- Visualização para visitantes (mapa e informações do grupo)
- Recursos de gerenciamento autenticados
- Autenticação por email/senha
- Três níveis de usuário: Admin, Líder, Membro

### 📱 Progressive Web App (PWA)
- **Instalável**: Adicione à tela inicial do seu dispositivo
- **Offline-first**: Funciona mesmo sem internet (cache inteligente)
- **Responsivo**: Interface otimizada para mobile, tablet e desktop
- **Rápido**: Service Worker para carregamento instantâneo
- **Seguro**: HTTPS obrigatório e security headers configurados
- **Notch-friendly**: Suporte para dispositivos com notch/cutout

### 📲 Recursos Mobile
- Navegação inferior otimizada para polegar
- Gestos touch otimizados
- Sheet modal para detalhes no mobile
- Alternância fácil entre vista de mapa e lista
- Safe area support para dispositivos modernos

## 🛠️ Tecnologias

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: Tailwind CSS v4
- **Autenticação**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Mapas**: Google Maps JavaScript API
- **PWA**: [@ducanh2912/next-pwa](https://ducanh-next-pwa.vercel.app/)
- **Analytics**: Vercel Analytics
- **Deploy**: [Vercel](https://vercel.com)
- **Package Manager**: pnpm

## 🚀 Iniciando

### Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta Firebase (gratuita)
- Google Maps API Key (opcional, mas recomendado)

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd church-small-group-ui
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure o Firebase**

Crie um projeto no [Firebase Console](https://console.firebase.google.com):
- Ative Authentication com Email/Password
- (Opcional) Ative Firestore para persistir dados
- Copie as credenciais do projeto

4. **Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_google_maps_api_key
```

5. **Execute o servidor de desenvolvimento**

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 📦 Comandos Disponíveis

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm build        # Cria build de produção
pnpm start        # Inicia servidor de produção
pnpm lint         # Executa linter
```

## 📊 Estrutura de Dados

Atualmente usando dados mock em `lib/data.ts`. Estrutura incluída:

- **small_groups** - Informações principais do grupo
- **members** - Membros do grupo com detalhes de contato
- **roles** - Funções da equipe (Líder de Louvor, Anfitrião, etc.)
- **season_lessons** - Currículo da temporada
- **attendance** - Rastreamento de presença por data
- **sermons** - Notas de sermão/homilia com referências bíblicas

Para persistir dados, implemente coleções Firestore com a mesma estrutura.

### Dados de Exemplo

O app inclui dados de exemplo para teste:
- Young Adults Fellowship (Terça-feira 19:00)
- Men's Bible Study (Quinta-feira 6:30)
- Women's Prayer Group (Quarta-feira 10:00)
- Senior Saints (Sexta-feira 14:00)
- Youth Group (Sábado 17:00)

Sinta-se livre para editar, deletar ou adicionar novos grupos através do dashboard de gerenciamento!

## 🔒 Segurança

- Firebase Authentication protege contas de usuário
- Gerenciamento de estado de autenticação no cliente
- Headers de segurança configurados (X-Frame-Options, XSS-Protection, etc.)
- HTTPS obrigatório em produção (Vercel)
- Para adicionar segurança de banco de dados, implemente Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read: if true; // Todos podem ver grupos
      allow write: if request.auth != null; // Apenas autenticados podem editar
    }
  }
}
```

## 📱 Como Usar como PWA

### No Mobile (Android/iOS):

1. Acesse o site no Chrome/Safari
2. Toque no menu do navegador
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. O ícone aparecerá na sua tela inicial
5. Abra como qualquer app nativo!

### No Desktop (Chrome/Edge):

1. Acesse o site
2. Clique no ícone de instalação na barra de endereço
3. Confirme a instalação
4. O app abrirá em janela própria

### Recursos Offline:

- Mapa e grupos em cache ficam disponíveis offline
- Service Worker atualiza automaticamente o conteúdo
- Assets estáticos são armazenados localmente

## 🚀 Deploy para Produção

### Deploy na Vercel (Recomendado)

Consulte o guia completo em [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md).

**Passos rápidos:**

1. Gere os ícones PWA (veja [ICONS-GUIDE.md](./ICONS-GUIDE.md))
2. Configure as variáveis de ambiente na Vercel
3. Conecte seu repositório Git
4. Deploy automático! 🎉

```bash
# Ou use a CLI
pnpm add -g vercel
vercel login
vercel --prod
```

### Checklist de Deploy

- [ ] Ícones PWA gerados (todos os tamanhos)
- [ ] Variáveis de ambiente configuradas
- [ ] Firebase Authorized domains atualizado
- [ ] Google Maps API com restrições de domínio
- [ ] Teste PWA com Lighthouse (score > 90)
- [ ] Teste instalação no mobile
- [ ] Verifique service worker no DevTools

## 🎨 Customização

### Cores e Tema

Edite as variáveis CSS em `app/globals.css`:

```css
:root {
  --background: oklch(0.13 0.01 250);
  --primary: oklch(0.82 0.16 85);
  /* ... outras variáveis */
}
```

### Ícones

Substitua os ícones em `/public/icons/` pelos da sua igreja.

### Manifest

Edite `public/manifest.json` para personalizar:
- Nome do app
- Cores do tema
- Descrição
- Atalhos

## 📚 Documentação Adicional

- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - Guia completo de deploy para produção
- [ICONS-GUIDE.md](./ICONS-GUIDE.md) - Como gerar ícones PWA
- [MIGRATION.md](./MIGRATION.md) - Histórico de migrações do projeto

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e disponível para uso em igrejas e comunidades religiosas.

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Firebase](https://firebase.google.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Plataforma de deploy
- Comunidade open source 💙

---

**Feito com ❤️ para comunidades de fé**
