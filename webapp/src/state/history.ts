/**
 * Print history in IndexedDB: stores the 1 bpp lines + settings of every
 * successful print so jobs can be re-printed or re-loaded with a click.
 */
import type { PersistedSettings } from "./persist";

export interface HistoryEntry {
  id?: number;
  ts: number;
  name: string;
  width: number;
  height: number;
  /** DataURL thumbnail (from the preview canvas). */
  thumb: string;
  lines: Uint8Array[];
  settings: PersistedSettings;
}

const DB_NAME = "fun-printer";
const STORE = "prints";
const MAX_ENTRIES = 50;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        store.createIndex("ts", "ts");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addHistory(entry: Omit<HistoryEntry, "id">): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  await pruneHistory();
}

export async function listHistory(): Promise<HistoryEntry[]> {
  const db = await openDb();
  const entries = await new Promise<HistoryEntry[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as HistoryEntry[]);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return entries.sort((a, b) => b.ts - a.ts);
}

export async function deleteHistory(id: number): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function pruneHistory(): Promise<void> {
  const all = await listHistory();
  for (const entry of all.slice(MAX_ENTRIES)) {
    if (entry.id != null) await deleteHistory(entry.id);
  }
}
