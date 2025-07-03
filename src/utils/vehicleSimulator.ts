import { Vehicle } from "../store/vehicleStore";

// 한국 주요 도시 좌표
const koreanCities = [
  { name: "서울", lat: 37.5665, lng: 126.978 },
  { name: "부산", lat: 35.1796, lng: 129.0756 },
  { name: "인천", lat: 37.4563, lng: 126.7052 },
  { name: "대구", lat: 35.8714, lng: 128.6014 },
  { name: "대전", lat: 36.3504, lng: 127.3845 },
  { name: "광주", lat: 35.1595, lng: 126.8526 },
  { name: "수원", lat: 37.2911, lng: 127.0089 },
  { name: "울산", lat: 35.5384, lng: 129.3114 },
  { name: "창원", lat: 35.2278, lng: 128.6817 },
  { name: "고양", lat: 37.6584, lng: 126.832 },
];

// 차량 타입별 기본 속도
const vehicleSpeeds = {
  truck: { min: 30, max: 80 },
  bus: { min: 20, max: 60 },
  car: { min: 0, max: 100 },
};

// 차량 상태별 확률
const statusProbabilities = {
  active: 0.7,
  idle: 0.2,
  maintenance: 0.1,
};

export class VehicleSimulator {
  private vehicles: Vehicle[];
  private intervalId: NodeJS.Timeout | null = null;
  private updateCallback: ((vehicle: Vehicle) => void) | null = null;

  constructor(initialVehicles: Vehicle[]) {
    this.vehicles = [...initialVehicles];
  }

  // 차량 위치를 랜덤하게 이동
  private moveVehicle(vehicle: Vehicle): Vehicle {
    const speed = vehicle.speed;
    const maxDistance = speed * 0.001; // 속도에 비례한 이동 거리

    const latChange = (Math.random() - 0.5) * maxDistance;
    const lngChange = (Math.random() - 0.5) * maxDistance;

    return {
      ...vehicle,
      position: {
        lat: vehicle.position.lat + latChange,
        lng: vehicle.position.lng + lngChange,
      },
      lastUpdate: new Date().toISOString(),
    };
  }

  // 차량 속도를 랜덤하게 변경
  private updateVehicleSpeed(vehicle: Vehicle): Vehicle {
    const speedRange = vehicleSpeeds[vehicle.type];
    const currentSpeed = vehicle.speed;
    const speedChange = (Math.random() - 0.5) * 10; // ±5 km/h 변화

    let newSpeed = currentSpeed + speedChange;
    newSpeed = Math.max(speedRange.min, Math.min(speedRange.max, newSpeed));

    return {
      ...vehicle,
      speed: Math.round(newSpeed),
    };
  }

  // 차량 상태를 랜덤하게 변경
  private updateVehicleStatus(vehicle: Vehicle): Vehicle {
    const random = Math.random();
    let newStatus = vehicle.status;

    if (random < 0.05) {
      // 5% 확률로 상태 변경
      const statuses = Object.keys(statusProbabilities) as Vehicle["status"][];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      newStatus = randomStatus;
    }

    return {
      ...vehicle,
      status: newStatus,
    };
  }

  // 차량 업데이트
  private updateVehicle(vehicle: Vehicle): Vehicle {
    let updatedVehicle = vehicle;

    // 활성 상태인 차량만 이동
    if (vehicle.status === "active") {
      updatedVehicle = this.moveVehicle(updatedVehicle);
    }

    // 속도 업데이트
    updatedVehicle = this.updateVehicleSpeed(updatedVehicle);

    // 상태 업데이트
    updatedVehicle = this.updateVehicleStatus(updatedVehicle);

    return updatedVehicle;
  }

  // 시뮬레이션 시작
  start(callback: (vehicle: Vehicle) => void, intervalMs: number = 5000) {
    this.updateCallback = callback;

    this.intervalId = setInterval(() => {
      // 랜덤하게 1-3개 차량 업데이트
      const updateCount = Math.floor(Math.random() * 3) + 1;
      const shuffledVehicles = [...this.vehicles].sort(
        () => Math.random() - 0.5
      );

      for (let i = 0; i < Math.min(updateCount, shuffledVehicles.length); i++) {
        const vehicle = shuffledVehicles[i];
        const updatedVehicle = this.updateVehicle(vehicle);

        // Zustand 스토어 업데이트
        this.vehicles = this.vehicles.map((v) =>
          v.id === updatedVehicle.id ? updatedVehicle : v
        );

        // 콜백 호출
        if (this.updateCallback) {
          this.updateCallback(updatedVehicle);
        }
      }
    }, intervalMs);
  }

  // 시뮬레이션 중지
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.updateCallback = null;
  }

  // 새로운 차량 추가
  addVehicle(vehicle: Vehicle) {
    this.vehicles.push(vehicle);
  }

  // 차량 제거
  removeVehicle(vehicleId: string) {
    this.vehicles = this.vehicles.filter((v) => v.id !== vehicleId);
  }

  // 모든 차량 반환
  getVehicles(): Vehicle[] {
    return [...this.vehicles];
  }
}

// 더미 차량 데이터 생성
export function generateDummyVehicles(count: number = 10): Vehicle[] {
  const vehicles: Vehicle[] = [];
  const types: Vehicle["type"][] = ["truck", "bus", "car"];

  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const city = koreanCities[Math.floor(Math.random() * koreanCities.length)];
    const speedRange = vehicleSpeeds[type];

    const vehicle: Vehicle = {
      id: i.toString(),
      name: `${
        type === "truck" ? "트럭" : type === "bus" ? "버스" : "승용차"
      }-${String(i).padStart(3, "0")}`,
      type,
      position: {
        lat: city.lat + (Math.random() - 0.5) * 0.1,
        lng: city.lng + (Math.random() - 0.5) * 0.1,
      },
      status:
        Math.random() < statusProbabilities.active
          ? "active"
          : Math.random() < statusProbabilities.idle
          ? "idle"
          : "maintenance",
      speed:
        Math.floor(Math.random() * (speedRange.max - speedRange.min)) +
        speedRange.min,
      lastUpdate: new Date().toISOString(),
      route: `${city.name}-${
        koreanCities[Math.floor(Math.random() * koreanCities.length)].name
      }`,
    };

    vehicles.push(vehicle);
  }

  return vehicles;
}
