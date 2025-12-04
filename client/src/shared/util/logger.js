// simple logger wrapper
export const isDev = process.env.NODE_ENV !== "production";
export function devLog(...args) {
  if (!isDev) return;
  console.log(...args);
}
