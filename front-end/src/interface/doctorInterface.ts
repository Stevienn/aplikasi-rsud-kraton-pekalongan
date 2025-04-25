interface ISchedule {
  jam_praktek_a?: string; // Optional, as not all days may have this
  total_jam_a?: number;
  jam_praktek_b?: string;
  total_jam_b?: number;
  jam_praktek?: string;
  total_jam?: number;
  pasien?: number[];
}

interface IDoctor {
  id: number;
  name: string;
  image: string;
  email: string;
  password: string;
  specialty: string;
  schedule: {
    [key: string]: ISchedule;
  };
}

export type { ISchedule, IDoctor };
