"use client";

import React, { useEffect, useState } from "react";
import PortalDoctorComponent from "@/components/PortalDoctorComponent";
import { getUser } from "@/api/user";
import { IDoctor, IDoctorSpc, IUserDoctor } from "@/interface/doctorInterface";
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
    isLoading: isLoadingDoctor,
    refetch: refetchUmum,
  } = useGetDoctorById(doctorData?.user.id, {
    enabled: !!doctorData && !doctorData.user.spesialization,
  });

  const {
    data: doctorSpc,
    isLoading: isLoadingDoctorSpc,
    refetch: refetchSpc,
  } = useGetSpecialistDoctorsById(doctorData?.user.id, {
    enabled: !!doctorData && !!doctorData.user.spesialization,
  });

  const finalDoctor = doctorData?.user.spesialization ? doctorSpc : doctor;
  const finalRefetch = doctorData?.user.spesialization
    ? refetchSpc
    : refetchUmum;

  const loading = doctorData === null || isLoadingDoctor || isLoadingDoctorSpc;

  if (loading)
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

  console.log("Final doctor data:", finalDoctor);

  return (
    <div>
      <AdminHeader
        name={doctorData.user.nama_dokter}
        image={doctorData.user.image_dokter}
        linkName1="Rekap Medis"
      />
      <PortalDoctorComponent
        doctorData={doctorData?.user}
        doctor={finalDoctor}
        refetchDoctor={finalRefetch}
      />
      <Footer isFull />
    </div>
  );
};

export default PortalDokter;
