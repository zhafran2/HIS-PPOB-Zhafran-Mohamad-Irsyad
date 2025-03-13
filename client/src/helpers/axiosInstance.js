import axios from 'axios'


const instance = axios.create({
    baseURL: 'https://take-home-test-api.nutech-integrasi.com',
    headers: {
        "Content-Type": "application/json",
    }
})

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token"); // Hapus token jika expired
            window.location.href = "/login"; // Redirect ke halaman login
        }
        return Promise.reject(error);
    }
);

export default instance