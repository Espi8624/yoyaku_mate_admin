# 개발 과정에서 배운 것들 (Lessons Learned)

> 작성일: 2026-07-10

---

## MUI 커스텀 테마로 디자인 일관성 확보

MUI v7 테마 시스템을 커스터마이징하여 브랜드 컬러(`AppColors`)와 타이포그래피 규칙을 전역 컴포넌트에 주입했습니다.  
신규 관리 컴포넌트를 추가할 때 매번 스타일을 직접 지정하지 않아도 되어 개발 속도가 단축됩니다.

---

## Custom Hook 기반 API 통신 모듈화

비즈니스 데이터 조회와 처리 상태(`isLoading`, `error`)를 React Custom Hook으로 추상화하여,  
컴포넌트의 View 역할과 비즈니스 로직을 분리했습니다.

```javascript
// 나쁜 예: 컴포넌트 안에 직접 API 호출
function StoreApprovalPage() {
  useEffect(() => {
    axios.get('/api/admin/stores').then(...)
  }, [])
}

// 좋은 예: Custom Hook으로 추상화
function StoreApprovalPage() {
  const { stores, isLoading, error, fetchStores } = useStoreApproval(activeTab, activeEnv);
}
```

---

## 사업자등록증 이미지 임시 URL 방식

사업자등록증 이미지를 DB에 파일 경로(Key)로만 저장하고, 요청 시마다 서버에서 5분 유효 임시 URL을 발급받아 표시합니다.  
이를 통해 민감한 이미지를 직접 공개 URL로 노출하지 않고 안전하게 관리할 수 있습니다.

```
store.license_image_url = "uuid-xxxxxx.jpg"  ← DB에 저장된 파일 키
    │
    ▼
getLicenseImageUrl(key) → GET /api/admin/license-image-url?key=uuid-xxxxxx.jpg
    │
    ▼
임시 URL (5분 유효) → <img src={temporaryUrl} />
```

---

## Vite 7 빌드 파이프라인 최적화

Vite 7의 HMR(Hot Module Replacement)로 로컬 개발 시 빠른 반영이 가능하며,  
빌드 최적화 설정으로 번들 사이즈를 최소화하여 Vercel 정적 배포의 안정성을 높였습니다.
