import { IDoctor, IDoctorSpc } from "./doctorInterface";
import IICD from "./icdInterface";
import { IUser } from "./patientInterface";

interface IHistory {
  id?: number;
  diagnosa_primary: IICD;
  diagnosa_secondary: IICD;
  tanggal_konsultasi: string;
  keluhan: string;
  diagnosa_sub: string;
  data_dokter_umum?: IDoctor;
  data_dokter_spesialis?: IDoctorSpc;
}

interface IRekapMedis {
  data_pasien?: IUser;
  data_pasien_id?: string | undefined;
  history?: IHistory[];
  history_ids: number[] | undefined;
}

export type { IRekapMedis, IHistory };
