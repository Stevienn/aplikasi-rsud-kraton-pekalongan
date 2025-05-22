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

  const { data: doctor, isLoading: isLoadingDoctor } = useGetDoctorById(
    doctorData?.user.id,
    {
      enabled: !!doctorData && !doctorData.user.spesialization,
    }
  );

  const { data: doctorSpc, isLoading: isLoadingDoctorSpc } =
    useGetSpecialistDoctorsById(doctorData?.user.id, {
      enabled: !!doctorData && !!doctorData.user.spesialization,
    });

  const finalDoctor = doctorData?.user.spesialization ? doctorSpc : doctor;

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
      <RekapMedisComponent
        id={doctorData.user.id}
        specialization={doctorData.user.spesialization}
        doctor={finalDoctor}
      />
      <Footer isFull />
    </div>
  );
};

export default RekapMedis;
