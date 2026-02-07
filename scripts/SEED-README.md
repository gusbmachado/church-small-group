# 🌱 Seed do Firestore - Dados Mockados

Este script popula o Firestore com dados de exemplo para desenvolvimento e testes.

## 📊 Dados criados

### 🏛️ Igreja (Sede)
- **Primeira Igreja Batista de Uberlândia**
- Localizada no Centro de Uberlândia

### 📍 5 Células (Grupos)
1. **Célula Jovens do Centro** - Sexta 19:30
2. **Célula Mulheres Vitoriosas** - Quarta 14:00
3. **Célula Homens de Valor** - Quinta 20:00
4. **Célula Jovem Família** - Sábado 18:00
5. **Célula Sênior da Fé** - Terça 15:00

### 👥 6 Usuários
- 1 Admin
- 2 Líderes
- 3 Membros

### 📚 Conteúdo adicional
- Membros vinculados às células
- Funções (roles) dos grupos
- Desafios da semana
- Pedidos de oração
- 1 Anúncio ativo

## 🚀 Como executar

### 1. Certifique-se que o Firebase está configurado

Verifique se o arquivo `.env` tem todas as variáveis:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Execute o script

```bash
pnpm seed
```

ou

```bash
pnpm tsx scripts/seed-firestore.ts
```

### 3. Aguarde a conclusão

O script exibirá o progresso no terminal:

```
🌱 Iniciando seed do Firestore...

📍 Criando igreja...
✓ Igreja criada: Igreja Batista Central de Uberlândia

📍 Criando células...
✓ Grupo criado: Célula Jovens do Centro
...

✅ Seed concluído com sucesso!
```

## 🔑 Credenciais de acesso

Após executar o seed, você poderá fazer login com as seguintes credenciais:

### 👤 Admin (acesso total)
```
Email: admin@example.com
Senha: Admin123!
```

### 👤 Líder - Lucas Mendes (Célula Jovens)
```
Email: lucas.mendes@example.com
Senha: Leader123!
```

### 👤 Líder - Maria Santos (Célula Mulheres)
```
Email: maria.santos@example.com
Senha: Leader123!
```

### 👤 Membro - Pedro Almeida
```
Email: pedro.almeida@example.com
Senha: Member123!
```

## 🗑️ Limpando os dados

Para remover todos os dados mockados e começar do zero:

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Vá para **Firestore Database**
3. Selecione cada coleção (groups, users, members, etc.)
4. Clique em **"Excluir coleção"**

Ou use o Firebase CLI:

```bash
firebase firestore:delete --all-collections
```

## ⚠️ Avisos importantes

- **NÃO execute este script em produção!** É apenas para desenvolvimento.
- Se você executar o script múltiplas vezes, alguns usuários podem já existir (você verá avisos).
- As senhas são simples para facilitar os testes - **nunca use senhas assim em produção**.
- Os dados são realistas mas fictícios (endereços de Uberlândia, nomes genéricos).

## 📝 Personalizando o seed

Para adicionar mais dados ou modificar os existentes, edite:

```
scripts/seed-firestore.ts
```

Você pode adicionar:
- Mais células/grupos
- Mais membros
- Sermões
- Registros de presença
- Planos de leitura
- Caronas solidárias

## 🐛 Problemas comuns

### Erro: "auth/email-already-in-use"
Os usuários já foram criados. Você pode:
- Ignorar (o script vai pular os usuários existentes)
- Ou deletar os usuários no [Firebase Console → Authentication](https://console.firebase.google.com)

### Erro: "Insufficient permissions"
Verifique as regras do Firestore. Para desenvolvimento local, você pode usar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ APENAS PARA DESENVOLVIMENTO
    }
  }
}
```

### Erro: "Firebase config missing"
Certifique-se que todas as variáveis de ambiente estão configuradas no `.env`.
