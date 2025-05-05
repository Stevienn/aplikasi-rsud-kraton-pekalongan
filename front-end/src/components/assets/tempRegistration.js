let tempRegistration = ""; // variabel biasa

export const addToTempRegistration = (data) => {
  tempRegistration = data;
};

export const getTempRegistration = () => {
  return tempRegistration;
};

export const clearTempRegistration = () => {
  tempRegistration = "";
};
