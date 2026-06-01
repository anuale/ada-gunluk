import Dexie, { type EntityTable } from "dexie";

export interface OfflineLog {
  id?: number;
  childId: string;
  type: string;
  logDate: string;
  startedAt?: string;
  endedAt?: string;
  data?: Record<string, unknown>;
  notes?: string;
  synced: number; // 0 = false, 1 = true (IndexedDB doesn't index booleans well)
  createdAt: string;
}

export const db = new Dexie("AdaGunlukOffline") as Dexie & {
  logs: EntityTable<OfflineLog, "id">;
};

db.version(1).stores({
  logs: "++id, childId, type, logDate, synced",
});

export async function syncPendingLogs() {
  const pending = await db.logs.where("synced").equals(0).toArray();

  for (const log of pending) {
    try {
      const res = await fetch("/api/daily-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: log.childId,
          type: log.type,
          logDate: log.logDate,
          startedAt: log.startedAt,
          endedAt: log.endedAt,
          data: log.data,
          notes: log.notes,
        }),
      });

      if (res.ok) {
        await db.logs.update(log.id!, { synced: 1 });
      }
    } catch {
      // Will retry on next sync
    }
  }
}
