export const addToTempRegistration = (data) => {
  localStorage.setItem("tempRegistration", JSON.stringify(data));
};

export const getTempRegistration = () => {
  const savedData = localStorage.getItem("tempRegistration");
  return savedData ? JSON.parse(savedData) : "";
};

export const clearTempRegistration = () => {
  localStorage.removeItem("tempRegistration");
};
