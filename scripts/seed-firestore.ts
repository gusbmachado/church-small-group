/**
 * Script para popular o Firestore com dados mockados
 * 
 * IMPORTANTE: Antes de executar, configure uma Service Account no Firebase:
 * 
 * 1. Acesse Firebase Console → Project Settings → Service Accounts
 * 2. Clique em "Generate New Private Key"
 * 3. Salve o arquivo JSON baixado
 * 4. Adicione ao .env:
 *    FIREBASE_SERVICE_ACCOUNT_PATH=./caminho-para-service-account.json
 * 
 * Uso:
 * - Execute: pnpm seed
 * - Faça login com: admin@example.com / senha: Admin123!
 */

import "dotenv/config"
import * as admin from "firebase-admin"
import { readFileSync } from "fs"
import { resolve } from "path"

// Inicializa Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  
  if (!serviceAccountPath) {
    console.error("\n❌ Erro: FIREBASE_SERVICE_ACCOUNT_PATH não configurado no .env")
    console.error("\nPara configurar:")
    console.error("1. Acesse Firebase Console → Project Settings → Service Accounts")
    console.error("2. Clique em 'Generate New Private Key'")
    console.error("3. Salve o arquivo JSON e adicione ao .env:")
    console.error("   FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json\n")
    process.exit(1)
  }

  try {
    const serviceAccount = JSON.parse(
      readFileSync(resolve(process.cwd(), serviceAccountPath), "utf8")
    )
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
    
    console.log("✓ Firebase Admin SDK inicializado")
  } catch (error) {
    console.error("\n❌ Erro ao carregar Service Account:", error)
    console.error("\nVerifique se o caminho está correto no .env\n")
    process.exit(1)
  }
}

const db = admin.firestore()
const auth = admin.auth()

const now = () => new Date().toISOString()

// ==========================================
// DADOS MOCKADOS
// ==========================================

const CHURCH_DATA = {
  name: "Primeira Igreja Batista (PIBU)",
  address: "Av. Eng. Diniz, 988 - Martins, Uberlândia - MG, 38400-462, Brasil",
  latitude: -18.910737,
  longitude: -48.284242,
  day_of_week: "Domingo",
  time: "19:00",
  leader: "Pastor João Silva",
  leader_phone: "(34) 99999-0001",
  leader_email: "pastor.joao@pibu.org.br",
  category: "Ministério Familiar",
  gender: "mixed" as const,
  age_range: "Todas Idades",
  is_church: true,
}

const GROUPS_DATA = [
  {
    name: "Célula de Jovens",
    address: "Rua Coronel Antônio Alves, 520 - Centro, Uberlândia - MG",
    latitude: -18.9175,
    longitude: -48.2758,
    day_of_week: "Sexta-feira",
    time: "19:30",
    leader: "Lucas Mendes",
    leader_phone: "(34) 99888-1001",
    leader_email: "lucas.mendes@example.com",
    category: "Jovens",
    gender: "mixed" as const,
    age_range: "18-30",
    is_church: false,
  },
  {
    name: "Célula de Mulheres",
    address: "Rua Duque de Caxias, 320 - Fundinho, Uberlândia - MG",
    latitude: -18.9201,
    longitude: -48.2745,
    day_of_week: "Quarta-feira",
    time: "14:00",
    leader: "Maria Santos",
    leader_phone: "(34) 99777-2002",
    leader_email: "maria.santos@example.com",
    category: "Ministério Feminino",
    gender: "women" as const,
    age_range: "30-50",
    is_church: false,
  },
  {
    name: "Célula de Homens",
    address: "Rua Machado de Assis, 145 - Santa Mônica, Uberlândia - MG",
    latitude: -18.9022,
    longitude: -48.2567,
    day_of_week: "Quinta-feira",
    time: "20:00",
    leader: "Carlos Oliveira",
    leader_phone: "(34) 99666-3003",
    leader_email: "carlos.oliveira@example.com",
    category: "Ministério Masculino",
    gender: "men" as const,
    age_range: "30-50",
    is_church: false,
  },
  {
    name: "Célula de Família - Tibery",
    address: "Rua Goiás, 278 - Tibery, Uberlândia - MG",
    latitude: -18.9342,
    longitude: -48.2856,
    day_of_week: "Sábado",
    time: "18:00",
    leader: "André e Juliana Costa",
    leader_phone: "(34) 99555-4004",
    leader_email: "familia.costa@example.com",
    category: "Ministério Familiar",
    gender: "mixed" as const,
    age_range: "30-50",
    is_church: false,
  },
  {
    name: "Célula de Sêniors",
    address: "Rua Machado de Assis, 890 - Brasil, Uberlândia - MG",
    latitude: -18.9088,
    longitude: -48.2623,
    day_of_week: "Terça-feira",
    time: "15:00",
    leader: "Dona Carmem Lima",
    leader_phone: "(34) 99444-5005",
    leader_email: "carmem.lima@example.com",
    category: "Ministério Sênior",
    gender: "mixed" as const,
    age_range: "65+",
    is_church: false,
  },
]

const USERS_DATA = [
  {
    name: "Gustavo Machado",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin" as const,
    phone: "(34) 99999-0000",
    group_id: null,
  },
  {
    name: "Lucas Mendes",
    email: "lucas.mendes@example.com",
    password: "Leader123!",
    role: "leader" as const,
    phone: "(34) 99888-1001",
    group_id: null, // Será preenchido depois
  },
  {
    name: "Maria Santos",
    email: "maria.santos@example.com",
    password: "Leader123!",
    role: "leader" as const,
    phone: "(34) 99777-2002",
    group_id: null,
  },
  {
    name: "Pedro Almeida",
    email: "pedro.almeida@example.com",
    password: "Member123!",
    role: "member" as const,
    phone: "(34) 99123-4567",
    group_id: null, // Célula Jovens
  },
  {
    name: "Ana Paula Silva",
    email: "ana.paula@example.com",
    password: "Member123!",
    role: "member" as const,
    phone: "(34) 99234-5678",
    group_id: null, // Célula Mulheres
  },
  {
    name: "Rafael Costa",
    email: "rafael.costa@example.com",
    password: "Member123!",
    role: "member" as const,
    phone: "(34) 99345-6789",
    group_id: null, // Célula Jovens
  },
]

const ANNOUNCEMENT_DATA = {
  type: "event" as const,
  title: "Encontro de Líderes - Abril 2026",
  description: "Convidamos todos os líderes de célula para o encontro mensal que acontecerá no próximo sábado. Teremos palavra, comunhão e planejamento das próximas ações ministeriais.",
  priority: "high" as const,
  event_date: "2026-04-15T14:00:00",
  target_audience: "leaders" as const,
  target_group_ids: [],
  created_by_name: "Pastor João Silva",
  is_active: true,
  expires_at: "2026-04-16T00:00:00",
}

// ==========================================
// FUNÇÕES DE SEED
// ==========================================

async function createGroup(groupData: typeof GROUPS_DATA[0]) {
  const groupRef = await db.collection("groups").add({
    ...groupData,
    current_lesson: null,
    created_at: now(),
    updated_at: now(),
  })
  console.log(`✓ Grupo criado: ${groupData.name} (${groupRef.id})`)
  return groupRef.id
}

async function createChurch() {
  const churchRef = await db.collection("groups").add({
    ...CHURCH_DATA,
    current_lesson: null,
    created_at: now(),
    updated_at: now(),
  })
  console.log(`✓ Igreja criada: ${CHURCH_DATA.name} (${churchRef.id})`)
  return churchRef.id
}

async function createUser(userData: typeof USERS_DATA[0]) {
  try {
    // Cria usuário no Firebase Auth usando Admin SDK
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.name,
    })
    const uid = userRecord.uid

    // Cria perfil no Firestore
    await db.collection("users").doc(uid).set({
      uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      group_id: userData.group_id,
      phone: userData.phone,
      created_at: now(),
    })

    console.log(`✓ Usuário criado: ${userData.name} (${userData.email})`)
    return uid
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      console.log(`⚠ Usuário já existe: ${userData.email}`)
      // Busca o UID do usuário existente
      const userRecord = await auth.getUserByEmail(userData.email)
      return userRecord.uid
    }
    throw error
  }
}

async function createMember(groupId: string, name: string, phone: string, email: string) {
  const memberRef = await db.collection("members").add({
    group_id: groupId,
    name,
    phone,
    email,
    neighborhood: null,
    created_at: now(),
  })
  console.log(`  ✓ Membro adicionado: ${name}`)
  return memberRef.id
}

async function createGroupRole(groupId: string, roleName: string, memberName: string, memberId: string | null) {
  await db.collection("group_roles").add({
    group_id: groupId,
    role_name: roleName,
    member_name: memberName,
    member_id: memberId,
    created_at: now(),
  })
  console.log(`  ✓ Função criada: ${roleName} → ${memberName}`)
}

async function createAnnouncement() {
  await db.collection("announcements").add({
    ...ANNOUNCEMENT_DATA,
    created_at: now(),
  })
  console.log(`✓ Anúncio criado: ${ANNOUNCEMENT_DATA.title}`)
}

async function createWeeklyChallenge(groupId: string, title: string, description: string) {
  await db.collection("weekly_challenges").add({
    group_id: groupId,
    title,
    description,
    week_start: new Date().toISOString().split("T")[0],
    created_at: now(),
  })
  console.log(`  ✓ Desafio da semana criado: ${title}`)
}

async function createPrayerRequest(groupId: string, requesterName: string, title: string, description: string) {
  await db.collection("prayer_requests").add({
    group_id: groupId,
    requester_name: requesterName,
    title,
    description,
    is_answered: false,
    created_at: now(),
  })
  console.log(`  ✓ Pedido de oração criado: ${title}`)
}

// ==========================================
// SCRIPT PRINCIPAL
// ==========================================

async function seed() {
  console.log("\n🌱 Iniciando seed do Firestore...\n")

  try {
    // 1. Criar igreja (sede)
    console.log("📍 Criando igreja...")
    const churchId = await createChurch()

    // 2. Criar grupos
    console.log("\n📍 Criando células...")
    const groupIds: string[] = []
    for (const groupData of GROUPS_DATA) {
      const groupId = await createGroup(groupData)
      groupIds.push(groupId)
    }

    // 3. Criar usuários
    console.log("\n👥 Criando usuários...")
    const userIds: (string | null)[] = []
    for (const userData of USERS_DATA) {
      const userId = await createUser(userData)
      userIds.push(userId)
    }

    // 4. Adicionar membros aos grupos
    console.log("\n👤 Adicionando membros às células...")
    
    // Célula Jovens do Centro
    await createMember(groupIds[0], "Lucas Mendes", "(34) 99888-1001", "lucas.mendes@example.com")
    await createMember(groupIds[0], "Pedro Almeida", "(34) 99123-4567", "pedro.almeida@example.com")
    await createMember(groupIds[0], "Rafael Costa", "(34) 99345-6789", "rafael.costa@example.com")
    await createMember(groupIds[0], "Carla Fonseca", "(34) 99456-7890", "carla.f@example.com")

    // Célula Mulheres Vitoriosas
    await createMember(groupIds[1], "Maria Santos", "(34) 99777-2002", "maria.santos@example.com")
    await createMember(groupIds[1], "Ana Paula Silva", "(34) 99234-5678", "ana.paula@example.com")
    await createMember(groupIds[1], "Fernanda Lima", "(34) 99567-8901", "fernanda.l@example.com")

    // Célula Homens de Valor
    await createMember(groupIds[2], "Carlos Oliveira", "(34) 99666-3003", "carlos.oliveira@example.com")
    await createMember(groupIds[2], "Roberto Dias", "(34) 99678-9012", "roberto.d@example.com")

    // 5. Adicionar funções (roles) aos grupos
    console.log("\n🎭 Criando funções dos grupos...")
    await createGroupRole(groupIds[0], "Líder", "Lucas Mendes", null)
    await createGroupRole(groupIds[0], "Auxiliar de Louvor", "Pedro Almeida", null)
    await createGroupRole(groupIds[0], "Intercessor", "Carla Fonseca", null)

    await createGroupRole(groupIds[1], "Líder", "Maria Santos", null)
    await createGroupRole(groupIds[1], "Secretária", "Ana Paula Silva", null)

    // 6. Criar conteúdo para alguns grupos
    console.log("\n📚 Adicionando conteúdo às células...")
    await createWeeklyChallenge(
      groupIds[0],
      "Compartilhe o Amor de Cristo",
      "Esta semana, ore por uma pessoa específica e convide-a para o próximo encontro da célula."
    )
    await createPrayerRequest(
      groupIds[0],
      "Pedro Almeida",
      "Oportunidade de emprego",
      "Peço oração por sabedoria e direção em uma nova oportunidade profissional que surgiu."
    )

    await createWeeklyChallenge(
      groupIds[1],
      "Fortaleça sua fé através da oração",
      "Dedique 15 minutos diários para oração pessoal e registre como Deus tem falado ao seu coração."
    )
    await createPrayerRequest(
      groupIds[1],
      "Maria Santos",
      "Saúde da mãe",
      "Agradeço as orações pela saúde da minha mãe que está se recuperando de uma cirurgia."
    )

    // 7. Criar anúncio
    console.log("\n📢 Criando anúncio...")
    await createAnnouncement()

    console.log("\n✅ Seed concluído com sucesso!\n")
    console.log("═══════════════════════════════════════════")
    console.log("📋 CREDENCIAIS DE ACESSO")
    console.log("═══════════════════════════════════════════")
    console.log("\n👤 ADMIN:")
    console.log("   Email: admin@example.com")
    console.log("   Senha: Admin123!")
    console.log("\n👤 LÍDER (Lucas Mendes):")
    console.log("   Email: lucas.mendes@example.com")
    console.log("   Senha: Leader123!")
    console.log("\n👤 LÍDER (Maria Santos):")
    console.log("   Email: maria.santos@example.com")
    console.log("   Senha: Leader123!")
    console.log("\n👤 MEMBRO (Pedro Almeida):")
    console.log("   Email: pedro.almeida@example.com")
    console.log("   Senha: Member123!")
    console.log("\n═══════════════════════════════════════════\n")

    process.exit(0)
  } catch (error) {
    console.error("\n❌ Erro durante o seed:", error)
    process.exit(1)
  }
}

// Executar seed
seed()
