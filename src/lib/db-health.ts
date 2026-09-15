import net from "net";

let dbAvailableCache: boolean | null = null;
let probePromise: Promise<boolean> | null = null;

export async function isDatabaseAvailable(): Promise<boolean> {
  // 1. Explicit local store override
  if (process.env.USE_LOCAL_STORE === "true") {
    return false;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.startsWith("file:")) {
    return false;
  }

  // 2. Return cached connection status (0.001ms)
  if (dbAvailableCache !== null) {
    return dbAvailableCache;
  }

  // 3. Return inflight probe if already in progress
  if (probePromise) {
    return probePromise;
  }

  // 4. Fast 80ms TCP probe
  probePromise = new Promise<boolean>((resolve) => {
    try {
      let host = "127.0.0.1";
      let port = 5432;

      try {
        const parsed = new URL(dbUrl);
        host = parsed.hostname || "127.0.0.1";
        port = parsed.port ? parseInt(parsed.port, 10) : 5432;
      } catch {
        dbAvailableCache = false;
        return resolve(false);
      }

      const socket = net.createConnection({ host, port, timeout: 80 });

      socket.on("connect", () => {
        socket.destroy();
        dbAvailableCache = true;
        resolve(true);
      });

      socket.on("timeout", () => {
        socket.destroy();
        dbAvailableCache = false;
        resolve(false);
      });

      socket.on("error", () => {
        socket.destroy();
        dbAvailableCache = false;
        resolve(false);
      });
    } catch {
      dbAvailableCache = false;
      resolve(false);
    }
  });

  return probePromise;
}

export function resetDbHealthCache() {
  dbAvailableCache = null;
  probePromise = null;
}
