import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Retorna a conexão com o banco de dados local (Padrão Singleton)
export function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('grade_mobile.db');
  }
  return dbPromise;
}

// Inicializa a criação das tabelas caso não existam
export async function initializeDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    -- Tabela de Matérias/Disciplinas
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      professor TEXT,
      color_hex TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabela de Horários da Grade
    CREATE TABLE IF NOT EXISTS class_schedules (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      day_of_week INTEGER NOT NULL, -- 0 (Domingo) a 6 (Sábado)
      start_time TEXT NOT NULL, -- HH:MM
      end_time TEXT NOT NULL, -- HH:MM
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    );

    -- Tabela de Cards de Aula (Anotações principais)
    CREATE TABLE IF NOT EXISTS class_cards (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT,
      date TEXT NOT NULL, -- YYYY-MM-DD
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    );

    -- Tabela de Blocos (Conteúdos da Anotação Notion-like)
    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      type TEXT NOT NULL, -- 'text', 'code', 'link', 'task'
      content TEXT NOT NULL, -- JSON String (armazena código da linguagem, raw text, url, etc)
      order_index INTEGER NOT NULL,
      FOREIGN KEY (card_id) REFERENCES class_cards (id) ON DELETE CASCADE
    );

    -- Tabela de Tarefas (Hub)
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      block_id TEXT, -- Pode ser null se criada solta, ou preenchido se veio de uma aula
      course_id TEXT, 
      title TEXT NOT NULL,
      due_date DATETIME,
      is_completed INTEGER DEFAULT 0, -- 0 ou 1
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (block_id) REFERENCES blocks (id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE SET NULL
    );
  `);

  console.log('Banco de dados inicializado com sucesso!');
}
