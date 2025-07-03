import React from "react";
import { VehicleGeoJson } from "../store/vehicleStore";

interface VehicleListProps {
  vehicles: VehicleGeoJson["features"];
  selectedVehicle: VehicleGeoJson["features"][0] | undefined;
  onVehicleSelect: (vehicle: VehicleGeoJson["features"][0]) => void;
  onFilterChange: (filter: string) => void;
  filter: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "활성":
      return "bg-green-100 text-green-800";
    case "대기":
      return "bg-yellow-100 text-yellow-800";
    case "정비":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "트럭":
      return "🚛";
    case "버스":
      return "🚌";
    case "승용차":
      return "🚗";
    default:
      return "🚗";
  }
};

export const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  onFilterChange,
  filter,
}) => {
  const filteredVehicles = vehicles.filter((feature) => {
    const v = feature.properties;
    return (
      v.name.toLowerCase().includes(filter.toLowerCase()) ||
      v.type.toLowerCase().includes(filter.toLowerCase()) ||
      v.status.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">차량 목록</h2>
        <input
          type="text"
          placeholder="차량명, 타입, 상태로 검색..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredVehicles.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            검색 결과가 없습니다.
          </p>
        ) : (
          filteredVehicles.map((feature) => {
            const v = feature.properties;
            return (
              <div
                key={v.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedVehicle?.properties.id === v.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => onVehicleSelect(feature)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(v.type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{v.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {v.type} • {v.status}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        v.status
                      )}`}
                    >
                      {v.status}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{v.speed} km/h</p>
                  </div>
                </div>

                {v.route && (
                  <p className="text-xs text-gray-500 mt-2">경로: {v.route}</p>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(v.lastUpdate).toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>총 차량: {vehicles.length}대</span>
          <span>
            활성:{" "}
            {vehicles.filter((f) => f.properties.status === "활성").length}대
          </span>
        </div>
      </div>
    </div>
  );
};
