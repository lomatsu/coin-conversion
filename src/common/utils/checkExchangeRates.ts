const fetch = require("node-fetch");
const BASE = "EUR";
const SYMBOLS = "BRL, USD, JPY, EUR";

export const checkExchangeRatesAPI = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { apikey: process.env.API_KEY },
  };

  return fetch(
    `${process.env.URL_API}?symbols=${SYMBOLS}&base=${BASE}`,
    requestOptions
  )
    .then((response: { text: () => any }) => response.text())
    .then((result: any) => {
      return JSON.parse(result);
    })
    .catch((error: any) => console.log("error", error));
};
