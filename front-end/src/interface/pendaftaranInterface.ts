import { IUser } from "./patientInterface";

interface IPendaftaran {
  data_pasien: IUser;
  tanggal_konsultasi: string;
  keluhan: string;
  nama_dokter: string;
  sesi_praktek_dokter: string;
}

export default IPendaftaran;
