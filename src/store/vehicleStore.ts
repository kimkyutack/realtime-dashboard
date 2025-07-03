import { create } from "zustand";

export interface Vehicle {
  id: string;
  name: string;
  type: "트럭" | "승용차" | "버스";
  position: {
    lat: number;
    lng: number;
  };
  status: "활성" | "대기" | "정비";
  speed: number;
  lastUpdate: string;
  route?: string;
  history?: { lat: number; lng: number; timestamp: string }[];
}

interface VehicleStore {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;

  setVehicles: (vehicles: Vehicle[]) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  selectVehicle: (vehicle: Vehicle | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  toggleAdmin: () => void;

  getActiveVehicles: () => Vehicle[];
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehiclesByType: (type: Vehicle["type"]) => Vehicle[];
}

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,
  isLoading: false,
  error: null,
  isAdmin: false,

  setVehicles: (vehicles) => set({ vehicles }),

  updateVehicle: (id, updates) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) => {
        if (vehicle.id !== id) return vehicle;
        let newHistory = vehicle.history || [];
        if (
          updates.position &&
          (vehicle.position.lat !== updates.position.lat ||
            vehicle.position.lng !== updates.position.lng)
        ) {
          newHistory = [
            ...newHistory,
            {
              lat: updates.position.lat,
              lng: updates.position.lng,
              timestamp: updates.lastUpdate || new Date().toISOString(),
            },
          ];
        }
        return { ...vehicle, ...updates, history: newHistory };
      }),
    })),

  selectVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  addVehicle: (vehicle) =>
    set((state) => ({ vehicles: [...state.vehicles, vehicle] })),

  removeVehicle: (id) =>
    set((state) => ({ vehicles: state.vehicles.filter((v) => v.id !== id) })),

  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),

  getActiveVehicles: () => get().vehicles.filter((v) => v.status === "활성"),

  getVehicleById: (id) => get().vehicles.find((v) => v.id === id),

  getVehiclesByType: (type) => get().vehicles.filter((v) => v.type === type),
}));
