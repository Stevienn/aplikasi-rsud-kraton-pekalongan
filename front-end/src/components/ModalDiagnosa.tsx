import InputField from "./form/InputField";
import Modal from "./Modal";
import Button from "./form/Button";
import { memo, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
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
import { useCreateHistory } from "@/hooks/api/useHistory";
import { useUpdateUser } from "@/hooks/api/useUser";

interface IModalDiagnosa {
  dataPatient: any;
  keluhan: string;
  diagnosaSub: string;
  setDiagnosaSub: (value: string) => void;
  closeModal: () => void;
  date: string;
  specialization: string;
  dataDoctor: any;
  refetchDoctor: any;
}

const ModalDiagnosa = ({
  dataPatient,
  keluhan,
  diagnosaSub,
  setDiagnosaSub,
  closeModal,
  date,
  specialization,
  dataDoctor,
  refetchDoctor,
}: IModalDiagnosa) => {
  const [selectedPrimary, setSelectedPrimary] = useState();
  const [selectedSecondary, setSelectedSecondary] = useState();

  const { data: ICD } = useGetICD();
  const { data: rekapData, refetch: refetchRekapMedis } = useGetRekapMedis();

  const deleteRegis = useDeleteRegistrationById();

  const createRekap = useCreateRekapMedis();
  const createHistory = useCreateHistory();
  const updateRekapMedis = useUpdateRekapMedis();
  const updateUser = useUpdateUser();

  const ICDComponent = ({ selected, setSelected }) => {
    return (
      <div className="mb-[10px]">
        <Autocomplete
          fullWidth
          options={ICD}
          value={selected}
          getOptionLabel={(option) => `${option.kode} ${option.nama_diagnosa}`}
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
        tanggal_konsultasi: date,
        keluhan: keluhan,
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

      refetchDoctor();
      closeModal();
    } catch (error) {
      console.error(error);

      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <Modal width="w-[1000px]" customClass="rounded-[40px]">
      <Modal.Header
        title="Kirim Diagnosa"
        customClass="rounded-t-[40px]"
      ></Modal.Header>
      <Modal.Body customClass="mx-[50px]">
        <>
          <InputField
            name="Nama (Sesuai KTP)"
            type="text"
            customClass="mb-[10px]"
            inputWidth="w-full"
            value={dataPatient?.nama}
            isDisabled
          />
          <InputField
            name="Jenis Kelamin"
            type="string"
            customClass="mb-[10px]"
            inputWidth="w-full"
            value={dataPatient?.jenis_kelamin}
            isDisabled
          />
          <p className="text-gray-600 font-semibold mb-[8px]">Keluhan</p>
          <textarea
            name="Keluhan"
            className="border-[2px] border-gray-300 px-[10px] py-[5px] rounded-[5px] mb-[10px] w-full "
            value={keluhan}
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
        </>
      </Modal.Body>
      <Modal.Footer>
        <Button placeholder="Kembali" onClick={closeModal} isCancel />
        <Button placeholder="Kirim" onClick={handleSubmit} />
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ModalDiagnosa);
