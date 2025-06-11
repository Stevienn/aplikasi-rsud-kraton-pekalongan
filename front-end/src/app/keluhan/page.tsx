"use client";

import { getUser } from "@/api/user";
import { logout } from "@/components/auth/lib";
import Button from "@/components/form/Button";
import FormLayout from "@/components/form/FormLayout";
import Modal from "@/components/Modal";
import { addToTempRegistration } from "@/components/assets/tempRegistration";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IUserData } from "@/interface/patientInterface";
import { useGetDoctors, useUpdateDoctor } from "@/hooks/api/useDoctor";
import { useUpdateUser } from "@/hooks/api/useUser";
import { useGetSchedule, useUpdateSchedule } from "@/hooks/api/useSchedule";
import { useCreateRegistration } from "@/hooks/api/useRegistration";

const Keluhan = () => {
  dayjs.locale("id");
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [keluhan, setKeluhan] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [already, setAlready] = useState("");
  const [modalRegistration, setModalRegistration] = useState(false);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");
  const { data: doctorUmum } = useGetDoctors();
  const today = dayjs();
  const disabledDate = today.add(7, "day");

  const createRegis = useCreateRegistration();

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: updateSchedule } = useUpdateSchedule();
  const { data: getScheduleDoctor } = useGetSchedule();

  const scheduleUmum = getScheduleDoctor?.filter(
    (item) => item.dokter_umum !== null && item.dokter_spesialis === null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleNextPage = () => {
    if (!keluhan.trim()) {
      alert("Keluhan tidak boleh kosong");
      return;
    }
    if (already === "Sudah") {
      if (userData?.user.ID_BPJS) {
        const validKeluhan =
          typeof keluhan === "string" ? keluhan : String(keluhan);
        const newRegistrasi = {
          keluhan: validKeluhan,
        };
        addToTempRegistration(newRegistrasi);
        redirect("/pilih-dokter");
      }
    } else if (already === "Belum") {
      setModalRegistration(true);
    }
  };

  const handleRegistration = (selectedSession, selectedDoctor) => {
    const totalRegis = selectedSession.data_pendaftaran.length || 0;
    updateUser({
      id: userData?.user.ID_BPJS,
      data: {
        nomor_urut: totalRegis + 1,
      },
    });

    const regisDate = date.format("YYYY-MM-DD");
    const newRegis = {
      data_pasien_id: userData.user.ID_BPJS,
      tanggal_konsultasi: regisDate,
      keluhan: keluhan,
      nama_dokter: selectedDoctor.nama_dokter,
    };
    createRegis.mutate(newRegis, {
      onSuccess: () => {
        const existingIds =
          selectedSession.data_pendaftaran.map((d) => d.data_pasien.ID_BPJS) ||
          [];
        const updatedIds = [...existingIds, newRegis.data_pasien_id];

        updateSchedule({
          id: selectedSession.id,
          data: {
            data_pendaftaran_ids: updatedIds,
          },
        });
        setModalSuccess(true);
      },
      onError: (error) => {
        console.error("Gagal menambahkan pendaftaran:", error);
      },
    });
  };

  const handleAutoAssign = () => {
    let minRegistrations = Infinity;
    let selectedDoctor = null;
    let selectedSession = null;
    doctorUmum?.forEach((doctor) => {
      const getDoctorDay = scheduleUmum.filter(
        (day) => day.hari.hari === dayName
      );
      if (getDoctorDay) {
        getDoctorDay.forEach((session) => {
          const count = session.data_pendaftaran.length;

          if (count < minRegistrations) {
            minRegistrations = count;
            selectedDoctor = doctor;
            selectedSession = session;
          }
        });
      }
    });

    handleRegistration(selectedSession, selectedDoctor);
  };

  return (
    <>
      <div id="shared-modal">
        {modalSuccess && (
          <Modal
            onClose={() => {
              setModalSuccess(false);
              redirect("/konfirmasi");
            }}
            width="w-[888px]"
          >
            <Modal.Header title="RSUD Kraton Pekalongan" />
            <Modal.Body>
              <div>
                <p className="font-medium text-[18px]">
                  Pendaftaran Berhasil !
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                placeholder="Selanjutnya"
                onClick={() => redirect("/konfirmasi")}
              />
            </Modal.Footer>
          </Modal>
        )}
        {modalRegistration && (
          <Modal width="md:w-[500px]">
            <Modal.Header title="Pendaftaran" />
            <Modal.Body>
              <>
                <p className="font-semibold mb-[10px]">Pilih Tanggal</p>
                <div className="mb-[6px]">
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="id"
                  >
                    <DatePicker
                      sx={{ width: "100%" }}
                      minDate={today}
                      maxDate={disabledDate}
                      onChange={(newValue) => {
                        setDate(newValue);
                        if (newValue) {
                          setDayName(newValue.format("dddd"));
                        }
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <p className="italic text-red-500 text-[13px] mb-[85px]">
                  *Reservasi maksimal 1 minggu ke depan dari tanggal pendaftaran
                </p>
              </>
            </Modal.Body>
            <Modal.Footer>
              <Button
                placeholder="Kembali"
                onClick={() => setModalRegistration(false)}
                isCancel
                customClass="text-[14px] px-[13px] py-[10px]"
              />
              <Button
                placeholder="Daftar"
                onClick={handleAutoAssign}
                customClass="text-[14px] px-[20px] py-[10px]"
              />
            </Modal.Footer>
          </Modal>
        )}
      </div>

      <FormLayout title="Selamat Datang !">
        <div className="font-inter-sans pt-[30px] ">
          <h1 className="font-semibold text-[40px] text-gray-600 mb-[25px]">
            Keluhan
          </h1>
          <p className="text-gray-600 font-semibold mb-[10px]">
            Tulis keluhan anda !
          </p>
          <textarea
            name="Keluhan"
            id="keluhan"
            className="border-[2px] border-gray-400 px-[10px] py-[5px] rounded-[8px] mb-[25px] w-[400px] md:w-[900px] "
            placeholder="..."
            value={keluhan}
            onChange={(e) => setKeluhan(e.target.value)}
          />
          <h1 className="font-semibold text-[35px] text-gray-600 mb-[10px]">
            Apakah anda sudah memiliki dokter yang ingin dituju?
          </h1>
          <div className="mb-[130px]">
            <input
              type="radio"
              id="Pria"
              name="Dituju"
              value="Sudah"
              onChange={(event) => setAlready(event.target.value)}
            />
            <label className="ml-[5px] mr-[15px] text-gray-600 font-semibold">
              Sudah
            </label>
            <input
              type="radio"
              id="Wanita"
              name="Dituju"
              value="Belum"
              onChange={(event) => setAlready(event.target.value)}
            />
            <label className="ml-[5px] mr-[15px] text-gray-600 font-semibold">
              Belum
            </label>
          </div>
          <div className="flex justify-end gap-[30px] mb-[15px]">
            <Button placeholder="Kembali" onClick={handleLogout} isCancel />
            <Button placeholder="Daftar" onClick={handleNextPage} />
          </div>
        </div>
      </FormLayout>
    </>
  );
};

export default Keluhan;
