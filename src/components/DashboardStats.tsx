import React from "react";
import { VehicleGeoJson } from "../store/vehicleStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DashboardStatsProps {
  vehicles: VehicleGeoJson["features"];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ vehicles }) => {
  const activeVehicles = vehicles.filter((f) => f.properties.status === "활성");
  const avgSpeed =
    activeVehicles.length > 0
      ? Math.round(
          activeVehicles.reduce((sum, f) => sum + f.properties.speed, 0) /
            activeVehicles.length
        )
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 px-4 rounded-full bg-blue-100">
            <span className="text-2xl">🚗</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">전체 차량</p>
            <p className="text-2xl font-bold text-gray-900">
              {vehicles.length}대
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 px-4 rounded-full bg-green-100">
            <span className="text-2xl">✅</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">활성 차량</p>
            <p className="text-2xl font-bold text-gray-900">
              {vehicles.filter((f) => f.properties.status === "활성").length}대
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 px-4 rounded-full bg-yellow-100">
            <span className="text-2xl">⚡</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">평균 속도</p>
            <p className="text-2xl font-bold text-gray-900">{avgSpeed} km/h</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <div className="p-3 px-4 rounded-full bg-red-100">
            <span className="text-2xl">🔧</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">정비 중</p>
            <p className="text-2xl font-bold text-gray-900">
              {vehicles.filter((f) => f.properties.status === "정비").length}대
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VehicleCharts: React.FC<DashboardStatsProps> = ({ vehicles }) => {
  const typeStats = vehicles.reduce((acc, feature) => {
    const v = feature.properties;
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusStats = vehicles.reduce((acc, feature) => {
    const v = feature.properties;
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(typeStats).map(([type, count]) => ({
    name: type,
    value: count,
    color:
      type === "트럭" ? "#3B82F6" : type === "버스" ? "#10B981" : "#F59E0B",
  }));

  const statusChartData = Object.entries(statusStats).map(
    ([status, count]) => ({
      name: status,
      value: count,
      color:
        status === "활성"
          ? "#10B981"
          : status === "대기"
          ? "#F59E0B"
          : "#EF4444",
    })
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          차량 타입별 분포
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {typeChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          차량 상태별 분포
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
