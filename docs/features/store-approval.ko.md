# 점포 라이선스 심사 기능 (Store Approval)

> 최종 수정: 2026-07-10  
> 관련 파일: [`src/pages/StoreApprovalPage.jsx`](../../src/pages/StoreApprovalPage.jsx), [`src/components/StoreDetailModal.jsx`](../../src/components/StoreDetailModal.jsx), [`src/api/adminService.js`](../../src/api/adminService.js)

## 개요

신규 점포가 제출한 사업자등록증을 본사 관리자가 검토하고 승인/거절하는 백오피스 워크플로우입니다.  
개발(Dev)과 프로덕션(Prod) 환경을 화면 내에서 탭으로 전환하며 동시에 관리할 수 있습니다.

---

## 화면 구성

```
StoreApprovalPage
│
├── 환경 탭 (Dev / Prod)        ← 검토할 서버 환경 전환
│
├── 상태 탭
│   ├── 신청 중 (PENDING_REVIEW)
│   ├── 승인 완료 (APPROVED)
│   └── 거절 (REJECTED)
│
└── 점포 목록 테이블
    └── [상세 보기 / 처리] 버튼 → StoreDetailModal 열림
```

---

## StoreDetailModal 동작

모달 열림 시 자동으로 사업자등록증 이미지를 불러옵니다.

```
모달 열림
    │
    ▼
getLicenseImageUrl(store.license_image_url, environment)
    │   ← DB에 저장된 파일 키로 5분 유효 임시 URL 발급
    │
    ▼
<img src={temporaryUrl} />  표시
    │
    ├── [승인] → updateStoreStatus(storeId, 'APPROVED')
    └── [거절] → updateStoreStatus(storeId, 'REJECTED', rejectReason)
                  ※ 거절 이유 입력 필수
```

---

## 점포 상태값

| 상태 | 설명 |
|------|------|
| `PENDING_REVIEW` | 신청 완료, 심사 대기 중 |
| `APPROVED` | 승인 완료 — 서비스 이용 가능 |
| `REJECTED` | 거절 — 거절 사유 포함 |

---

## API 목록

| 함수 | 엔드포인트 | 설명 |
|------|-----------|------|
| `getStoresByStatus(status, env)` | `GET /api/admin/stores?status=` | 상태별 점포 목록 조회 |
| `updateStoreStatus(storeId, status, comment, env)` | `PATCH /api/admin/stores/{storeId}/status` | 승인/거절 처리 |
| `getLicenseImageUrl(imageKey, env)` | `GET /api/admin/license-image-url?key=` | 사업자등록증 임시 URL 발급 |

모든 API는 `environment` 파라미터(`'dev'` / `'prod'`)를 받아 대상 서버를 선택합니다.

---

## 환경 전환 시 동작

환경 탭 변경 시 상태 탭이 자동으로 `PENDING_REVIEW`로 리셋됩니다.

```javascript
const handleEnvChange = (envKey) => {
  setActiveEnv(envKey);
  setActiveTab('PENDING_REVIEW');  // 상태 탭 리셋
};
```

---

## 관련 문서

- [Dev/Prod 이중 환경 프록시 구현](../implementation/dual-env-proxy.ko.md)
- [아키텍처 개요](../implementation/architecture.ko.md)
