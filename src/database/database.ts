import * as SQLite from 'expo-sqlite';
import { Memo } from '../types/memo';

const db = SQLite.openDatabaseSync('memos.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS memos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      tags TEXT NOT NULL,
      color TEXT NOT NULL,
      isPinned INTEGER NOT NULL DEFAULT 0
    );
  `);
};

export const saveMemo = (memo: Memo) => {
  const statement = db.prepareSync(`
    INSERT OR REPLACE INTO memos (id, title, content, createdAt, updatedAt, tags, color, isPinned)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  statement.executeSync([
    memo.id,
    memo.title,
    memo.content,
    memo.createdAt.toISOString(),
    memo.updatedAt.toISOString(),
    JSON.stringify(memo.tags),
    memo.color,
    memo.isPinned ? 1 : 0
  ]);
};

export const getAllMemos = (): Memo[] => {
  const result = db.getAllSync('SELECT * FROM memos ORDER BY isPinned DESC, updatedAt DESC');
  
  return result.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    tags: JSON.parse(row.tags),
    color: row.color,
    isPinned: row.isPinned === 1
  }));
};

export const deleteMemoById = (id: string) => {
  const statement = db.prepareSync('DELETE FROM memos WHERE id = ?');
  statement.executeSync([id]);
};

export const searchMemos = (query: string): Memo[] => {
  const statement = db.prepareSync(`
    SELECT * FROM memos 
    WHERE title LIKE ? OR content LIKE ?
    ORDER BY isPinned DESC, updatedAt DESC
  `);
  
  const result = statement.executeSync(`%${query}%`, `%${query}%`).getAllSync();
  
  return result.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    tags: JSON.parse(row.tags),
    color: row.color,
    isPinned: row.isPinned === 1
  }));
};
