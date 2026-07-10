# 아키텍처 개요

> 최종 수정: 2026-07-10

## 기술 스택

| 항목 | 기술 |
|------|------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Router | React Router DOM 7 |
| UI Framework | Material UI (MUI) v7, Emotion |
| HTTP | Axios |
| Deployment | Vercel |

---

## 디렉토리 구조

```
src/
├── api/
│   └── adminService.js       # 모든 Admin API 호출 정의 (환경별 Axios 인스턴스 생성)
│
├── pages/
│   └── StoreApprovalPage.jsx # 점포 심사 메인 화면 (환경 탭 + 상태 탭 + 목록 테이블)
│
├── components/
│   └── StoreDetailModal.jsx  # 점포 상세 모달 (사업자등록증 이미지 + 승인/거절 버튼)
│
├── hooks/                    # 커스텀 훅 (비동기 통신 상태 캡슐화)
├── styles/                   # MUI 글로벌 테마 설정
├── assets/                   # 로고 등 정적 이미지 에셋
├── App.jsx                   # 라우팅 설정 및 레이아웃
└── main.jsx                  # 앱 진입점
```

---

## 데이터 흐름

```
Admin UI (React)
    │
    ▼
Custom Hooks / Event Handler
    │
    ▼
adminService.js (Axios Instance)
    │   ← 환경(dev/prod)에 따라 다른 baseURL 선택
    │
    ▼  Vite Proxy (로컬) / 직접 요청 (Vercel)
    │
    ▼
Backend Admin API (/api/admin/*)
    │
    ├── MongoDB Atlas    ← 점포 상태 업데이트
    └── Cloudflare R2   ← 사업자등록증 임시 URL 발급
```

---

## 환경별 API 라우팅

로컬 개발 시 Vite 개발 서버의 프록시를 통해 CORS 없이 두 환경(Dev/Prod)에 동시 접근합니다.

| 요청 경로 | 로컬 (Vite Proxy) | Vercel |
|---------|-----------------|--------|
| `/proxy-dev/*` | `VITE_PROXY_DEV_TARGET/api/admin/*` | 직접 설정 |
| `/proxy-prod/*` | `VITE_PROXY_PROD_TARGET/api/admin/*` | 직접 설정 |

→ 상세: [dual-env-proxy.md](./dual-env-proxy.ko.md)

---

## 관련 문서

- [점포 심사 기능 사양](../features/store-approval.ko.md)
- [Dev/Prod 이중 환경 프록시 구현](./dual-env-proxy.ko.md)
- [ADR-001: Vite 프록시 채택](../decisions/ADR-001-vite-proxy.ko.md)
