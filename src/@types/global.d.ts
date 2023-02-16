declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    JWT_SECRET: string;
  }
}

declare interface MusicbookJwtPayload {
  id: number;
  name: string;
  displayName: string;
  accessToken: string;
}
