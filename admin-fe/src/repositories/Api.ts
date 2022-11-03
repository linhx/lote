import axios from 'axios';
import { API_URL } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

api.interceptors.response.use(res => {
  return res.data;
},
async e => {
  throw e;
});

export default api;
