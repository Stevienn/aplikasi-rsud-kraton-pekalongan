import { IRekapMedis } from "@/interface/rekapMedisInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetRekapMedis = () => {
  return useQuery<IRekapMedis[]>({
    queryKey: ["rekapMedis"],
    queryFn: async () => {
      const response = await axios.get("/RekapMedis");
      return response.data;
    },
  });
};

export const useGetRekapMedisById = (id: string) => {
  return useQuery<IRekapMedis>({
    queryKey: ["rekapMedis", id],
    queryFn: async () => {
      const response = await axios.get(`/RekapMedis/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateRekapMedis = () => {
  return useMutation<IRekapMedis, Error, IRekapMedis>({
    mutationFn: async (newRM) => {
      const response = await axios.post("/RekapMedis/", newRM);
      return response.data;
    },
  });
};

export const useUpdateRekapMedis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<IRekapMedis>;
    }) => {
      const response = await axios.patch(`/RekapMedis/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rekapMedis"] });
    },
  });
};
