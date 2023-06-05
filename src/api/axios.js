import axios from 'axios';

// Different endpoints if local or production
const prod = {
    url: {
        BACKEND_URL: 'www.partytime.com/apigateway/api'
    }
}
const dev = {
    url: {
        BACKEND_URL: 'http://localhost:8001/api'
    }
};

const config = process.env.NODE_ENV === 'development' ? dev : prod;

const BASE_URL = config.BACKEND_URL;

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});