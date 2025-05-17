import { IHistory } from "@/interface/rekapMedisInterface";
import axios from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateHistory = () => {
  return useMutation<IHistory, Error, IHistory>({
    mutationFn: async (newHistory) => {
      const response = await axios.post("/History/", newHistory);
      return response.data;
    },
  });
};
