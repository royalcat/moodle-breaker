import { config } from "./config";

export const fetchAnswer = async (requestBody, address) => {
  const response = await fetch(address, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  return await response.json();
};
