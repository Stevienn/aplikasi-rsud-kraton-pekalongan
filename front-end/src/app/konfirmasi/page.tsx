"use client";

import dummyDiagnosa from "@/components/assets/dummyDiagnosa";
import IDiagnosa from "@/interface/diagnosaInterface";
import React, { useState } from "react";

const Konfirmasi = () => {
  const [diagnosa, setDiagnosa] = useState<IDiagnosa[]>(dummyDiagnosa);
  console.log(diagnosa);
  return (
    <div>
      <p>konfismaris</p>
    </div>
  );
};

export default Konfirmasi;
