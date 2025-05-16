import IICD from "@/interface/icdInterface";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetICD = () => {
  return useQuery<IICD[]>({
    queryKey: ["icd"],
    queryFn: async () => {
      const response = await axios.get("/ICD");
      return response.data;
    },
  });
};
