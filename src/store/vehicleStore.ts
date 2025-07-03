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

export type VehicleGeoJson = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      id: string;
      name: string;
      type: "트럭" | "버스" | "승용차";
      status: "활성" | "대기" | "정비";
      speed: number;
      lastUpdate: string;
      route?: string;
      history?: Array<{ lat: number; lng: number; timestamp: string }>;
    };
  }>;
};

interface VehicleStore {
  vehicles: VehicleGeoJson;
  selectedVehicleId: string | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;

  setVehicles: (vehicles: VehicleGeoJson) => void;
  addVehicle: (feature: VehicleGeoJson["features"][0]) => void;
  updateVehicle: (
    id: string,
    updates: Partial<VehicleGeoJson["features"][0]["properties"]>
  ) => void;
  removeVehicle: (id: string) => void;
  selectVehicle: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleAdmin: () => void;

  getVehicleById: (id: string) => VehicleGeoJson["features"][0] | undefined;
}

const emptyGeoJson: VehicleGeoJson = {
  type: "FeatureCollection",
  features: [],
};

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: emptyGeoJson,
  selectedVehicleId: null,
  isLoading: false,
  error: null,
  isAdmin: false,

  setVehicles: (vehicles) => set({ vehicles }),

  addVehicle: (feature) =>
    set((state) => ({
      vehicles: {
        ...state.vehicles,
        features: [...state.vehicles.features, feature],
      },
    })),

  updateVehicle: (id, updates) =>
    set((state) => ({
      vehicles: {
        ...state.vehicles,
        features: state.vehicles.features.map((f) =>
          f.properties.id === id
            ? {
                ...f,
                properties: { ...f.properties, ...updates },
              }
            : f
        ),
      },
    })),

  removeVehicle: (id) =>
    set((state) => ({
      vehicles: {
        ...state.vehicles,
        features: state.vehicles.features.filter((f) => f.properties.id !== id),
      },
    })),

  selectVehicle: (id) => set({ selectedVehicleId: id }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),

  getVehicleById: (id) =>
    get().vehicles.features.find((f) => f.properties.id === id),
}));
