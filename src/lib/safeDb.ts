import "server-only";

/**
 * Wraps database queries with try/catch and returns a fallback value on error.
 * Prevents unhandled database errors from crashing pages during build or runtime.
 */
export async function safeQuery<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error("[safeQuery] Database error:", error);
    return fallback;
  }
}
