import React, { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Modal from "./Modal";
import Button from "./form/Button";
import InputField from "./form/InputField";
import ModalDiagnosa from "./ModalDiagnosa";

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
    id: "aksi",
    label: "Aksi",
    width: 300,
  },
];

dayjs.locale("id");

const CustomTable = ({ doctorData }: any) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSession, setSelectedSession] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [dataPatient, setIsDataPatient] = useState();
  const [keluhan, setKeluhan] = useState("");
  const [diagnosaSub, setDiagnosaSub] = useState("");
  const [diagnosaPrim, setDiagnosaPrim] = useState();
  const [diagnosaSec, setDiagnosaSec] = useState();
  const today = selectedDate.format("dddd");
  const disabled = dayjs();

  const disabledDate = disabled.add(7, "day");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeDate = (newValue) => {
    setSelectedDate(newValue);
  };

  const todayPatient = doctorData.schedule_dokter.find(
    (data) => today == data.hari
  );

  const todaySessionPatient = todayPatient.hari_praktek_set.find(
    (data) => selectedSession == data.jam_sesi
  );

  const rows = useMemo(() => {
    if (!todaySessionPatient) return [];
    return todaySessionPatient.data_pendaftaran.map((data) => ({
      id: data.data_pasien.nomor_urut,
      namaPasien: data.data_pasien.nama,
      noBPJS: data.data_pasien.ID_BPJS,
      jenisKelamin: data.data_pasien.jenis_kelamin,
      tanggalLahir: data.data_pasien.tanggal_lahir,
      keluhan: data.keluhan,
    }));
  }, [todaySessionPatient]);

  const SessionComponent = ({ session }) => {
    const getDay = session.find((data) => today == data.hari);

    const getSession = getDay?.hari_praktek_set;

    // Bikin Default Value
    useEffect(() => {
      if (getSession?.length > 0 && !selectedSession) {
        setSelectedSession(getSession[0].jam_sesi);
      }
    }, [getSession, selectedSession]);

    return (
      <div>
        <p className="text-blue-primary font-semibold mb-[10px]">Pilih Sesi</p>
        <FormControl fullWidth>
          <Select
            value={selectedSession}
            onChange={(event) => setSelectedSession(event?.target.value)}
          >
            {getSession?.length > 0 ? (
              getSession.map((sessionData) => (
                <MenuItem key={sessionData.id} value={sessionData.jam_sesi}>
                  {sessionData.jam_sesi}
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

  const handleAction = (patientId: string, keluhan: string) => {
    setKeluhan(keluhan);
    todaySessionPatient.data_pendaftaran.forEach((data) => {
      if (data.data_pasien.ID_BPJS == patientId) {
        setIsDataPatient(data.data_pasien);
      }
    });
    setIsModal(true);
  };

  return (
    <div
      className="bg-light-primary px-[55px] py-[40px] h-[88dvh] font-inria-sans "
      id="shared-modal"
    >
      {isModal && (
        <ModalDiagnosa
          dataPatient={dataPatient}
          keluhan={keluhan}
          diagnosaSub={diagnosaSub}
          setDiagnosaSub={setDiagnosaSub}
          closeModal={() => setIsModal(false)}
        />
      )}
      <div className="mb-[20px] flex justify-between">
        <SessionComponent session={doctorData.schedule_dokter} />
        <div>
          <p className="text-blue-primary font-semibold mb-[10px]">
            Pilih Tanggal
          </p>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => handleChangeDate(newValue)}
              minDate={disabled}
              maxDate={disabledDate}
            />
          </LocalizationProvider>
        </div>
      </div>

      <Paper
        sx={{ width: "100%", overflow: "hidden", border: 0, borderRadius: 5 }}
      >
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      width: column.width,
                      fontSize: 17,
                      fontWeight: "bold",
                      color: "var(--color-blue-primary)",
                      paddingLeft: 38,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ padding: 5, fontStyle: "italic", color: "#888" }}
                  >
                    Tidak ada data pasien.
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => (
                    <TableRow key={i}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            sx={{ paddingY: 5, paddingLeft: 5 }}
                            key={column.id}
                          >
                            {column.id === "aksi" ? (
                              <Image
                                src="/icons/action_icon.png"
                                alt="icon_action"
                                width={21}
                                height={21}
                                onClick={() =>
                                  handleAction(row.noBPJS, row.keluhan)
                                }
                                className="cursor-pointer"
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <div></div>
    </div>
  );
};

export default CustomTable;
