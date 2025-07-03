import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehicleApi } from "../services/vehicleApi";
import { useVehicleStore } from "../store/vehicleStore";
import { Vehicle } from "../store/vehicleStore";

export const useVehicles = () => {
  const { setVehicles, setLoading, setError } = useVehicleStore();

  const query = useQuery({
    queryKey: ["vehicles"],
    queryFn: vehicleApi.getVehicles,
    refetchInterval: 30000,
  });

  React.useEffect(() => {
    if (query.data) {
      setVehicles(query.data);
      setLoading(false);
      setError(null);
    }
  }, [query.data, setVehicles, setLoading, setError]);

  React.useEffect(() => {
    if (query.error) {
      setError((query.error as Error).message);
      setLoading(false);
    }
  }, [query.error, setError, setLoading]);

  React.useEffect(() => {
    setLoading(query.isLoading);
  }, [query.isLoading, setLoading]);

  return query;
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleApi.getVehicle(id),
    enabled: !!id,
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  const { updateVehicle: updateStoreVehicle } = useVehicleStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Vehicle> }) =>
      Promise.resolve({ id, ...updates }),
    onSuccess: (data) => {
      queryClient.setQueryData(["vehicles"], (old: Vehicle[] | undefined) => {
        if (!old) return old;
        return old.map((vehicle) =>
          vehicle.id === data.id ? { ...vehicle, ...data } : vehicle
        );
      });

      updateStoreVehicle(data.id, data);
    },
  });
};

export const useVehicleUpdates = () => {
  const { updateVehicle } = useVehicleStore();

  React.useEffect(() => {
    const {
      VehicleSimulator,
      generateDummyVehicles,
    } = require("../utils/vehicleSimulator");
    const simulator = new VehicleSimulator(generateDummyVehicles(15));

    return () => {
      simulator.stop();
    };
  }, [updateVehicle]);
};
