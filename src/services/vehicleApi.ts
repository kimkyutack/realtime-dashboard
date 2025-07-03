import axios from "axios";
import { Vehicle, VehicleGeoJson } from "../store/vehicleStore";

const API_BASE_URL = "https://api.example.com";

export const vehicleApi = {
  getVehicles: async (): Promise<VehicleGeoJson> => {
    return getMockVehicles();
  },

  getVehicle: async (id: string): Promise<Vehicle> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error("차량 데이터 가져오기 실패:", error);
      throw error;
    }
  },

  subscribeToUpdates: (callback: (vehicle: Vehicle) => void) => {
    const ws = new WebSocket(
      `${API_BASE_URL.replace("http", "ws")}/vehicles/updates`
    );

    ws.onmessage = (event) => {
      const vehicle = JSON.parse(event.data);
      callback(vehicle);
    };

    return () => ws.close();
  },
};

function getMockVehicles(): VehicleGeoJson {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [126.978, 37.5665] },
        properties: {
          id: "1",
          name: "트럭-001",
          type: "트럭",
          status: "활성",
          speed: 45,
          lastUpdate: new Date().toISOString(),
          route: "서울-부산",
          history: [],
        },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [129.0756, 35.1796] },
        properties: {
          id: "2",
          name: "버스-001",
          type: "버스",
          status: "활성",
          speed: 30,
          lastUpdate: new Date().toISOString(),
          route: "부산시내순환",
          history: [],
        },
      },
      {
        type: "Feature",
        geometry: { type: "Point", coordinates: [126.7052, 37.4563] },
        properties: {
          id: "3",
          name: "승용차-001",
          type: "승용차",
          status: "대기",
          speed: 0,
          lastUpdate: new Date().toISOString(),
          route: "인천-서울",
          history: [],
        },
      },
    ],
  };
}
