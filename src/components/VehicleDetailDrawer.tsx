import React from "react";
import { VehicleGeoJson } from "../store/vehicleStore";

interface VehicleDetailDrawerProps {
  vehicle?: VehicleGeoJson["features"][0];
  open: boolean;
  onClose: () => void;
}

export const VehicleDetailDrawer: React.FC<VehicleDetailDrawerProps> = ({
  vehicle,
  open,
  onClose,
}) => {
  if (!vehicle) return null;
  const v = vehicle.properties;
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ maxWidth: 400 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">차량 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-64px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              차량명
            </label>
            <p className="mt-1 text-lg font-semibold">{v.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              타입
            </label>
            <p className="mt-1 text-lg font-semibold capitalize">{v.type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              상태
            </label>
            <span
              className={`mt-1 inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                v.status === "활성"
                  ? "bg-green-100 text-green-800"
                  : v.status === "대기"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {v.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              속도
            </label>
            <p className="mt-1 text-lg font-semibold">{v.speed} km/h</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              위치
            </label>
            <p className="mt-1 text-base">
              위도: {vehicle.geometry.coordinates[1].toFixed(6)}
            </p>
            <p className="text-base">
              경도: {vehicle.geometry.coordinates[0].toFixed(6)}
            </p>
          </div>
          {v.route && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                경로
              </label>
              <p className="mt-1 text-lg font-semibold">{v.route}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              마지막 업데이트
            </label>
            <p className="mt-1 text-sm text-gray-600">
              {new Date(v.lastUpdate).toLocaleString()}
            </p>
          </div>
          {v.history && v.history.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최근 이동 이력
              </label>
              <ol className="text-xs text-gray-500 space-y-1 max-h-32 overflow-y-auto list-decimal list-inside">
                {v.history
                  .slice(-10)
                  .reverse()
                  .map((h, idx) => (
                    <li key={idx}>
                      {h.lat.toFixed(5)}, {h.lng.toFixed(5)}
                      <span className="ml-2 text-gray-400">
                        {new Date(h.timestamp).toLocaleTimeString()}
                      </span>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
