import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "./form/Button";
import { IDoctor } from "@/interface/doctorInterface";
import Modal from "./Modal";

import _, { forEach } from "lodash";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { redirect } from "next/navigation";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useCreateRegistration } from "@/hooks/api/useRegistration";
import { IUserData } from "@/interface/patientInterface";
import {
  clearTempRegistration,
  getTempRegistration,
} from "./assets/tempRegistration";
import { useGetSchedule, useUpdateSchedule } from "@/hooks/api/useSchedule";
import { useUpdateUser } from "@/hooks/api/useUser";

const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

interface ICardProps {
  doctorData: IDoctor;
  categories: string;
  customCategoryClass: string;
  userData: IUserData;
}

const Card = ({
  userData,
  doctorData,
  categories,
  customCategoryClass,
}: ICardProps) => {
  dayjs.locale("id");
  const { data: getScheduleDoctor } = useGetSchedule();

  const [modalSchedule, setModalSchedule] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalRegistration, setModalRegistration] = useState(false);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const keluhan = getTempRegistration();

  const [scheduleDoctor, setScheduleDoctor] = useState([]);

  const createRegis = useCreateRegistration();

  const { mutate: updateSchedule } = useUpdateSchedule();
  const { mutate: updateUser } = useUpdateUser();

  const today = dayjs();
  const disabledDate = today.add(7, "day");

  const handleRegistration = () => {
    if (selectedSession == "") {
      alert("Mohon pilih sesi terlebih dahulu");
    } else {
      const getDay = scheduleDoctor.filter((data) => dayName == data.hari.hari);

      if (!getDay) {
        console.error(`Jadwal hari ${dayName} tidak ditemukan.`);
        return;
      }
      const totalRegis = getDay.reduce(
        (acc, sesi) => acc + sesi.data_pendaftaran.length,
        0
      );

      // const getSession = getDay?.find(
      //   (sesi) => sesi.jam_mulai === selectedSession
      // );

      // console.log(getSession);

      updateUser({
        id: userData.user.ID_BPJS,
        data: {
          nomor_urut: totalRegis + 1,
        },
      });

      const getSession = getDay?.find(
        (sesi) => sesi.jam_mulai === selectedSession
      );

      const sesi_praktek =
        getSession.jam_mulai + " - " + getSession.jam_selesai;

      console.log(sesi_praktek);

      const regisDate = date.format("YYYY-MM-DD");
      const newRegis = {
        data_pasien_id: userData.user.ID_BPJS,
        tanggal_konsultasi: regisDate,
        keluhan: keluhan.keluhan,
        nama_dokter: doctorData.nama_dokter,
        sesi_praktek_dokter: sesi_praktek,
      };
      createRegis.mutate(newRegis, {
        onSuccess: () => {
          const existingIds =
            getSession?.data_pendaftaran.map((d) => d.data_pasien.ID_BPJS) ||
            [];
          const updatedIds = [...existingIds, newRegis.data_pasien_id];

          updateSchedule({
            id: getSession.id,
            data: {
              data_pendaftaran_ids: updatedIds, // ← INI penting! Hanya array of ID
            },
          });

          clearTempRegistration();
          setModalSuccess(true);
        },
        onError: (error) => {
          console.error("Gagal menambahkan pendaftaran:", error);
        },
      });
    }
  };

  console.log(categories);

  console.log(scheduleDoctor);

  const ScheduleDisplay = () => {
    useEffect(() => {
      const fetchSchedule = () => {
        if (categories === "Dokter Umum") {
          const filteredSchedule = getScheduleDoctor?.filter(
            (data) => data.dokter_umum.id === doctorData.id
          );
          setScheduleDoctor(filteredSchedule);
        } else if (categories !== "Dokter Umum") {
          console.log("masuk sini");
          const filteredSchedule = getScheduleDoctor?.filter(
            (data) => data.dokter_spesialis.id === doctorData.id
          );
          setScheduleDoctor(filteredSchedule);
        }
      };
      fetchSchedule();
    }, [categories, doctorData, getScheduleDoctor]);
    const scheduleByDay = {};

    scheduleDoctor?.forEach((schedule) => {
      const day = schedule.hari.hari;
      if (!scheduleByDay[day]) {
        scheduleByDay[day] = [];
      }
      scheduleByDay[day].push(schedule);
    });
    return (
      <div className="mt-[-20px]">
        {hari.map((dayName) => {
          const daySchedules = scheduleByDay[dayName];
          if (!daySchedules || daySchedules.length === 0) return null;

          return (
            <div key={dayName} className="mb-4">
              <div className="mt-[10px]">
                <p className="font-semibold underline">{dayName}</p>
              </div>

              {daySchedules.map((schedule, index) => (
                <div key={`${dayName}-${index}`} className="flex gap-[5px]">
                  <p className="font-semibold">Sesi {index + 1}:</p>
                  <p>
                    {schedule.jam_mulai} - {schedule.jam_selesai}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const SessionComponent = () => {
    useEffect(() => {
      const fetchSchedule = () => {
        if (!doctorData?.id || !getScheduleDoctor) return;

        const filteredSchedule = getScheduleDoctor.filter((data) =>
          categories === "Dokter Umum"
            ? data.dokter_umum?.id === doctorData.id
            : data.dokter_spesialis?.id === doctorData.id
        );

        // Only update if the schedule actually changed
        if (
          JSON.stringify(filteredSchedule) !== JSON.stringify(scheduleDoctor)
        ) {
          setScheduleDoctor(filteredSchedule);
        }
      };

      fetchSchedule();
    }, [categories, doctorData?.id, getScheduleDoctor]); // More specific dependencies

    const getDay = scheduleDoctor.filter((data) => dayName == data.hari.hari);

    console.log(getDay);

    return (
      <div>
        <p className="font-semibold mb-[10px]">Pilih Sesi</p>
        <FormControl fullWidth>
          <Select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event?.target.value)}
          >
            {getDay?.length > 0 ? (
              getDay.map((sessionData) => (
                <MenuItem key={sessionData.id} value={sessionData.jam_mulai}>
                  {sessionData.jam_mulai} - {sessionData.jam_selesai}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Tidak ada sesi tersedia
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    );
  };

  return (
    <div id="shared-modal">
      {modalSuccess && (
        <Modal
          onClose={() => {
            setModalSuccess(false);
            redirect("/konfirmasi");
          }}
          width="md:w-[888px] w-[400px]"
        >
          <Modal.Header title="RSUD Kraton Pekalongan" />
          <Modal.Body>
            <div>
              <p className="font-medium text-[18px]">Pendaftaran Berhasil !</p>
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
      {modalSchedule && (
        <Modal width="w-[400px] md:w-[500px]">
          <Modal.Header title={`Jadwal Praktek ${doctorData.nama_dokter}`} />
          <Modal.Body>
            <ScheduleDisplay />
            <></>
          </Modal.Body>
          <Modal.Footer>
            <Button
              placeholder="Kembali"
              onClick={() => setModalSchedule(false)}
            />
          </Modal.Footer>
        </Modal>
      )}
      {modalRegistration && (
        <Modal width="w-[400px] md:w-[500px]">
          <Modal.Header title={doctorData.nama_dokter} />
          <Modal.Body>
            <>
              <div>
                <p className=" font-semibold mb-[10px]">Pilih Tanggal</p>
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
                <p className="italic text-red-500 text-[13px] mb-[20px]">
                  *Reservasi maksimal 1 minggu ke depan dari tanggal pendaftaran
                </p>
              </div>
              <div>
                <SessionComponent />
              </div>
            </>
          </Modal.Body>
          <Modal.Footer>
            <Button
              placeholder="Kembali"
              onClick={() => {
                setModalRegistration(false);
                setDayName("");
              }}
              isCancel
              customClass="text-[14px] px-[13px] py-[10px]"
            />
            <Button
              placeholder="Daftar"
              onClick={handleRegistration}
              customClass="text-[14px] px-[20px] py-[10px]"
            />
          </Modal.Footer>
        </Modal>
      )}
      <div className="shadow-2xl w-[300px] rounded-[40px] font-inria-sans bg-white">
        <div className="overflow-hidden rounded-tl-[40px] rounded-tr-[40px] max-h-[240px]">
          <Image
            src={doctorData?.image_dokter}
            alt="doctor"
            width={300}
            height={195}
          />
        </div>
        <div className="px-[33px] py-[25px]">
          <p
            className={`bg-gradient-to-r ${customCategoryClass} from-blue-tertiary to-blue-secondary text-white px-[15px] py-[5px] rounded-[27px] flex justify-center mb-[9px]`}
          >
            {categories}
          </p>
          <p className="text-[20px] font-bold mb-[5px]">
            {doctorData?.nama_dokter}
          </p>
          <p
            className="underline text-blue-tertiary font-semibold cursor-pointer mb-[80px]"
            onClick={() => setModalSchedule(true)}
          >
            Lihat Jadwal
          </p>
          <p
            className=" bg-blue-primary hover:bg-orange-primary transition-colors duration-300 ease-in-out text-white px-[14px] py-[7px] rounded-[27px] max-w-[140px] flex justify-center mb-[9px] cursor-pointer"
            onClick={() => setModalRegistration(true)}
          >
            Pilih Dokter
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
