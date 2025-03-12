import axios from 'axios'


const instance = axios.create({
    baseURL:'https://take-home-test-api.nutech-integrasi.com'
})

export default instance