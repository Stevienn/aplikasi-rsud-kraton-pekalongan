import IICD from "@/interface/icdInterface";
import axios from "@/lib/axios";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const fetchICDs = async ({ pageParam = 1 }) => {
  const response = await axios.get("/ICD", {
    params: { page: pageParam },
  });
  return response.data;
};

export const useGetICD = () => {
  return useInfiniteQuery({
    queryKey: ["icd"],
    queryFn: fetchICDs,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const nextPage = new URL(lastPage.next).searchParams.get("page");
        return parseInt(nextPage || "");
      }
      return undefined;
    },
  });
};
