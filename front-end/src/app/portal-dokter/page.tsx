"use client";

import React, { useEffect, useState } from "react";
import CustomTable from "@/components/CustomTable";
import { getUser } from "@/api/user";
import { IUserDoctor } from "@/interface/doctorInterface";
import AdminHeader from "@/components/AdminHeader";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

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

  if (!doctorData) return <div>Loading user data...</div>;

  return (
    <div>
      <AdminHeader
        name={doctorData.user.nama_dokter}
        image={doctorData.user.image_dokter}
      />
      <CustomTable doctorData={doctorData?.user} />
    </div>
  );
};

export default PortalDokter;
