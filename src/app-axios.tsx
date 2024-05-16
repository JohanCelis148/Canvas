import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "https://664674c351e227f23aaefacd.mockapi.io/api/",
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;