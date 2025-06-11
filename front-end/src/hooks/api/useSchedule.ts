import { ISchedule, ISession } from "@/interface/doctorInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetSchedule = () => {
  return useQuery<ISchedule>({
    queryKey: ["schedule"],
    queryFn: async () => {
      const response = await axios.get(`/SchedulePraktek`);
      return response.data;
    },
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
      const response = await axios.patch(`/SchedulePraktek/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};
