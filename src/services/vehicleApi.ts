import axios from "axios";
import { Vehicle } from "../store/vehicleStore";
import { generateDummyVehicles } from "../utils/vehicleSimulator";

const API_BASE_URL = "https://api.example.com";

export const vehicleApi = {
  getVehicles: async (): Promise<Vehicle[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`);
      return response.data;
    } catch (error) {
      console.error("차량 데이터 가져오기 실패:", error);
      return getMockVehicles();
    }
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

function getMockVehicles(): Vehicle[] {
  return generateDummyVehicles(15);
}
