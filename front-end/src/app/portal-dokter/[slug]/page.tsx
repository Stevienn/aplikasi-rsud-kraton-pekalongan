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
import {
  useDeleteRegistrationById,
  useGetRegistrationById,
} from "@/hooks/api/useRegistration";
import { useUpdateUser } from "@/hooks/api/useUser";
import { IUserDoctor } from "@/interface/doctorInterface";
import { redirect, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import axios from "@/lib/axios";
import Footer from "@/components/Footer";

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

  const {
    data: dataDoctor,
    isLoading,
    refetch,
  } = useGetDoctorById(doctorData?.user.id);

  const [diagnosaSub, setDiagnosaSub] = useState("");

  const { data: dataPatient } = useGetRegistrationById(slug);

  // console.log(dataDoctor?.id);

  const [selectedPrimary, setSelectedPrimary] = useState();
  const [selectedSecondary, setSelectedSecondary] = useState();
  const [isModalConfirm, setIsModalConfirm] = useState(false);

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [message, setMessage] = useState("");

  const getICD = async (searchQuery, loadedOptions, { page }) => {
    const response = await axios.get("/ICD", {
      params: {
        search: searchQuery,
        page: page || 1,
      },
    });

    const { results, next } = response.data;
    return {
      options: results.map((item) => ({
        value: item.id,
        label: `${item.kode} : ${item.nama_diagnosa}`,
        data: item,
      })),
      hasMore: !!next,
      additional: {
        page: (page || 1) + 1,
      },
    };
  };

  const deleteRegis = useDeleteRegistrationById();

  const createHistory = useCreateHistory();
  const updateUser = useUpdateUser();

  const sendEmail = async () => {
    setLoadingEmail(true);
    setMessage("");

    try {
      const { data } = await axios.post("/kirim-email/", {
        id_bpjs: dataPatient.data_pasien.ID_BPJS,
      });
      setMessage(data.message || "Email berhasil dikirim");
      console.log("BERHASILLLL");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Terjadi kesalahan saat mengirim email"
      );
    } finally {
      setLoadingEmail(false);
    }
  };

  if (isLoading)
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
    const [inputValue, setInputValue] = useState("");
    return (
      <div className="mb-[10px]">
        <AsyncPaginate
          value={selected}
          loadOptions={getICD}
          onChange={setSelected}
          additional={{ page: 1 }}
          inputValue={inputValue}
          onInputChange={(newValue) => setInputValue(newValue)}
          debounceTimeout={300} // biar gak tiap ketik langsung fetch
          placeholder="Cari diagnosa disini ..."
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
      const newHistory = {
        data_dokter_id: dataDoctor.id,
        diagnosa_primary_id: selectedPrimary.data.id,
        diagnosa_secondary_id: selectedSecondary?.data.id,
        tanggal_konsultasi: dataPatient.tanggal_konsultasi,
        keluhan: dataPatient.keluhan,
        diagnosa_sub: diagnosaSub,
      };
      const createdHistory = await createHistory.mutateAsync(newHistory);

      const existingIds = dataPatient?.data_pasien?.rekap_medis?.map(
        (h) => h.id || []
      );

      const updatedHistoryIds = [...(existingIds || []), createdHistory.id];

      await updateUser.mutateAsync({
        id: dataPatient.data_pasien.ID_BPJS,
        data: { rekap_medis_ids: updatedHistoryIds, nomor_urut: null },
      });

      await deleteRegis.mutateAsync(dataPatient.data_pasien.ID_BPJS);

      sendEmail();
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
        className="bg-light-primary px-[55px] pt-[30px] h-[95dvh] font-inria-sans"
        id="shared-modal"
      >
        <div className="font-inria-sans bg-white mx-[200px] my-[20px] px-[100px] py-[40px] rounded-[40px]">
          <div className="flex gap-[10px] mb-[15px]">
            <h1 className="text-[30px] font-semibold font-inter-sans">
              Kirim Diagnosa Untuk Pasien {dataPatient?.data_pasien?.nama} , No
              BPJS
            </h1>
            <h1 className="text-[30px] font-semibold text-orange-primary font-inter-sans">
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
      <Footer isFull />
    </div>
  );
};

export default PortalDoctorSlug;
