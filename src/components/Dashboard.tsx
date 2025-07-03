import React, { useState } from "react";
import { VehicleMap } from "./VehicleMap";
import { VehicleList } from "./VehicleList";
import { DashboardStats, VehicleCharts } from "./DashboardStats";
import { useVehicleStore } from "../store/vehicleStore";
import { useVehicles, useVehicleUpdates } from "../hooks/useVehicles";

export const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState("");
  const { vehicles, selectedVehicle, selectVehicle, isLoading, error } =
    useVehicleStore();

  useVehicles();

  useVehicleUpdates();

  const handleVehicleSelect = (vehicle: any) => {
    selectVehicle(vehicle);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">오류 발생!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                실시간 차량 위치 대시보드
              </h1>
              <p className="text-sm text-gray-600">
                GeoJSON 데이터 기반 실시간 모니터링
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">실시간 연결</span>
              </div>
              <div className="text-sm text-gray-500">
                마지막 업데이트: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
          </div>
        )}

        <DashboardStats vehicles={vehicles} />

        <VehicleCharts vehicles={vehicles} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                차량 위치 지도
              </h2>
              <div className="h-96">
                <VehicleMap
                  vehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={handleVehicleSelect}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <VehicleList
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={handleVehicleSelect}
              onFilterChange={handleFilterChange}
              filter={filter}
            />
          </div>
        </div>

        {selectedVehicle && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  선택된 차량 상세 정보
                </h2>
                <button
                  onClick={() => selectVehicle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    차량명
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedVehicle.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    타입
                  </label>
                  <p className="mt-1 text-lg font-semibold capitalize">
                    {selectedVehicle.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    상태
                  </label>
                  <span
                    className={`mt-1 inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                      selectedVehicle.status === "active"
                        ? "bg-green-100 text-green-800"
                        : selectedVehicle.status === "idle"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedVehicle.status === "active"
                      ? "활성"
                      : selectedVehicle.status === "idle"
                      ? "대기"
                      : "정비"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    속도
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedVehicle.speed} km/h
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    위도
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedVehicle.position.lat.toFixed(6)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    경도
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    {selectedVehicle.position.lng.toFixed(6)}
                  </p>
                </div>
                {selectedVehicle.route && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      경로
                    </label>
                    <p className="mt-1 text-lg font-semibold">
                      {selectedVehicle.route}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    마지막 업데이트
                  </label>
                  <p className="mt-1 text-sm text-gray-600">
                    {new Date(selectedVehicle.lastUpdate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
