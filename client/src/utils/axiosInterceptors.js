import axios from "axios";

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalConfig = error.config;
    const responseStatus = error.response.status;

    if (responseStatus === 401) {
      window.location.reload();
      return Promise.reject(error);
    }
    // if (responseStatus === 404) {
    //   window.location.href = "/order";
    //   return Promise.reject(error);
    // }
    try {
      if (responseStatus === 403 && !originalConfig._retry) {
        originalConfig._retry = true;
        const result = await fetch("/api/token/refresh/access");
        await result.json();

        return axios(originalConfig);
      }
    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.reject(error);
  },
);

export default axios;
