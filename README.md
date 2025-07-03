# 실시간 차량 위치 대시보드

GeoJSON 데이터, React Query, Zustand를 활용한 실시간 차량 위치 모니터링 대시보드입니다.

## 🚀 주요 기능

- **실시간 차량 위치 추적**: Leaflet 지도를 사용한 실시간 위치 시각화
- **차량 상태 모니터링**: 활성, 대기, 정비 상태 실시간 업데이트
- **통계 대시보드**: 차량 타입별, 상태별 통계 및 차트
- **검색 및 필터링**: 차량명, 타입, 상태별 검색 기능
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **실시간 데이터 업데이트**: 3초마다 자동 업데이트

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript
- **상태 관리**: Zustand
- **데이터 페칭**: React Query (TanStack Query)
- **지도**: Leaflet, React-Leaflet
- **차트**: Recharts
- **스타일링**: Tailwind CSS
- **HTTP 클라이언트**: Axios

## 📦 설치 및 실행

### 필수 요구사항

- Node.js 16 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 빌드

```bash
# 프로덕션 빌드
npm run build
```

## 🏗️ 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── Dashboard.tsx    # 메인 대시보드
│   ├── VehicleMap.tsx   # 지도 컴포넌트
│   ├── VehicleList.tsx  # 차량 목록
│   └── DashboardStats.tsx # 통계 및 차트
├── store/              # Zustand 스토어
│   └── vehicleStore.ts # 차량 상태 관리
├── hooks/              # 커스텀 훅
│   └── useVehicles.ts  # React Query 훅
├── services/           # API 서비스
│   └── vehicleApi.ts   # 차량 API
├── utils/              # 유틸리티
│   └── vehicleSimulator.ts # 실시간 시뮬레이터
└── App.tsx             # 메인 앱 컴포넌트
```

## 🎯 주요 컴포넌트

### Dashboard

메인 대시보드 컴포넌트로 모든 기능을 통합합니다.

### VehicleMap

Leaflet을 사용한 인터랙티브 지도로 차량 위치를 시각화합니다.

### VehicleList

차량 목록을 표시하고 검색/필터링 기능을 제공합니다.

### DashboardStats

차량 통계와 차트를 표시합니다.

## 🔧 설정

### API 엔드포인트 설정

`src/services/vehicleApi.ts`에서 실제 API 엔드포인트로 변경하세요:

```typescript
const API_BASE_URL = "https://your-api-endpoint.com";
```

### 실시간 업데이트 설정

`src/hooks/useVehicles.ts`에서 업데이트 주기를 조정할 수 있습니다:

```typescript
simulator.start((vehicle: Vehicle) => {
  updateVehicle(vehicle.id, vehicle);
}, 3000); // 3초마다 업데이트
```

## 📊 데이터 구조

### Vehicle 인터페이스

```typescript
interface Vehicle {
  id: string;
  name: string;
  type: "트럭" | "버스" | "승용차";
  position: {
    lat: number;
    lng: number;
  };
  status: "활성" | "대기" | "정비";
  speed: number;
  lastUpdate: string;
  route?: string;
}
```

## 🎨 커스터마이징

### 차량 타입별 아이콘 변경

`src/components/VehicleMap.tsx`의 `vehicleIcons` 객체를 수정하세요.

### 색상 테마 변경

Tailwind CSS 클래스를 사용하여 색상을 커스터마이징할 수 있습니다.

### 차트 스타일 변경

`src/components/DashboardStats.tsx`에서 Recharts 컴포넌트의 props를 수정하세요.

## 🔄 실시간 업데이트

현재는 개발용 시뮬레이터를 사용하여 실시간 업데이트를 구현했습니다. 실제 프로덕션에서는 WebSocket이나 Server-Sent Events를 사용하여 구현할 수 있습니다.

### WebSocket 구현 예시

```typescript
const ws = new WebSocket("wss://your-websocket-endpoint");
ws.onmessage = (event) => {
  const vehicle = JSON.parse(event.data);
  updateVehicle(vehicle.id, vehicle);
};
```

```bash
npm run build
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
