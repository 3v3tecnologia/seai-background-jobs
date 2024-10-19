const EQUIPMENTS_API_BASE_URL = process.env.EQUIPMENTS_API_ADDR
  ? process.env.EQUIPMENTS_API_ADDR
  : "http://localhost:8080/api/v2/equipments";


const FUNCEME_FTP_CREDENTIALS = {
  HOST: process.env.FUNCEME_FTP_HOST,
  USER: process.env.FUNCEME_FTP_USER,
  PASSWORD: process.env.FUNCEME_FTP_PASSWORD
}

export { EQUIPMENTS_API_BASE_URL, FUNCEME_FTP_CREDENTIALS };
