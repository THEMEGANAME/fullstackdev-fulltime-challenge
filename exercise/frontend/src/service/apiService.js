import axios from 'axios'

let API_URL

if (process.env.NODE_ENV === 'production') {
    API_URL = 'https://test-name-eiei.appspot.com'
} else {
    API_URL = 'http://localhost:8080'
}

export const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
})