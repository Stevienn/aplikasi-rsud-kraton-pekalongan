import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetICDReport = () => {
  return useQuery({
    queryKey: ["icdReport"],
    queryFn: async () => {
      const response = await axios.get("/laporan-icd");
      return response.data;
    },
  });
};
