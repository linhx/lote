import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true
});

api.interceptors.response.use(res => {
  return res.data;
},
async e => {
  throw e;
});

export default api;
