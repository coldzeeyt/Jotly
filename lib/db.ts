import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
export const dataDir=process.env.DATA_DIR||path.join(process.cwd(),'.data');
let connection:DatabaseSync|undefined;
export function db(){if(connection)return connection;mkdirSync(dataDir,{recursive:true});connection=new DatabaseSync(path.join(dataDir,'jotly.sqlite'));connection.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,password TEXT NOT NULL,created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY,owner TEXT NOT NULL REFERENCES users(id),data TEXT NOT NULL,updated TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS notes_owner ON notes(owner);
CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY,owner TEXT NOT NULL REFERENCES users(id),name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS uploads (id TEXT PRIMARY KEY,owner TEXT NOT NULL REFERENCES users(id),name TEXT NOT NULL,type TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);`);return connection}
