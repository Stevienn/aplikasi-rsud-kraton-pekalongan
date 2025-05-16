import { ISchedule, ISession } from "@/interface/doctorInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetScheduleById = (id: number) => {
  return useQuery<ISchedule>({
    queryKey: ["schedule", id],
    queryFn: async () => {
      const response = await axios.get(`/HariPraktek/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ISession>;
    }) => {
      const response = await axios.patch(`/SesiPraktek/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};
