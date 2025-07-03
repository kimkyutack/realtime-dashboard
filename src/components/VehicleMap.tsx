import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useVehicleStore } from "../store/vehicleStore";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

function MapFlyToSelected() {
  const { selectedVehicleId, getVehicleById } = useVehicleStore();
  const map = useMap();
  const selected = selectedVehicleId
    ? getVehicleById(selectedVehicleId)
    : undefined;

  useEffect(() => {
    if (selected) {
      const [lng, lat] = selected.geometry.coordinates;
      map.setView([lat, lng], 15, { animate: true });
    }
  }, [selected, map]);

  return null;
}

export const VehicleMap = () => {
  const { vehicles, selectVehicle } = useVehicleStore();

  function getVehicleIcon(type: string) {
    const color =
      type === "트럭" ? "#3B82F6" : type === "버스" ? "#10B981" : "#F59E0B";
    const emoji = type === "트럭" ? "🚛" : type === "버스" ? "🚌" : "🚗";
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">${emoji}</div>`,
    });
  }

  return (
    <div className="h-full w-full">
      <MapContainer center={[36.5, 127.5]} zoom={7} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFlyToSelected />
        {vehicles.features.map((feature) => (
          <Marker
            key={feature.properties.id}
            position={[
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ]}
            icon={getVehicleIcon(feature.properties.type)}
            eventHandlers={{
              click: () => selectVehicle(feature.properties.id),
            }}
          >
            <Popup>
              <div>
                <b>{feature.properties.name}</b>
                <br />
                타입: {feature.properties.type}
                <br />
                상태: {feature.properties.status}
                <br />
                속도: {feature.properties.speed} km/h
                <br />
                {feature.properties.route && (
                  <>
                    경로: {feature.properties.route}
                    <br />
                  </>
                )}
                마지막 업데이트:{" "}
                {new Date(feature.properties.lastUpdate).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
