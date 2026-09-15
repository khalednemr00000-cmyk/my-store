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

  return true;
}

export function resetDbHealthCache() {
  dbAvailableCache = null;
  probePromise = null;
}