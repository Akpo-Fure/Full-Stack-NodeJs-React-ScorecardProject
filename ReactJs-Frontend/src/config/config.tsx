const config = {
  production: {
    apiURL: "",
    clientURL: "",
  },
  development: {
    apiURL: "http://localhost:3000",
    clientURL: "http://localhost:5173",
  },
};
console.log(import.meta.env);
const isProduction = import.meta.env.PROD;

export const apiUrl = isProduction
  ? config.production.apiURL
  : config.development.apiURL;

export const clientUrl = isProduction
  ? config.production.clientURL
  : config.development.clientURL;
