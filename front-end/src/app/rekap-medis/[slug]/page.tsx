"use client";
import CustomTable from "@/components/CustomTable";
import { use, useEffect, useMemo, useState } from "react";
import { useGetRekapMedisById } from "@/hooks/api/useRekapMedis";
import AdminHeader from "@/components/AdminHeader";
import { useRouter } from "next/navigation";
import { getUser } from "@/api/user";
import { IUserDoctor } from "@/interface/doctorInterface";
import Footer from "@/components/Footer";

const columns = [
  {
    id: "id",
    width: 50,
  },
  {
    id: "tanggal",
    label: "Tanggal Konsul",
    width: 300,
  },
  {
    id: "keluhan",
    label: "Keluhan",
    width: 300,
  },
  {
    id: "diagnosaSub",
    label: "Diagnosa Subjektif",
    width: 300,
  },
  {
    id: "diagnosaPrim",
    label: "Diagnosa Primary",
    width: 300,
  },
  {
    id: "diagnosaSec",
    label: "Diagnosa Secondary",
    width: 300,
  },
];

type Props = {
  params: Promise<{ slug: string }>;
};

const RekapMedisPasien = ({ params }: Props) => {
  const { slug } = use(params);

  // Fetch data based on slug
  const { data: rekapData } = useGetRekapMedisById(slug);
  const [doctorData, setDoctorData] = useState<IUserDoctor | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      if (data?.user.role !== "dokter") {
        router.push("/");
        return;
      }
      setDoctorData(data);
    };
    fetchUserData();
  }, []);

  const getRekapMedis = () => {
    if (doctorData?.user.spesialization) {
      return rekapData?.history?.filter(
        (h) => h.data_dokter_spesialis?.id === doctorData.user.id
      );
    } else {
      return rekapData?.history?.filter(
        (h) => h.data_dokter_umum?.id === doctorData?.user.id
      );
    }
  };

  const rekapMedis = getRekapMedis();

  const rows = useMemo(() => {
    if (!rekapMedis) return [];
    return rekapMedis.map((data, index) => ({
      id: index + 1,
      tanggal: data.tanggal_konsultasi,
      keluhan: data.keluhan,
      diagnosaSub: data.diagnosa_sub,
      diagnosaPrim: `${data.diagnosa_primary.kode} - ${data.diagnosa_primary.nama_diagnosa}`,
      diagnosaSec: `${data.diagnosa_secondary?.kode ?? ""} - ${
        data.diagnosa_secondary?.nama_diagnosa ?? ""
      }`,
    }));
  }, [rekapMedis]);

  if (!doctorData)
    return (
      <div>
        <AdminHeader
          name="Loading..."
          image="/images/no_profile.png"
          slug={slug}
          linkName1="Rekap Medis"
        />
        Loading user data...
      </div>
    );

  return (
    <div>
      <AdminHeader
        name={doctorData.user.nama_dokter}
        image={doctorData.user.image_dokter}
        slug={slug}
        linkName1="Rekap Medis"
      />
      <div className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans">
        <div className="flex gap-[10px] mb-[20px]">
          <h1 className="text-[30px] font-semibold font-inter-sans">
            Rekap Medis Pasien {rekapData?.data_pasien?.nama} , No BPJS
          </h1>
          <h1 className="text-[30px] font-semibold text-orange-primary font-inter-sans">
            {slug}
          </h1>
        </div>

        <CustomTable rows={rows} columns={columns} />
      </div>
      <Footer isFull />
    </div>
  );
};

export default RekapMedisPasien;
