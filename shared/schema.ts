import { pgTable, text, serial, integer, boolean, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Adicionar enums para categorias profissionais
export const jobCategories = [
  "sales", // Vendedor/Comercial
  "reception", // Recepcionista/Atendimento
  "administrative", // Auxiliar Administrativo/Digitador
  "healthcare", // Cuidador/Profissional de Saúde
  "driver", // Motorista/Entregador
  "education", // Professor/Instrutor
  "restaurant", // Garçom/Profissional de Restaurante
  "production", // Operador de Produção
  "cleaning", // Serviços de Limpeza
  "security", // Segurança
  "retail", // Atendente de Loja
  "construction", // Construção Civil
  "other" // Outras categorias
] as const;

export const jobCategorySkills = {
  sales: [
    "Atendimento ao cliente",
    "Negociação",
    "Técnicas de vendas",
    "Prospecção de clientes",
    "CRM",
    "Metas e resultados"
  ],
  reception: [
    "Atendimento ao público",
    "Organização",
    "Comunicação",
    "Agenda",
    "Pacote Office",
    "Telefonia"
  ],
  administrative: [
    "Digitação",
    "Excel avançado",
    "Word",
    "Arquivo",
    "Organização",
    "Gestão de documentos"
  ],
  healthcare: [
    "Cuidados básicos",
    "Primeiros socorros",
    "Medicação",
    "Higiene",
    "Empatia",
    "Cuidados especiais"
  ],
  driver: [
    "CNH",
    "Direção defensiva",
    "GPS",
    "Manutenção básica",
    "Atendimento",
    "Conhecimento de rotas"
  ],
  education: [
    "Didática",
    "Planejamento",
    "Avaliação",
    "Comunicação",
    "Tecnologia educacional",
    "Gestão de sala"
  ],
  restaurant: [
    "Atendimento",
    "Higiene alimentar",
    "Organização",
    "Agilidade",
    "Trabalho em equipe",
    "Controle de pedidos"
  ],
  production: [
    "Operação de máquinas",
    "Controle de qualidade",
    "Segurança do trabalho",
    "Organização",
    "Trabalho em equipe",
    "Manutenção preventiva"
  ],
  cleaning: [
    "Limpeza geral",
    "Produtos químicos",
    "Equipamentos específicos",
    "Higienização",
    "Organização",
    "Protocolos de limpeza"
  ],
  security: [
    "Vigilância",
    "Controle de acesso",
    "Prevenção de riscos",
    "Primeiros socorros",
    "Defesa pessoal",
    "Relatórios de ocorrência"
  ],
  retail: [
    "Atendimento ao cliente",
    "Organização de loja",
    "Controle de estoque",
    "Vendas",
    "Visual merchandising",
    "Caixa"
  ],
  construction: [
    "Leitura de projetos",
    "Ferramentas específicas",
    "Segurança do trabalho",
    "Acabamento",
    "Trabalho em equipe",
    "Manutenção básica"
  ],
  other: []
} as const;

export const europeanCountries = {
  "Portugal": ["Lisboa", "Porto", "Faro", "Braga", "Coimbra", "Aveiro", "Funchal", "Évora"],
  "Espanha": ["Madrid", "Barcelona", "Valencia", "Sevilha", "Málaga", "Bilbao", "Granada", "Zaragoza"],
  "França": ["Paris", "Lyon", "Marselha", "Bordeaux", "Nice", "Toulouse", "Nantes", "Estrasburgo"],
  "Alemanha": ["Berlim", "Munique", "Frankfurt", "Hamburgo", "Colônia", "Stuttgart", "Dresden", "Düsseldorf"],
  "Itália": ["Roma", "Milão", "Florença", "Veneza", "Nápoles", "Turim", "Bolonha", "Verona"],
  "Reino Unido": ["Londres", "Manchester", "Liverpool", "Edinburgh", "Birmingham", "Glasgow", "Bristol", "Leeds"],
  "Holanda": ["Amsterdã", "Rotterdam", "Haia", "Utrecht", "Eindhoven", "Groningen", "Tilburg", "Almere"],
  "Bélgica": ["Bruxelas", "Antuérpia", "Gent", "Bruges", "Liège", "Namur", "Leuven", "Mons"],
  "Suíça": ["Zurique", "Genebra", "Basileia", "Berna", "Lausanne", "Lucerna", "Lugano", "St. Gallen"],
  "Irlanda": ["Dublin", "Cork", "Galway", "Limerick", "Waterford", "Kilkenny", "Drogheda", "Dundalk"],
  "Suécia": ["Estocolmo", "Gotemburgo", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping", "Helsingborg"],
  "Noruega": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand", "Tromsø"],
  "Dinamarca": ["Copenhague", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers", "Kolding", "Horsens"],
  "Finlândia": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä", "Lahti"],
  "Áustria": ["Viena", "Graz", "Linz", "Salzburgo", "Innsbruck", "Klagenfurt", "Villach", "Wels"],
  "Estados Unidos": ["Nova York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Filadélfia", "San Antonio", "San Diego"],
  "Canadá": ["Toronto", "Montreal", "Vancouver", "Calgary", "Ottawa", "Edmonton", "Quebec", "Winnipeg"],
  "Austrália": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Newcastle", "Canberra"],
  "Nova Zelândia": ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Napier-Hastings", "Dunedin", "Palmerston North"]
} as const;

export type Country = keyof typeof europeanCountries;
export type City = typeof europeanCountries[Country][number];

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // "company" or "professional"
  kycStatus: text("kyc_status").notNull().default("pending"), // "pending", "verified", "rejected"
  kycData: jsonb("kyc_data"),
  companyName: text("company_name"),
  profileData: jsonb("profile_data"),
  notificationSettings: jsonb("notification_settings"),
  walletAddress: text("wallet_address"),
  walletBalance: decimal("wallet_balance").default("0"),
  companyCredits: decimal("company_credits").default("0"), // Only for companies
  // Gamification fields
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  experience: integer("experience").notNull().default(0)
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "profile", "jobs", "kyc", "engagement"
  pointsReward: integer("points_reward").notNull(),
  requiredValue: integer("required_value").notNull(), // Value needed to unlock
  icon: text("icon").notNull() // Icon identifier for the achievement
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  progress: integer("progress").notNull().default(0)
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  companyId: integer("company_id").notNull(),
  currency: text("currency").notNull().default("EUR"),
  amount: text("amount").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  workType: text("work_type").notNull().default("remote"),
  requiredSkills: jsonb("required_skills").$type<string[]>(),
  status: text("status").notNull().default("open"),
  assignedTo: integer("assigned_to"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Schema for user achievements
export const achievementSchema = createInsertSchema(achievements);
export const userAchievementSchema = createInsertSchema(userAchievements);

// Extend user insert schema with gamification fields
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  userType: true,
  companyName: true
}).extend({
  userType: z.enum(["company", "professional"]),
  companyName: z.string().optional()
});

// Update job insert schema
export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  description: true,
  amount: true,
  currency: true,
  country: true,
  city: true,
  workType: true,
  requiredSkills: true
}).extend({
  workType: z.enum(["remote", "onsite", "hybrid"]),
  country: z.enum(Object.keys(europeanCountries) as [string, ...string[]]),
  city: z.string(),
  requiredSkills: z.array(z.string()).optional()
});

export const kycSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  documentType: z.enum(["passport", "id_card", "drivers_license"]),
  documentNumber: z.string(),
  nationality: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string()
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type KycData = z.infer<typeof kycSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;