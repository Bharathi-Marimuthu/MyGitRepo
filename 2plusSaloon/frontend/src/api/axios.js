import axios from 'axios';
import toast from 'react-hot-toast';
const api = axios.create({ baseURL: '/api/v1', timeout: 15000 });
api.interceptors.response.use(res => res, err => {
  if (err.response?.status >= 500) toast.error('Server error. Please try again.');
  return Promise.reject(err);
});
export default api;
