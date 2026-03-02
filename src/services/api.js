import axios from 'axios';

const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
  baseURL: 'https://todolist-r7cz.onrender.com/api',
});

export default api;