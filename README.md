# 👑 Yoyaku Mate - 통합 관리자 플랫폼 (Admin Web)

> **Yoyaku Mate** 통합 관리 플랫폼은 전체 서비스를 총괄하는 본사 관리자를 위한 **웹 백오피스** 프로젝트입니다. 서비스 입점을 신청한 파트너 매장의 가입 서류를 검토하고 입점을 승인/반려하는 등 매장 라이선스 및 통합 플랫폼 관리를 담당합니다.

---

## 🛠 Tech Stack (기술 스택)

- **Frontend Core:** React 19, React Router DOM 7
- **Build Tool:** Vite 7 (빠른 HMR 및 최적화된 빌드 성능 제공)
- **UI Framework:** Material UI (MUI) v7 / Emotion
- **HTTP Client:** Axios (API 비동기 통신)
- **Deployment:** Vercel / Fly.io

---

## ✨ Key Features (핵심 기능)

- **입점 신청 매장 심사 (Approval System):** 새로 등록을 신청한 매장들의 목록을 확인하고 승인/반려 처리를 수행합니다.
- **매장 상세 정보 모달:** 입점 매장의 신청 세부 정보(대표자 정보, 영업 카테고리 등)를 세부적으로 조회합니다.
- **실시간 데이터 바인딩:** 백엔드 API와의 유기적인 연결을 통해 처리 상태를 실시간으로 대시보드에 반영합니다.

---

## 📂 Project Structure (폴더 구조)

```bash
src/
├── api/                  # API 클라이언트 및 통신 로직 정의
├── assets/               # 로고, 이미지 등 정적 에셋
├── components/           # 공통 재사용 컴포넌트 (예: StoreDetailModal)
├── hooks/                # 상태 및 비즈니스 로직 처리를 위한 커스텀 훅
├── pages/                # 페이지 컴포넌트 (예: StoreApprovalPage)
├── styles/               # 전역 스타일시트 및 MUI 커스텀 테마
├── App.jsx               # 라우터 설정 및 메인 앱 구조
└── main.jsx              # 앱의 진입점 (Entry Point)
```

---

## 🚀 Getting Started (시작 가이드)

### 1. 환경 변수 설정
로컬 개발 환경 구성을 위해 프로젝트 루트 디렉토리에 `.env.development` 파일을 작성합니다.

```env
# 관리자 API 백엔드 서버 주소
VITE_API_BASE_URL=http://localhost:8080/api/admin
```

### 2. 패키지 설치 및 실행
```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 실행 (Vite)
npm run dev
```
실행이 완료되면 터미널에 나타나는 주소(기본값: `http://localhost:5173`)로 브라우저에서 접속할 수 있습니다.

---

## 🔒 Security & Deployment (배포 및 보안)

- **배포:** Vercel 등을 통한 정적 웹 호스팅 환경을 권장합니다.
- **인증 및 인가:** 허가된 본사 관리자만 접근할 수 있도록 백엔드 API 엔드포인트에 보안 필터가 적용되어 있습니다.
