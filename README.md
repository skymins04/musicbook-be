# 노래책 BE

지상최고의 음악방송 플랫폼 서비스, 노래책 Backend API

## 기능

- 노래책 회원 관리
- 노래책 수록곡 및 신청곡 관리
- 노래책 플레이리스트 오버레이 WebSocket client 통신
- 노래책 서비스를 위한 API 제공

## 기술스택

- Typescript
- Nest.js
- TypeORM (MariaDB)
- Redis
- Cloudflare Images

## 서버구성

- pm2 클러스터 모드로 서비스 2개 띄움
- nginx로 80포트 트래픽을 3000포트로 리버스 프록싱

## 환경요구사항(.env)

- redis, mariadb 컨테이너 실행 (redis requirepass 설정 필)
- GCP console에서 oauth client ID 및 secret 발급
- twitch developer dashboard에서 client ID 및 secret 발급
- cloudflare account ID 및 images token, r2 service key+secret service kry 발급
- cloudflare images와 r2는 workers를 통한 도메인 연결 필요
- JWT_SECRET과 STATIC_SERVE_ROOT에 random string 기입

## 실행법

### 패키지 설치

```sh
npm install
or
yarn install
```

### DB Migration

```sh
npm migration:generate
npm migration:run
or
yarn migration:generate
yarn migration:run
```

### 개발서버 실행

```sh
npm start:dev
or
yarn start:dev
```

### 빌드

```sh
yarn build
```

### PM2 클러스터 실행

```sh
yarn build && pm2 start ecosystem.config.js
```
