import { useGetAttendance } from "@/hooks/api/useAttendance";
import { BarChart } from "@mui/x-charts";
import React from "react";

const attendanceDay = [
  "Hari Pertama",
  "Hari Kedua",
  "Hari Ketiga",
  "Hari Keempat",
  "Hari Kelima",
  "Hari Keenam",
  "Hari Ini",
];

const attendanceMonth = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const PatientAttendance = () => {
  const { data, isLoading } = useGetAttendance();

  if (isLoading) return <div>Loading data...</div>;

  const attendanceDayData = [
    data.rekap_7_hari_terakhir.Senin,
    data.rekap_7_hari_terakhir.Selasa,
    data.rekap_7_hari_terakhir.Rabu,
    data.rekap_7_hari_terakhir.Kamis,
    data.rekap_7_hari_terakhir.Jumat,
    data.rekap_7_hari_terakhir.Sabtu,
    data.rekap_7_hari_terakhir.Minggu,
  ];

  const attendanceMonthData = [
    data.jumlah_pasien_bulanan.January,
    data.jumlah_pasien_bulanan.February,
    data.jumlah_pasien_bulanan.March,
    data.jumlah_pasien_bulanan.April,
    data.jumlah_pasien_bulanan.May,
    data.jumlah_pasien_bulanan.June,
    data.jumlah_pasien_bulanan.July,
    data.jumlah_pasien_bulanan.August,
    data.jumlah_pasien_bulanan.September,
    data.jumlah_pasien_bulanan.October,
    data.jumlah_pasien_bulanan.November,
    data.jumlah_pasien_bulanan.December,
  ];

  const getYear = () => {
    return Object.keys(data.jumlah_pasien_tahunan);
  };

  const attendanceYear = getYear();

  const getYearData = () => {
    return Object.values(data.jumlah_pasien_tahunan);
  };

  const attendanceYearData = getYearData();

  return (
    <div className="bg-light-primary">
      <div className="px-[55px] py-[30px] font-inria-sans">
        <div className="font-inria-sans bg-white mx-[40px] my-[20px] px-[30px] py-[40px] rounded-[40px]">
          <div className="mb-[20px]">
            <h1 className="text-blue-primary font-inter-sans font-bold text-[23px] ml-[40px] mb-[10px]">
              Grafik Kunjungan Pasien BPJS Minggu Ini
            </h1>
            <BarChart
              xAxis={[
                {
                  id: "attendanceDay",
                  data: attendanceDay,
                },
              ]}
              series={[
                {
                  data: attendanceDayData,
                  label: "Jumlah Kehadiran",
                  color: "#a9b5df",
                },
              ]}
              height={350}
              barLabel="value"
            />
          </div>
          <div className="mb-[20px]">
            <h1 className="text-blue-primary font-inter-sans font-bold text-[23px] ml-[40px] mb-[10px]">
              Grafik Kunjungan Pasien BPJS Per Bulan
            </h1>
            <BarChart
              xAxis={[
                {
                  id: "attendanceMonth",
                  data: attendanceMonth,
                },
              ]}
              series={[
                {
                  data: attendanceMonthData,
                  label: "Jumlah Kehadiran",
                  color: "#a9b5df",
                },
              ]}
              height={350}
              barLabel="value"
            />
          </div>
          <div className="mb-[20px]">
            <h1 className="text-blue-primary font-inter-sans font-bold text-[23px] ml-[40px] mb-[10px]">
              Grafik Kunjungan Pasien BPJS Per Bulan
            </h1>
            <BarChart
              xAxis={[
                {
                  id: "attendanceYear",
                  data: attendanceYear,
                },
              ]}
              series={[
                {
                  data: attendanceYearData,
                  label: "Jumlah Kehadiran",
                  color: "#a9b5df",
                },
              ]}
              height={350}
              barLabel="value"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAttendance;
