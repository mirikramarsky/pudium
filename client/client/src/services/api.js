import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pudium-production.up.railway.app/api/podium', // שימי כאן את כתובת השרת שלך
});

export default api;
