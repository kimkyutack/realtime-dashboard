import React, { useState } from "react";
import { VehicleMap } from "./VehicleMap";
import { VehicleList } from "./VehicleList";
import { DashboardStats, VehicleCharts } from "./DashboardStats";
import { useVehicleStore } from "../store/vehicleStore";
import { useVehicles, useVehicleUpdates } from "../hooks/useVehicles";
import { VehicleDetailDrawer } from "./VehicleDetailDrawer";

function AddVehicleForm({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (v: any) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("트럭");
  const [route, setRoute] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm z-[10000]">
        <h2 className="text-lg font-bold mb-4">차량 추가</h2>
        <input
          className="w-full mb-2 border p-2 rounded"
          placeholder="차량명"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="w-full mb-2 border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="트럭">트럭</option>
          <option value="버스">버스</option>
          <option value="승용차">승용차</option>
        </select>
        <input
          className="w-full mb-2 border p-2 rounded"
          placeholder="경로(선택)"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              onAdd({
                id: Date.now().toString(),
                name,
                type,
                position: { lat: 37.5665, lng: 126.978 },
                status: "활성",
                speed: 0,
                lastUpdate: new Date().toISOString(),
                route,
                history: [],
              });
              onClose();
            }}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}

export const Dashboard: React.FC = () => {
  const [filter, setFilter] = useState("");
  const {
    vehicles,
    selectedVehicleId,
    getVehicleById,
    selectVehicle,
    isLoading,
    error,
    addVehicle,
    removeVehicle,
    isAdmin,
    toggleAdmin,
  } = useVehicleStore();
  const selectedVehicle = selectedVehicleId
    ? getVehicleById(selectedVehicleId)
    : undefined;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useVehicles();

  useVehicleUpdates();

  const handleVehicleSelect = (feature: any) => {
    selectVehicle(feature.properties.id);
    setDrawerOpen(true);
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

        <DashboardStats vehicles={vehicles.features} />

        <VehicleCharts vehicles={vehicles.features} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                차량 위치 지도
              </h2>
              <div className="h-[486px]">
                <VehicleMap />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <VehicleList
              vehicles={vehicles.features}
              selectedVehicle={selectedVehicle}
              onVehicleSelect={handleVehicleSelect}
              onFilterChange={handleFilterChange}
              filter={filter}
            />
          </div>
        </div>

        <VehicleDetailDrawer
          vehicle={selectedVehicle}
          open={!!selectedVehicle && drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />

        {isAdmin && selectedVehicle && drawerOpen && (
          <button
            className="fixed right-4 bottom-28 z-50 bg-red-600 text-white px-6 py-2 rounded shadow-lg hover:bg-red-700"
            onClick={() => {
              removeVehicle(selectedVehicle.properties.id);
              setDrawerOpen(false);
            }}
          >
            차량 삭제
          </button>
        )}
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <span className="text-sm">관리자 모드</span>
        <button
          onClick={toggleAdmin}
          className={`w-10 h-6 rounded-full ${
            isAdmin ? "bg-blue-600" : "bg-gray-300"
          } relative focus:outline-none`}
        >
          <span
            className={`block w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
              isAdmin ? "translate-x-4" : "translate-x-0"
            }`}
          ></span>
        </button>
      </div>

      {isAdmin && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700"
          onClick={() => setShowAddForm(true)}
        >
          +
        </button>
      )}

      <AddVehicleForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={addVehicle}
      />
    </div>
  );
};
