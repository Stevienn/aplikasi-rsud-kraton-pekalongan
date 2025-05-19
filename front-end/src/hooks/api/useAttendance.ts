import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetAttendance = () => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response = await axios.get("/laporan-pengunjung");
      return response.data;
    },
  });
};

export const useGetPatientDoctorAttendance = () => {
  return useQuery({
    queryKey: ["patient-doctor-attendance"],
    queryFn: async () => {
      const response = await axios.get("/laporan-pasien");
      return response.data;
    },
  });
};
