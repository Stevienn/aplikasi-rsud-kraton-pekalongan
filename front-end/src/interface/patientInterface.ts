interface IUser {
  ID_BPJS: string;
  nama: string;
  jenis_kelamin: string;
  tanggal_lahir: string;
  nomor_HP: string;
  email_pasien: string;
}

interface IUserData {
  user: IUser;
}

export type { IUser, IUserData };
