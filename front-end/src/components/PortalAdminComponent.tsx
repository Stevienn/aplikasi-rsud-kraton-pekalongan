import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import CustomTable from "./CustomTable";
import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useGetDoctors, useGetSpecialistDoctors } from "@/hooks/api/useDoctor";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const columns = [
  {
    id: "id",
    label: "No Urut",
    width: 100,
  },
  {
    id: "namaPasien",
    label: "Nama Pasien",
    width: 200,
  },
  {
    id: "noBPJS",
    label: "No BPJS",
    width: 200,
  },
  {
    id: "jenisKelamin",
    label: "Jenis Kelamin",
    width: 200,
  },
  {
    id: "tanggalLahir",
    label: "Tanggal Lahir",
    width: 200,
  },
  {
    id: "nomorHP",
    label: "Nomor HP",
    width: 200,
  },
  {
    id: "email",
    label: "Email",
    width: 200,
  },
  {
    id: "status",
    label: "Status",
    width: 200,
  },
];

dayjs.locale("id");

const PortalAdminComponent = () => {
  const { data: doctorsDataUmum } = useGetDoctors();
  const { data: doctorsDataSpesialis } = useGetSpecialistDoctors();

  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [todayPatient, setTodayPatient] = useState();

  const today = selectedDate.format("dddd");

  const handleChangeDate = (newValue) => {
    setSelectedDate(newValue);
  };

  const doctorsData = [
    ...(doctorsDataUmum || []),
    ...(doctorsDataSpesialis || []),
  ];

  const disabled = dayjs();

  const disabledDate = disabled.add(7, "day");

  useEffect(() => {
    if (!doctorsData || !today) return;

    const allRegistrations = [];

    const filterDoctor = selectedDoctor
      ? doctorsData.filter(
          (doc) => doc.nama_dokter === selectedDoctor.nama_dokter
        )
      : doctorsData;

    filterDoctor.forEach((doctor) => {
      doctor.schedule_dokter?.forEach((schedule) => {
        if (schedule.hari === today) {
          schedule.hari_praktek_set?.forEach((praktek) => {
            if (praktek.data_pendaftaran?.length > 0) {
              allRegistrations.push(...praktek.data_pendaftaran);
            }
          });
        }
      });
    });

    setTodayPatient(allRegistrations);
  }, [doctorsDataUmum, doctorsDataSpesialis, today, selectedDoctor]);

  const rows = useMemo(() => {
    if (!todayPatient) return [];
    return todayPatient.map((data) => ({
      id: data.data_pasien?.nomor_urut,
      namaPasien: data.data_pasien?.nama,
      noBPJS: data.data_pasien?.ID_BPJS,
      jenisKelamin: data.data_pasien?.jenis_kelamin,
      tanggalLahir: data.data_pasien?.tanggal_lahir,
      nomorHP: data.data_pasien?.nomor_HP,
      email: data.data_pasien?.email_pasien,
    }));
  }, [todayPatient]);

  return (
    <div className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans ">
      <div className="mb-[20px] flex justify-between">
        <div className="w-[500px]">
          <p className="text-blue-primary font-semibold mb-[5px] font-inter-sans text-[20px]">
            Pilih Dokter
          </p>
          <Autocomplete
            fullWidth
            options={doctorsData}
            getOptionLabel={(option) => option.nama_dokter}
            value={selectedDoctor ?? null}
            onChange={(event, value) => setSelectedDoctor(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Cari dokter disini ..."
                variant="outlined"
              />
            )}
            sx={{ backgroundColor: "white" }}
          />
        </div>

        <div>
          <p className="text-blue-primary font-semibold mb-[5px] font-inter-sans text-[20px]">
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
      <CustomTable rows={rows} columns={columns} />
    </div>
  );
};

export default PortalAdminComponent;
