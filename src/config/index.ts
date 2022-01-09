import { config as dotenvconfig } from "dotenv";

dotenvconfig();

export const config = {
  PORT: process.env.PORT || 5000,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  MONGOURI: process.env.MONGOURI,
};

export default config;
