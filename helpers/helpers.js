export const Response = (messageType, message, data, other = null) => {
  return {
    message: {
      [messageType]: message,
    },
    data: data,
    other,
  };
};

// Function to return Error Response
export const ErrorResponse = (message) => {
  return Response("error", message, null);
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
