import ax from 'axios';

const axios = new ax.create({
    baseURL:'http://localhost:8080/'
});

export default axios;