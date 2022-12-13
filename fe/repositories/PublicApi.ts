import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.response.use(res => {
  return res.data;
},
async e => {
  throw e;
});

export default api;
