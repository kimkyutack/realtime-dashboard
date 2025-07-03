import React from "react";
import { Vehicle } from "../store/vehicleStore";

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  onFilterChange: (filter: string) => void;
  filter: string;
}

const getStatusColor = (status: Vehicle["status"]) => {
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

const getTypeIcon = (type: Vehicle["type"]) => {
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
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(filter.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(filter.toLowerCase()) ||
      vehicle.status.toLowerCase().includes(filter.toLowerCase())
  );

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
          filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedVehicle?.id === vehicle.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTypeIcon(vehicle.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {vehicle.type} • {vehicle.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {vehicle.speed} km/h
                  </p>
                </div>
              </div>

              {vehicle.route && (
                <p className="text-xs text-gray-500 mt-2">
                  경로: {vehicle.route}
                </p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                {new Date(vehicle.lastUpdate).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>총 차량: {vehicles.length}대</span>
          <span>
            활성: {vehicles.filter((v) => v.status === "활성").length}대
          </span>
        </div>
      </div>
    </div>
  );
};
