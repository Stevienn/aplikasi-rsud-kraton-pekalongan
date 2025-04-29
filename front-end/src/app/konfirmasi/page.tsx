"use client";

import dummyDiagnosa from "@/components/assets/dummyDiagnosa";
import IDiagnosa from "@/interface/pendaftaranInterface";
import React, { useState } from "react";

const Konfirmasi = () => {
  const [diagnosa, setDiagnosa] = useState<IDiagnosa[]>(dummyDiagnosa);
  return (
    <div>
      <p>konfismaris</p>
    </div>
  );
};

export default Konfirmasi;
