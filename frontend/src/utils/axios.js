import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:7000/api/v1',  // point to your backend
  withCredentials: true,                    // send cookies
});``

export default api;
