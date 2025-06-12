// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\lib\axios.js

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL, // Your backend API base URL
  withCredentials: true, // This is crucial for sending/receiving cookies (JWTs)
});

export default api;