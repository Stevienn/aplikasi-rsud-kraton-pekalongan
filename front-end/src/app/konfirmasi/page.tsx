"use client";

import { getUser } from "@/api/user";
import { logout } from "@/components/auth/lib";
import Button from "@/components/form/Button";
import FormLayout from "@/components/form/FormLayout";
import InputField from "@/components/form/InputField";
import { useGetRegistrationById } from "@/hooks/api/useRegistration";
import { useGetSchedule } from "@/hooks/api/useSchedule";
import { IUserData } from "@/interface/patientInterface";
import React, { useEffect, useState } from "react";

const Konfirmasi = () => {
  const [userData, setUserData] = useState<IUserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const { data: pendaftaran, isLoading } = useGetRegistrationById(
    userData?.user?.ID_BPJS
  );

  const { data: getSchedule } = useGetSchedule();

  console.log(getSchedule);

  const handleLogout = async () => {
    await logout();
  };

  if (!userData) return <div>Loading user data...</div>;

  if (isLoading) return <div>Loading registration data...</div>;

  return (
    <div>
      <FormLayout title="Selamat Datang !">
        <div>
          {/* Nama */}
          <InputField
            name="Nama (Sesuai KTP)"
            type="text"
            customClass="mb-[10px]"
            inputWidth="w-full md:w-[900px]"
            value={pendaftaran.data_pasien.nama}
            isDisabled
          />
          {/* No BPJS */}
          <InputField
            name="No BPJS"
            type="number"
            placeholder="ex: 1252****"
            customClass="mb-[10px]"
            inputWidth="w-full md:w-[900px]"
            value={pendaftaran.data_pasien.ID_BPJS}
            isDisabled
          />
          {/* Keluhan */}
          <p className="text-gray-600 font-semibold mb-[10px]">Keluhan</p>
          <textarea
            name="Keluhan"
            id="keluhan"
            className="border-[2px] border-gray-300 px-[10px] py-[5px] rounded-[5px] mb-[10px] w-[245px] md:w-[900px] "
            value={pendaftaran.keluhan}
            disabled
          />
          {/* Dokter */}
          <InputField
            name="Nama Dokter"
            type="text"
            customClass="mb-[10px]"
            inputWidth="w-full md:w-[900px]"
            value={pendaftaran.nama_dokter}
            isDisabled
          />
          {/* Jam Praktek */}
          <InputField
            name="Sesi Praktek"
            type="text"
            customClass="mb-[10px]"
            inputWidth="w-full md:w-[900px]"
            value={pendaftaran.sesi_praktek_dokter}
            isDisabled
          />
          {/* No Urut */}
          <InputField
            name="Nomor Urut"
            type="number"
            customClass="mb-[10px]"
            inputWidth="w-full md:w-[900px]"
            value={pendaftaran.data_pasien.nomor_urut}
            isDisabled
          />
          <div className="flex justify-end gap-[25px] mt-[40px] md:mt-[75px]">
            <Button isCancel placeholder="Kembali" onClick={handleLogout} />
          </div>
        </div>
      </FormLayout>
    </div>
  );
};

export default Konfirmasi;
