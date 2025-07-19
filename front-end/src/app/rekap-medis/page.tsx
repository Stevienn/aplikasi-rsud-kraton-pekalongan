"use client";

import { getUser } from "@/api/user";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import RekapMedisComponent from "@/components/RekapMedisComponent";
import {
  useGetDoctorById,
  useGetSpecialistDoctorsById,
} from "@/hooks/api/useDoctor";
import { IUserDoctor } from "@/interface/doctorInterface";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RekapMedis = () => {
  const [doctorData, setDoctorData] = useState<IUserDoctor | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      if (data?.user.role !== "dokter") {
        router.push("/");
        return;
      }
      setDoctorData(data);
    };
    fetchUserData();
  }, []);

  const {
    data: doctor,
    isLoading,
    refetch,
  } = useGetDoctorById(doctorData?.user.id);

  if (isLoading)
    return (
      <div>
        <AdminHeader
          name="Loading..."
          image="/images/no_profile.png"
          linkName1="Rekap Medis"
        />
        Loading doctor data...
      </div>
    );

  if (!doctorData)
    return (
      <div>
        <AdminHeader
          name="Loading..."
          image="/images/no_profile.png"
          linkName1="Rekap Medis"
        />
        Loading user data...
      </div>
    );

  return (
    <div>
      <AdminHeader
        name={doctorData.user.nama_dokter}
        image={doctorData.user.image_dokter}
        linkName1="Rekap Medis"
      />
      <RekapMedisComponent
        id={doctorData.user.id}
        specialization={doctor?.spesialisasi_dokter.nama_spesialisasi}
        doctor={doctor}
      />
      <Footer isFull />
    </div>
  );
};

export default RekapMedis;
