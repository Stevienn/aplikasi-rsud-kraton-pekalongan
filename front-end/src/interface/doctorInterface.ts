import IPendaftaran from "./pendaftaranInterface";

interface ISession {
  id: number;
  jam_sesi: string;
  jam_total: number;
  data_pendaftaran: IPendaftaran[];
  data_pendaftaran_ids: string[];
}

interface ISchedule {
  id: number;
  hari: string;
  hari_praktek_set: ISession[];
}

interface IDoctor {
  id: number;
  nama_dokter: string;
  image_dokter: string;
  email_dokter: string;
  password_dokter: string;
  spesialisasi_dokter: ISpesialisasi;
}

interface ISpesialisasi {
  id: number;
  nama_spesialisasi: string;
}

interface IUserDoctor {
  user: IDoctor;
}

export type { ISchedule, IDoctor, ISession, IUserDoctor, IDoctorSpc };
