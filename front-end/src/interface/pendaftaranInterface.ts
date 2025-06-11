import { IUser } from "./patientInterface";

interface IPendaftaran {
  data_pasien_id: string;
  data_pasien?: IUser;
  tanggal_konsultasi: string;
  keluhan: string;
  nama_dokter: string;
}

export default IPendaftaran;
