import axios from "axios";

const ApiUrl = axios.create({
    baseURL: 'http://168.168.10.12:2805/retielAPI'
})

export default ApiUrl
