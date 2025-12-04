// server/util/logger.js
export const isDev = process.env.NODE_ENV !== "production";
export const devLog = (...args) => {
  if (isDev) console.log(...args);
};
