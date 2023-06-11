import axios from 'axios';

// Different endpoints if local or production
const prod = {
    BACKEND_URL: window.location.hostname + 'api/'
}
const dev = {
    BACKEND_URL: 'http://localhost:8001/'
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

const BASE_URL = config.BACKEND_URL;
console.log(BASE_URL);

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});