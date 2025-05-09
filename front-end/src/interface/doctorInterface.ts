import IPendaftaran from "./pendaftaranInterface";

interface ISchedule {
  id: number;
  hari: string;
  sesi_praktek: string[];
  jam_total: number;
}

interface IScheduleDokter {
  id: number;
  hari_praktek_dokter?: ISchedule[];
  data_pendaftaran: IPendaftaran[];
  data_pendaftaran_ids: number[];
}

interface IDoctor {
  id: number;
  nama_dokter: string;
  image_dokter: string;
  email_dokter: string;
  password_dokter: string;
  schedule_dokter: IScheduleDokter;
}

export type { ISchedule, IDoctor, IScheduleDokter };
