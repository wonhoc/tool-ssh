# SSH TOOL

genkit 사용하기 위한 ssh 연결 tool 입니다.

## 환경 설정

프로젝트는 다음과 같은 환경 설정 파일을 사용합니다:

-   `.env.local`: 로컬 개발 환경
-   `.env.dev`: 개발 서버 환경
-   `.env.prod`: 프로덕션 환경

각 환경에 맞는 설정 파일이 프로젝트 루트 디렉토리에 위치해야 합니다.

## 패키지 설치

프로젝트 실행 전 필요한 패키지를 설치합니다:

```bash
npm install
```

## 실행 명령어

### 로컬 개발 환경

로컬 개발 환경에서는 TypeScript 코드를 직접 실행하며, 코드 변경 시 자동으로 재시작됩니다:

```bash
npm run dev
```

이 명령어는 `.env.local` 파일의 환경 변수를 사용합니다.

### 개발 서버 환경

개발 서버 배포를 위해 TypeScript 코드를 JavaScript로 컴파일한 후 실행합니다:

```bash
# 개발 서버용 빌드
npm run build:dev

# 컴파일된 코드 실행
npm run start:dev
```

이 명령어는 `.env.dev` 파일의 환경 변수를 사용합니다.

### 프로덕션 환경

프로덕션 배포를 위해 TypeScript 코드를 JavaScript로 컴파일한 후 실행합니다:

```bash
# 프로덕션용 빌드
npm run build:prod

# 컴파일된 코드 실행
npm run start:prod
```

이 명령어는 `.env.prod` 파일의 환경 변수를 사용합니다.

## Docker를 이용한 실행

Docker 환경에서도 개발 및 프로덕션 환경을 지원합니다:

### 개발 환경 Docker

```bash
# 개발 환경 Docker 이미지 빌드
npm run docker:dev

# 컨테이너 실행
docker run -p 3001:3001 myapp:dev
```

### 프로덕션 환경 Docker

```bash
# 프로덕션 환경 Docker 이미지 빌드
npm run docker:prod

# 컨테이너 실행
docker run -p 3001:3001 myapp:prod
```
