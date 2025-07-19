"use client";

import React, { useEffect, useState } from "react";
import PortalDoctorComponent from "@/components/PortalDoctorComponent";
import { getUser } from "@/api/user";
import { IUserDoctor } from "@/interface/doctorInterface";
import AdminHeader from "@/components/AdminHeader";
import { useRouter } from "next/navigation";
import {
  useGetDoctorById,
  useGetSpecialistDoctorsById,
} from "@/hooks/api/useDoctor";
import Footer from "@/components/Footer";

const PortalDokter = () => {
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
      <PortalDoctorComponent doctor={doctor} refetchDoctor={refetch} />

      <Footer isFull />
    </div>
  );
};

export default PortalDokter;
