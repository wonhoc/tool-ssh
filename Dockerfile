# 빌드 단계
FROM node:22-alpine AS builder

WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm ci

# 소스 파일 복사 및 빌드
COPY . .
RUN npm run build:dev

# 실행 단계
FROM node:22-alpine

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드된 파일만 복사
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["npm", "run", "start:dev"]