import { logger } from "./logging.js";

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt >= retries || [401, 404, 409, 422].includes(error.status)) {
        throw error;
      }
      const backoff = delay * Math.pow(2, attempt);
      logger.warn(`Intento ${attempt} fallido. Reintentando en ${backoff}ms...`, { error: error.message });
      await new Promise(res => setTimeout(res, backoff));
    }
  }
}