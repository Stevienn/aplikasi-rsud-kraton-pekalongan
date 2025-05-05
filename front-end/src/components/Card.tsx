import Image from "next/image";
import React, { useState } from "react";
import Button from "./form/Button";
import { IDoctor } from "@/interface/doctorInterface";
import Modal from "./Modal";

import _ from "lodash";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { redirect } from "next/navigation";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useCreateRegistration } from "@/hooks/api/useRegistration";
import { IUserData } from "@/interface/patientInterface";
import { getTempRegistration } from "./assets/tempRegistration";

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
  const [modalSchedule, setModalSchedule] = useState(false);
  const [modalRegistration, setModalRegistration] = useState(false);
  const [date, setDate] = useState("");
  const [dayName, setDayName] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const keluhan = getTempRegistration();

  console.log(keluhan);

  const createRegis = useCreateRegistration();

  const today = dayjs();
  const disabledDate = today.add(7, "day");

  const handleRegistration = () => {
    if (selectedSession == "") {
      alert("Mohon pilih sesi terlebih dahulu");
    } else {
      const regisDate = date.format("YYYY-MM-DD");
      const newRegis = {
        data_pasien: userData.user.ID_BPJS,
        tanggal_konsultasi: regisDate,
        keluhan: keluhan,
        nama_dokter: doctorData.nama_dokter,
        sesi_praktek_dokter: selectedSession,
      };
      createRegis.mutate(newRegis, {
        onSuccess: () => {
          redirect("/konfirmasi");
        },
        onError: (error) => {
          console.error("Gagal menambahkan pendaftaran:", error);
        },
      });
    }
  };

  const ScheduleDisplay = ({ schedule }: any) => {
    return (
      <div className="mt-[-20px]">
        {schedule?.map((schedule, index) => (
          <>
            <div key={index} className="mt-[10px]">
              <p className="font-semibold underline">{schedule.hari}</p>
            </div>
            {schedule.sesi_praktek.map((sesi_praktek, index) => (
              <div key={index} className="flex gap-[5px]">
                <p className="font-semibold">Sesi {index + 1} : </p>
                <p>{sesi_praktek}</p>
              </div>
            ))}
          </>
        ))}
      </div>
    );
  };

  const SessionComponent = ({ session }) => {
    const getSession = session.find((data) => dayName == data.hari);

    return (
      <div>
        <p className="text-blue-primary font-semibold mb-[10px]">Pilih Sesi</p>
        <FormControl fullWidth>
          <Select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event?.target.value)}
          >
            {getSession?.sesi_praktek?.length > 0 ? (
              getSession.sesi_praktek.map((sessionData) => (
                <MenuItem key={sessionData} value={sessionData}>
                  {sessionData}
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
      {modalSchedule && (
        <Modal width="w-[500px]">
          <Modal.Header title={`Jadwal Praktek ${doctorData.nama_dokter}`} />
          <Modal.Body>
            <ScheduleDisplay
              schedule={doctorData.schedule_dokter.hari_praktek_dokter}
            />
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
        <Modal width="w-[500px]">
          <Modal.Header title={doctorData.nama_dokter} />
          <Modal.Body>
            <>
              <div>
                <p className="text-blue-primary font-semibold mb-[10px]">
                  Pilih Tanggal
                </p>
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
                <SessionComponent
                  session={doctorData.schedule_dokter.hari_praktek_dokter}
                />
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
      <div className="shadow-2xl w-[300px] rounded-[40px] font-inria-sans">
        <div className="overflow-hidden rounded-tl-[40px] rounded-tr-[40px] max-h-[180px]">
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
            className="underline text-blue-primary font-semibold cursor-pointer mb-[80px]"
            onClick={() => setModalSchedule(true)}
          >
            Lihat Jadwal
          </p>
          <p
            className="bg-gradient-to-r from-blue-secondary to-blue-primary text-white px-[14px] py-[7px] rounded-[27px] max-w-[140px] flex justify-center mb-[9px] cursor-pointer"
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
