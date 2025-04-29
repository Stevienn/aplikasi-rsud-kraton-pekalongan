import Image from "next/image";
import React, { useState } from "react";
import Button from "./form/Button";
import { ISchedule } from "@/interface/doctorInterface";
import Modal from "./Modal";

import dummyDiagnosa from "@/components/assets/dummyDiagnosa";

import _ from "lodash";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import IDiagnosa from "@/interface/pendaftaranInterface";
import { redirect } from "next/navigation";

interface ICardProps {
  image: string;
  categories: string;
  name: string;
  schedule: {
    [key: string]: ISchedule;
  };
  customCategoryClass: string;
  bpjsId: number | undefined;
}

const Card = ({
  image,
  categories,
  name,
  schedule,
  customCategoryClass,
  bpjsId,
}: ICardProps) => {
  const [modalSchedule, setModalSchedule] = useState(false);
  const [modalRegistration, setModalRegistration] = useState(false);
  const [date, setDate] = useState("");
  const [diagnosa, setDiagnosa] = useState<IDiagnosa[]>(dummyDiagnosa);

  const today = dayjs();
  const disabledDate = today.add(7, "day");

  const handleRegistration = () => {
    const currentDiagnosa = diagnosa.find((data) => bpjsId == data.bpjsId);

    if (currentDiagnosa) {
      const updateDiagnosa = {
        ...currentDiagnosa,
        diagnosaDate: date.format("DD-MM-YYYY"),
        keluhan: currentDiagnosa.keluhan,
        doctorName: name,
        subjectiveDiagnosa: currentDiagnosa.subjectiveDiagnosa, // Keep existing or update
        primaryDiagnose: currentDiagnosa.primaryDiagnose, // Keep existing or update
        secondaryDiagnose: currentDiagnosa.secondaryDiagnose,
      };
      const updatedDiagnosa = diagnosa.map((data) =>
        data.bpjsId === bpjsId ? updateDiagnosa : data
      );
      // UPDATE DIAGNOSA USING METHOD PUT OR POST OR PATCH IDONT KNOW
      setDiagnosa(updatedDiagnosa);
      console.log(diagnosa);
      redirect("/konfirmasi");
    } else {
      alert("unknown error");
    }
  };

  const ScheduleDisplay = ({ schedule }: any) => {
    return (
      <div className="mt-[-20px]">
        {/* Change the object into array and map it*/}
        {Object.entries(schedule).map(([day, details]) => (
          <div key={day}>
            <p className="font-semibold mt-[20px]">{_.capitalize(day)} :</p>
            {Object.entries(details).map(([key, time]) => {
              if (
                time &&
                !key.startsWith("total_jam") &&
                !key.startsWith("pasien") //Ignore the total jam and pasien properties
              ) {
                return (
                  <p key={key} className="underline">
                    {time}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id="shared-modal">
      {modalSchedule && (
        <Modal width="w-[500px]">
          <Modal.Header title={`Jadwal Praktek ${name}`} />
          <Modal.Body>
            <ScheduleDisplay schedule={schedule} />
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
          <Modal.Header title={name} />
          <Modal.Body>
            <>
              <p className="text-blue-primary font-semibold mb-[10px]">
                Pilih Tanggal
              </p>
              <div className="mb-[6px]">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    minDate={today}
                    maxDate={disabledDate}
                    onChange={(newValue) => setDate(newValue)}
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
              onClick={handleRegistration}
              customClass="text-[14px] px-[20px] py-[10px]"
            />
          </Modal.Footer>
        </Modal>
      )}
      <div className="shadow-2xl w-[300px] rounded-[40px] font-inria-sans">
        <div className="overflow-hidden rounded-tl-[40px] rounded-tr-[40px] max-h-[180px]">
          <Image src={image} alt="doctor" width={300} height={195} />
        </div>
        <div className="px-[33px] py-[25px]">
          <p
            className={`bg-gradient-to-r ${customCategoryClass} from-blue-tertiary to-blue-secondary text-white px-[15px] py-[5px] rounded-[27px] flex justify-center mb-[9px]`}
          >
            {categories}
          </p>
          <p className="text-[20px] font-bold mb-[5px]">{name}</p>
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
