declare namespace NodeJS {
  interface ProcessEnv {
    // DATABASE_URL: string;
    NODE_ENV: string;
    API_ADDRESS: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
    TWITCH_CLIENT_ID: string;
    TWITCH_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }
}

declare interface MusicbookJwtPayload {
  id: string;
  displayName: string;
  accessToken: string;
  provider: string;
  providerId: string;
}
