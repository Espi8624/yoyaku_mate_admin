# 빌드/실행 환경별 Vite 프록시 및 환경 분리 구현

> 최종 수정: 2026-07-10  
> 관련 파일: [`vite.config.js`](../../vite.config.js), [`src/api/adminService.js`](../../src/api/adminService.js)

## 문제 배경

Admin 대시보드는 로컬 개발 환경과 프로덕션 환경의 접속 서버(API 및 DB)를 명확히 구분해야 합니다.
과거에는 UI 탭을 이용해 화면에서 동적으로 Dev/Prod API를 오가도록 구현했으나, 로컬에서의 DB 접속 혼선과 관리 복잡성을 줄이기 위해 **애플리케이션 실행/빌드 시점에 로드되는 환경 변수(`.env`)에 따라 고정된 백엔드에 바인딩**하도록 설정을 개편했습니다.
또한 로컬 개발 시에는 CORS 문제를 회피하기 위해 Vite 개발 서버의 프록시 기능을 활용합니다.

---

## 해결 방법: Vite 서버 단일 프록시 통합

`vite.config.js`에 단일 프록시 경로(`/api/admin`)를 설정하고, 로드된 실행 모드(`.env` 파일)에 정의된 `VITE_PROXY_TARGET`으로 요청을 프록시하도록 구성합니다.

```javascript
// vite.config.js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/admin': {
          target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          // /api/admin/* 요청을 target/api/admin/* 으로 그대로 전달
        },
      },
    },
  }
})
```

---

## 환경별 URL 분기 (adminService.js)

`apiClient` 생성 시, 로컬 개발 환경(`import.meta.env.DEV`)일 때는 CORS 우회를 위해 상대경로 `/api/admin`을 `baseURL`로 사용하고, 프로덕션 빌드 후 배포된 환경에서는 해당 환경 변수에 지정된 `VITE_API_BASE_URL` 절대 경로를 사용하도록 설정했습니다.

```javascript
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? '/api/admin' : (import.meta.env.VITE_API_BASE_URL || '/api/admin');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});
```

| 실행 모드 | 실행 명령어 | 로드되는 환경 파일 | 프록시 대상 (`VITE_PROXY_TARGET`) | 실 배포용 API (`VITE_API_BASE_URL`) |
|---------|---------|--------------|---------------|------------------|
| 로컬 개발 (Dev) | `npm run dev:dev` | `.env.development` | `http://localhost:8080` (로컬 백엔드) | `http://localhost:8080/api/admin` |
| 로컬 운영 테스트 (Prod) | `npm run dev:prod` | `.env.production` | `https://rusui-prod.fly.dev` (실서버) | `https://rusui-prod.fly.dev/api/admin` |

---

## 환경 변수 파일 구성

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/admin
VITE_PROXY_TARGET=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://rusui-prod.fly.dev/api/admin
VITE_PROXY_TARGET=https://rusui-prod.fly.dev
```

---

## 관련 문서

- [ADR-001: Vite 프록시 채택 이유](../decisions/ADR-001-vite-proxy.ko.md)
- [점포 심사 기능 사양](../features/store-approval.ko.md)
