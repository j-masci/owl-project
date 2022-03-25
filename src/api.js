import { create } from 'apisauce';
import config from './config';

const api = create({
    baseURL: config.api,
    headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
    },
    timeout: 10000,
});

export default api;