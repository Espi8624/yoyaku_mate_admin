# Dev/Prod 이중 환경 Vite 프록시 구현

> 최종 수정: 2026-07-10  
> 관련 파일: [`vite.config.js`](../../vite.config.js), [`src/api/adminService.js`](../../src/api/adminService.js)

## 문제 배경

Admin 대시보드는 개발(Dev)과 프로덕션(Prod) 서버를 **화면에서 탭으로 전환**하며 동시에 관리할 수 있어야 합니다.  
로컬 개발 환경에서 외부 서버로 직접 요청 시 CORS 문제가 발생합니다.

---

## 해결 방법: Vite 서버 이중 프록시

`vite.config.js`에 두 개의 프록시 경로를 설정하여, 경로 prefix로 대상 서버를 분기합니다.

```javascript
// vite.config.js
proxy: {
  '/proxy-dev': {
    target: env.VITE_PROXY_DEV_TARGET,    // 개발 서버 URL
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/proxy-dev/, '/api/admin'),
  },
  '/proxy-prod': {
    target: env.VITE_PROXY_PROD_TARGET,   // 프로덕션 서버 URL
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/proxy-prod/, '/api/admin'),
  },
}
```

---

## 환경별 URL 분기 (adminService.js)

```javascript
const isDev = import.meta.env.DEV;

export const ENV_URLS = {
  dev:  isDev ? '/proxy-dev'  : `${import.meta.env.VITE_PROXY_DEV_TARGET}/api/admin`,
  prod: isDev ? '/proxy-prod' : `${import.meta.env.VITE_PROXY_PROD_TARGET}/api/admin`,
};
```

| 실행 환경 | `dev` API 경로 | `prod` API 경로 |
|---------|--------------|---------------|
| 로컬 (`npm run dev`) | `/proxy-dev` → Vite Proxy → Dev 서버 | `/proxy-prod` → Vite Proxy → Prod 서버 |
| 빌드 배포 (Vercel) | Dev 서버 직접 URL | Prod 서버 직접 URL |

---

## 환경 변수

```env
# .env.development
VITE_PROXY_DEV_TARGET=http://localhost:8080
VITE_PROXY_PROD_TARGET=https://your-production-server.fly.dev
```

---

## 관련 문서

- [ADR-001: Vite 프록시 채택 이유](../decisions/ADR-001-vite-proxy.ko.md)
- [점포 심사 기능 사양](../features/store-approval.ko.md)
