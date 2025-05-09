import { IScheduleDokter } from "@/interface/doctorInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetScheduleById = (id: number) => {
  return useQuery<IScheduleDokter>({
    queryKey: ["schedule", id],
    queryFn: async () => {
      const response = await axios.get(`/Schedule/${id}`);
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
      data: Partial<IScheduleDokter>;
    }) => {
      const response = await axios.patch(`/Schedule/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};
