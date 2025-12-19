const options = {
  name: "RestApi",
  developer: "@RestApi",
  port: 3000,
  webName: "Emceh Playground",
  description: "Rest API",
  favicon:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Black.png/220px-Black.png",
};

const host = {
  BASE_URL: "https://api.fmcstore.web.id", // Ganti dengan URL yang sesuai
  BACKUP_URL: "https://api-fmcv2.vercel.app", // Contoh: https://domain.com
};

module.exports = {
  options,
  host,
};
