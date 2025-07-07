import React, { useEffect, useMemo, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import CustomTable from "./CustomTable";
import { useRouter } from "next/navigation";
import { useGetSchedule } from "@/hooks/api/useSchedule";

const columns = [
  {
    id: "id",
    label: "No Urut",
    width: 100,
  },
  {
    id: "namaPasien",
    label: "Nama Pasien",
    width: 300,
  },
  {
    id: "noBPJS",
    label: "No BPJS",
    width: 300,
  },
  {
    id: "jenisKelamin",
    label: "Jenis Kelamin",
    width: 300,
  },
  {
    id: "tanggalLahir",
    label: "Tanggal Lahir",
    width: 300,
  },
  {
    id: "aksiDiag",
    label: "Aksi",
    width: 300,
  },
];

dayjs.locale("id");

const PortalDoctorComponent = ({ doctor, refetchDoctor }: any) => {
  const { data: scheduleData } = useGetSchedule();

  const router = useRouter();

  const scheduleDoctor = useMemo(() => {
    return scheduleData?.filter(
      (schedule) => schedule.dokter_umum.id === doctor.id
    );
  }, [scheduleData]);

  console.log(scheduleDoctor);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSession, setSelectedSession] = useState("");
  const today = selectedDate.format("dddd");

  const [dataPatient, setIsDataPatient] = useState();

  const disabled = dayjs();

  const disabledDate = disabled.add(7, "day");

  const handleChangeDate = (newValue) => {
    setSelectedDate(newValue);
  };

  const todayPatient = useMemo(() => {
    return scheduleDoctor?.filter((data) => today == data.hari.hari);
  }, [scheduleDoctor, today]);

  const todaySessionPatient = todayPatient?.find(
    (data) => selectedSession == data.jam_mulai
  );

  useEffect(() => {
    if (todayPatient?.length > 0) {
      setSelectedSession(todayPatient[0].jam_mulai);
    }
  }, [today, todayPatient]);

  const rows = useMemo(() => {
    if (!todaySessionPatient) return [];
    return todaySessionPatient.data_pendaftaran.map((data) => ({
      id: data.data_pasien?.nomor_urut,
      namaPasien: data.data_pasien?.nama,
      noBPJS: data.data_pasien?.ID_BPJS,
      jenisKelamin: data.data_pasien?.jenis_kelamin,
      tanggalLahir: data.data_pasien?.tanggal_lahir,
    }));
  }, [todaySessionPatient]);

  const SessionComponent = ({ session }) => {
    const getDay = session?.filter((data) => today == data.hari.hari);

    console.log("selectedSession", selectedSession);

    return (
      <div>
        <p className="font-semibold mb-[5px] font-inter-sans text-[20px]">
          Pilih Sesi
        </p>
        <FormControl fullWidth sx={{ backgroundColor: "white" }}>
          <Select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event?.target.value)}
          >
            {getDay?.length > 0 ? (
              getDay?.map((sessionData) => (
                <MenuItem key={sessionData.id} value={sessionData.jam_mulai}>
                  {`${sessionData.jam_mulai} - ${sessionData.jam_selesai}`}
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

  const handleAction = (patientId: string) => {
    console.log("masuk aksi");
    todaySessionPatient?.data_pendaftaran.forEach((data) => {
      if (data.data_pasien?.ID_BPJS == patientId) {
        setIsDataPatient(data.data_pasien);
      }
    });
    router.push(`/portal-dokter/${patientId}`);
  };

  return (
    <div
      className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans "
      id="shared-modal"
    >
      <div className="mb-[20px] flex justify-between">
        <SessionComponent session={scheduleDoctor} />
        <div>
          <p className="font-semibold mb-[5px] font-inter-sans text-[20px]">
            Pilih Tanggal
          </p>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => handleChangeDate(newValue)}
              minDate={disabled}
              maxDate={disabledDate}
              sx={{ backgroundColor: "white" }}
            />
          </LocalizationProvider>
        </div>
      </div>

      <CustomTable rows={rows} columns={columns} handleAction={handleAction} />
    </div>
  );
};

export default PortalDoctorComponent;
