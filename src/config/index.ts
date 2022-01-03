import { config as dotenvconfig } from "dotenv";

dotenvconfig();

export const config = {
  PORT: process.env.PORT || 5000,
  COOKIE_SESSION_KEY: process.env.COOKIE_SESSION_KEY,
};

export default config;
