import { create } from "zustand";

export interface Vehicle {
  id: string;
  name: string;
  type: "truck" | "car" | "bus";
  position: {
    lat: number;
    lng: number;
  };
  status: "active" | "idle" | "maintenance";
  speed: number;
  lastUpdate: string;
  route?: string;
}

interface VehicleStore {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;

  setVehicles: (vehicles: Vehicle[]) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  selectVehicle: (vehicle: Vehicle | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getActiveVehicles: () => Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehiclesByType: (type: Vehicle["type"]) => Vehicle[];
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,

  setVehicles: (vehicles) => set({ vehicles }),

  updateVehicle: (id, updates) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      ),
    })),

  selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getActiveVehicles: () => get().vehicles.filter((v) => v.status === "active"),

  getVehicleById: (id) => get().vehicles.find((v) => v.id === id),

  getVehiclesByType: (type) => get().vehicles.filter((v) => v.type === type),
}));
