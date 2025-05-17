"use client";

import { getUser } from "@/api/user";
import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { IUserData } from "@/interface/patientInterface";
import { useGetDoctors, useGetSpecialistDoctors } from "@/hooks/api/useDoctor";

const PilihDokter = () => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const { data: doctorUmum } = useGetDoctors();
  const { data: doctorSpesialis } = useGetSpecialistDoctors();
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  return (
    <div className="font-inria-sans pb-[130px]">
      <Header name={userData?.user.nama} />
      <h1 className="font-bold text-[30px] ml-[45px] mt-[30px]">Dokter Umum</h1>
      <div className="grid gap-[85px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-[35px] mx-[45px]">
        {doctorUmum?.map((doctor) => (
          <Card
            userData={userData}
            doctorData={doctor}
            categories="Dokter Umum"
            customCategoryClass="w-[140px]"
          />
        ))}
      </div>
      <h1 className="font-bold text-[30px] ml-[45px] mt-[30px]">
        Dokter Spesialis
      </h1>
      <div className="grid gap-[85px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-[35px] mx-[45px]">
        {doctorSpesialis?.map((doctor) => (
          <Card
            userData={userData}
            doctorData={doctor}
            categories={doctor.spesialization}
            customCategoryClass="max-w-[140px]"
          />
        ))}
      </div>

      <Footer isFull={true} />
    </div>
  );
};

export default PilihDokter;
