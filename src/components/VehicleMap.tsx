import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Vehicle } from "../store/vehicleStore";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const vehicleIcons = {
  truck: L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">🚛</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
  bus: L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">🚌</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
  car: L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: #F59E0B; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">🚗</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  }),
};

interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
}

function MapUpdater({ vehicles }: { vehicles: Vehicle[] }) {
  const map = useMap();

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(
        vehicles.map((v) => [v.position.lat, v.position.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [vehicles, map]);

  return null;
}

export const VehicleMap: React.FC<VehicleMapProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
}) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (selectedVehicle && mapRef.current) {
      mapRef.current.setView(
        [selectedVehicle.position.lat, selectedVehicle.position.lng],
        15
      );
    }
  }, [selectedVehicle]);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[36.5, 127.5]}
        zoom={7}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater vehicles={vehicles} />

        {vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.position.lat, vehicle.position.lng]}
            icon={vehicleIcons[vehicle.type]}
            eventHandlers={{
              click: () => onVehicleSelect(vehicle),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{vehicle.name}</h3>
                <p className="text-sm text-gray-600">타입: {vehicle.type}</p>
                <p className="text-sm text-gray-600">상태: {vehicle.status}</p>
                <p className="text-sm text-gray-600">
                  속도: {vehicle.speed} km/h
                </p>
                {vehicle.route && (
                  <p className="text-sm text-gray-600">경로: {vehicle.route}</p>
                )}
                <p className="text-xs text-gray-500">
                  마지막 업데이트:{" "}
                  {new Date(vehicle.lastUpdate).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
