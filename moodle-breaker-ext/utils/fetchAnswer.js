import { config } from "./config";

export const fetchAnswer = async (requestBody, address) => {
  try {
    const HTTPmethod = "POST";

    const response = await fetch(address, {
      method: HTTPmethod,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data;
  } catch (e) {}
};
