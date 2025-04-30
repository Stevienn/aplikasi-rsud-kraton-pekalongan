const tempRegistration = [];

export const addToTempRegistration = (data) => {
  tempRegistration.push(data);
};

export const getTempRegistration = () => {
  return tempRegistration;
};

export const clearTempRegistration = () => {
  tempRegistration.length = 0;
};
