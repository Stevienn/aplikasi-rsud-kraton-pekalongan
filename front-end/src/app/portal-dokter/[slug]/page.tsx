"use client";
import { getUser } from "@/api/user";
import AdminHeader from "@/components/AdminHeader";
import Button from "@/components/form/Button";
import InputField from "@/components/form/InputField";
import Modal from "@/components/Modal";
import {
  useGetDoctorById,
  useGetSpecialistDoctorsById,
} from "@/hooks/api/useDoctor";
import { useCreateHistory } from "@/hooks/api/useHistory";
import { useGetICD } from "@/hooks/api/useICD";
import {
  useDeleteRegistrationById,
  useGetRegistrationById,
} from "@/hooks/api/useRegistration";
import {
  useCreateRekapMedis,
  useGetRekapMedis,
  useUpdateRekapMedis,
} from "@/hooks/api/useRekapMedis";
import { useUpdateUser } from "@/hooks/api/useUser";
import { IUserDoctor } from "@/interface/doctorInterface";
import { Autocomplete, TextField } from "@mui/material";
import { redirect, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

const PortalDoctorSlug = ({ params }: Props) => {
  const { slug } = use(params);

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

  const { data: doctor, isLoading: isLoadingDoctor } = useGetDoctorById(
    doctorData?.user.id,
    {
      enabled: !!doctorData && !doctorData.user.spesialization,
    }
  );

  const { data: doctorSpc, isLoading: isLoadingDoctorSpc } =
    useGetSpecialistDoctorsById(doctorData?.user.id, {
      enabled: !!doctorData && !!doctorData.user.spesialization,
    });

  const dataDoctor = doctorData?.user.spesialization ? doctorSpc : doctor;

  const [diagnosaSub, setDiagnosaSub] = useState("");

  const { data: dataPatient } = useGetRegistrationById(slug);

  const [selectedPrimary, setSelectedPrimary] = useState();
  const [selectedSecondary, setSelectedSecondary] = useState();
  const [isModalConfirm, setIsModalConfirm] = useState(false);

  const { data: ICD } = useGetICD();
  const { data: rekapData, refetch: refetchRekapMedis } = useGetRekapMedis();

  const deleteRegis = useDeleteRegistrationById();

  const createRekap = useCreateRekapMedis();
  const createHistory = useCreateHistory();
  const updateRekapMedis = useUpdateRekapMedis();
  const updateUser = useUpdateUser();

  const loading = doctorData === null || isLoadingDoctor || isLoadingDoctorSpc;

  if (loading)
    return (
      <div>
        <AdminHeader
          name="Loading..."
          image="/images/no_profile.png"
          linkName1="Rekap Medis"
        />
        Loading doctor data...
      </div>
    );

  if (!doctorData)
    return (
      <div>
        <AdminHeader
          name="Loading..."
          image="/images/no_profile.png"
          linkName1="Rekap Medis"
        />
        Loading user data...
      </div>
    );

  const ICDComponent = ({ selected, setSelected }) => {
    return (
      <div className="mb-[10px]">
        <Autocomplete
          fullWidth
          options={ICD}
          value={selected}
          getOptionLabel={(option) =>
            `${option.kode} : ${option.nama_diagnosa}`
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, value) => setSelected(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Cari diagnosa disini ..."
              variant="outlined"
            />
          )}
        />
      </div>
    );
  };

  const handleSubmit = async () => {
    if (diagnosaSub === "") {
      alert("Diagnosa subjektif harus diisi !");
      return;
    }
    if (selectedPrimary === undefined) {
      alert("Diagnosa primary harus dipilih !");
      return;
    }
    try {
      // Check Pasien
      let pasienInRekap = rekapData?.find(
        (r) => r.data_pasien?.ID_BPJS === dataPatient.ID_BPJS
      );

      if (!pasienInRekap) {
        const createdRekap = await createRekap.mutateAsync({
          data_pasien_id: dataPatient.ID_BPJS,
          history_ids: [],
        });
        pasienInRekap = createdRekap;
        await refetchRekapMedis();
      }

      const newHistory = {
        ...(specialization
          ? { data_dokter_spesialis_id: dataDoctor.id }
          : { data_dokter_umum_id: dataDoctor.id }),
        diagnosa_primary_id: selectedPrimary.id,
        diagnosa_secondary_id: selectedSecondary?.id,
        tanggal_konsultasi: dataPatient.tanggal_konsultasi,
        keluhan: dataPatient.keluhan,
        diagnosa_sub: diagnosaSub,
      };
      const createdHistory = await createHistory.mutateAsync(newHistory);

      const existingIds = pasienInRekap?.history?.map((h) => h.id || []);

      const updatedHistoryIds = [...(existingIds || []), createdHistory.id];

      await updateRekapMedis.mutateAsync({
        id: dataPatient.ID_BPJS,
        data: { history_ids: updatedHistoryIds },
      });

      await deleteRegis.mutateAsync(dataPatient.ID_BPJS);

      await updateUser.mutateAsync({
        id: dataPatient.ID_BPJS,
        data: { nomor_urut: null },
      });
      setIsModalConfirm(true);
    } catch (error) {
      console.error(error);

      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div>
      {isModalConfirm && (
        <Modal
          onClose={() => {
            setIsModalConfirm(false);
          }}
          width="w-[888px]"
        >
          <Modal.Header title="RSUD Kraton Pekalongan" />
          <Modal.Body>
            <div>
              <p className="font-medium text-[18px]">
                Diagnosa berhasil dikirim !
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              placeholder="Kembali"
              onClick={() => {
                redirect("/portal-dokter");
              }}
            />
          </Modal.Footer>
        </Modal>
      )}
      <AdminHeader
        name={doctorData.user.nama_dokter}
        image={doctorData.user.image_dokter}
        linkName1="Rekap Medis"
      />
      <div
        className="bg-light-primary px-[55px] py-[30px] h-[88dvh] font-inria-sans"
        id="shared-modal"
      >
        <div className="font-inria-sans bg-white mx-[200px] my-[20px] px-[100px] py-[40px] rounded-[40px]">
          <div className="flex gap-[10px] mb-[15px]">
            <h1 className="text-[30px] font-semibold text-blue-primary font-inter-sans">
              Kirim Diagnosa Untuk Pasien {dataPatient?.data_pasien?.nama} , No
              BPJS
            </h1>
            <h1 className="text-[30px] font-medium text-blue-primary font-inter-sans">
              {slug}
            </h1>
          </div>

          <InputField
            name="Nama (Sesuai KTP)"
            type="text"
            customClass="mb-[10px]"
            inputWidth="w-full"
            value={dataPatient?.data_pasien.nama}
            isDisabled
          />
          <InputField
            name="Jenis Kelamin"
            type="string"
            customClass="mb-[10px]"
            inputWidth="w-full"
            value={dataPatient?.data_pasien.jenis_kelamin}
            isDisabled
          />
          <p className="text-gray-600 font-semibold mb-[8px]">Keluhan</p>
          <textarea
            name="Keluhan"
            className="border-[2px] border-gray-300 px-[10px] py-[5px] rounded-[5px] mb-[10px] w-full "
            value={dataPatient.keluhan}
            disabled
          />
          <p className="text-gray-600 font-semibold mb-[8px]">
            Diagnosa Subjektif
          </p>
          <textarea
            name="Diagnosa Subjektif"
            className="border-[2px] border-gray-300 px-[10px] py-[5px] rounded-[5px] mb-[10px] w-full "
            placeholder="Input diagnosa subjektif disini ..."
            value={diagnosaSub}
            onChange={(e) => setDiagnosaSub(e.target.value)}
          />
          <p className="text-gray-600 font-semibold mb-[8px]">
            Diagnosa Primary
          </p>
          <ICDComponent
            selected={selectedPrimary}
            setSelected={setSelectedPrimary}
          />
          <p className="text-gray-600 font-semibold mb-[8px]">
            Diagnosa Secondary
          </p>
          <ICDComponent
            selected={selectedSecondary}
            setSelected={setSelectedSecondary}
          />
          <div className="flex justify-end gap-[20px] mt-[30px]">
            <Button
              placeholder="Kembali"
              onClick={() => redirect("/portal-dokter")}
              isCancel
            />
            <Button placeholder="Kirim" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDoctorSlug;
