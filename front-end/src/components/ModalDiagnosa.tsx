import InputField from "./form/InputField";
import Modal from "./Modal";
import Button from "./form/Button";
import { memo, useState } from "react";
import {
  Autocomplete,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useGetICD } from "@/hooks/api/useICD";
import { useGetRegistrationById } from "@/hooks/api/useRegistration";

interface IModalDiagnosa {
  dataPatient: any;
  keluhan: string;
  diagnosaSub: string;
  setDiagnosaSub: (value: string) => void;
  closeModal: () => void;
}

const ModalDiagnosa = ({
  dataPatient,
  keluhan,
  diagnosaSub,
  setDiagnosaSub,
  closeModal,
}: IModalDiagnosa) => {
  const [selectedPrimary, setSelectedPrimary] = useState();
  const [selectedSecondary, setSelectedSecondary] = useState();

  const { data: ICD } = useGetICD();
  const { data: regisData } = useGetRegistrationById(dataPatient.ID_BPJS);

  const ICDComponent = ({ selected, setSelected }) => {
    return (
      <div className="mb-[10px]">
        <Autocomplete
          fullWidth
          options={ICD}
          getOptionLabel={(option) => `${option.kode} ${option.nama_diagnosa}`}
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
  return (
    <Modal width="w-[1000px]" customClass="rounded-[40px] px-[80px]">
      <Modal.Body>
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
        <Button placeholder="Kirim" onClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

export default memo(ModalDiagnosa);
