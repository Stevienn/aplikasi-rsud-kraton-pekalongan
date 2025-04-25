interface IDiagnosa {
  id: number;
  bpjsId: number;
  diagnosaDate: string | null;
  keluhan: string;
  doctorName: string | null;
  subjectiveDiagnosa: string | null;
  primaryDiagnose: string | null;
  secondaryDiagnose: string | null;
}

export default IDiagnosa;
