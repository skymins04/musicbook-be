declare namespace NodeJS {
  interface ProcessEnv {
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    MYSQL_DATABASE: string;
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
