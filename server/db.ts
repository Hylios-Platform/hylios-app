import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Usar URL padrão para desenvolvimento se não for configurada
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

// Configurando um timeout maior para evitar problemas de conexão
neonConfig.connectionTimeoutMillis = 10000;

export const pool = new Pool({ 
  connectionString: DATABASE_URL,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo máximo que uma conexão pode ficar inativa
  connectionTimeoutMillis: 10000 // Tempo máximo para estabelecer uma conexão
});
export const db = drizzle({ client: pool, schema });
