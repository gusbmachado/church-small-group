# Google Places API - Guia de Configuração

## ❌ Erro: "Requests from referer are blocked"

Esse erro ocorre quando a API Key do Google está com **restrições de HTTP referrers** configuradas incorretamente.

### Causas do bloqueio:

#### 1. **Restrições de HTTP Referrers (mais comum)**
A chave tem restrições de domínio configuradas, mas o domínio Firebase não está na lista.

#### 2. **Places API (New) não habilitada**
A API "Places API (New)" precisa estar explicitamente habilitada no projeto.

#### 3. **Billing não ativo**
Conta Google Cloud sem billing ativo bloqueia chamadas após o free tier.

#### 4. **Chave inválida ou expirada**
API key foi regenerada ou está incorreta no `.env`.

---

## ✅ Como corrigir

### Passo 1: Acessar Google Cloud Console
1. Vá para [console.cloud.google.com](https://console.cloud.google.com)
2. Selecione o projeto **church-cell-groups** (ou seu projeto Firebase)

### Passo 2: Habilitar a Places API (New)
1. Menu **"APIs e Serviços" → "Biblioteca"**
2. Busque por **"Places API (New)"**
3. Clique em **"Ativar"**

### Passo 3: Configurar restrições da API Key
1. Menu **"APIs e Serviços" → "Credenciais"**
2. Clique na sua API Key
3. Em **"Restrições de aplicativo"**, selecione **"Referenciadores HTTP (sites)"**
4. Adicione os seguintes referrers:

```
http://localhost:*
https://localhost:*
https://church-cell-groups.firebaseapp.com/*
https://church-cell-groups.web.app/*
https://church-small-group-ui.vercel.app/*
https://*.vercel.app/*
```

5. Em **"Restrições de API"**, selecione **"Restringir chave"** e marque:
   - ✓ Maps JavaScript API
   - ✓ Places API (New)
   - ✓ Geocoding API (opcional, para reverse geocoding)

6. Clique em **"Salvar"**

### Passo 4: Verificar Billing
1. Menu **"Faturamento"**
2. Confirme que há um método de pagamento ativo
3. Google oferece **$200/mês grátis** (suficiente para ~40.000 buscas)

### Passo 5: Aguardar propagação
Mudanças nas restrições podem levar **até 5 minutos** para propagar.

---

## 🔍 Testando a configuração

1. Abra o navegador em `http://localhost:3001` (ou sua porta)
2. Acesse o **Admin Panel**
3. Tente criar um novo grupo e busque um endereço
4. Verifique o **Console do navegador (F12)** para erros de API

### Erros comuns no Console:

| Erro | Causa | Solução |
|------|-------|---------|
| `ApiNotActivatedMapError` | Places API não habilitada | Passo 2 |
| `RefererNotAllowedMapError` | Domínio não está na whitelist | Passo 3 |
| `RequestDenied` | Billing desativado | Passo 4 |
| `INVALID_REQUEST` | Query muito curta ou inválida | Digite > 5 caracteres |

---

## 💰 Custos estimados

### Places API (New) - Text Search
- **$0.032 por busca** (Basic Data)
- **$200 grátis/mês** = ~6.250 buscas gratuitas/mês
- Para uma igreja pequena (50 grupos), isso dá ~125 buscas/grupo/mês

### Exemplo de uso mensal:
- **10 novos grupos** = 10 buscas = $0.32
- **50 edições de endereço** = 50 buscas = $1.60
- **Total**: < $2/mês (dentro do free tier)

---

## 🛡️ Boas práticas de segurança

1. **NUNCA** commite `.env` no Git (já está no `.gitignore`)
2. Use **restrições de referrer** em produção
3. Use **restrições de API** para limitar o uso da chave
4. Monitore uso no [Console > APIs & Services > Dashboard](https://console.cloud.google.com/apis/dashboard)
5. Configure **alertas de cota** para evitar surpresas

---

## 🔄 Alternativa: Nominatim (gratuito)

Se preferir evitar custos do Google, pode voltar para Nominatim (OpenStreetMap):

1. Abra [address-autocomplete.tsx](components/address-autocomplete.tsx)
2. Substitua o fetch para `https://nominatim.openstreetmap.org/search`
3. Remova a dependência de `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Vantagens**: Gratuito, sem API key  
**Desvantagens**: Menos preciso, rate limits (1 req/s), sem garantia de uptime

---

## 📞 Suporte adicional

- [Documentação Places API (New)](https://developers.google.com/maps/documentation/places/web-service/text-search)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Error Messages Reference](https://developers.google.com/maps/documentation/javascript/error-messages)
