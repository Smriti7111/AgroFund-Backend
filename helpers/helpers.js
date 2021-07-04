export const Response = (messageType, message, data) => {
  return {
    message: {
      [messageType]: message,
    },
    data: data,
  };
};

// Function to check if given item has certain value. This fucntion can be used to check empty value or null value
export const Check = (itemList, value) => {
  itemList.forEach((element) => {
    if (element === value) {
      return true;
    }
  });

  return false;
};
