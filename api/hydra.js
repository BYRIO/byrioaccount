const axios = require('axios')
const BASE = process.env.HYDRA_URL

const response2data = ({
    data
}) => data

module.exports = {
    acceptLoginRequest(challenge, payload) {
        return axios.put(`${BASE}/oauth2/auth/requests/login/${challenge}/accept`, payload).then(response2data)
    },
    getConsentRequest(challenge) {
        return axios.get(`${BASE}/oauth2/auth/requests/consent/${challenge}`).then(response2data)
    },
    acceptConsentRequest(challenge, payload) {
        return axios.put(`${BASE}/oauth2/auth/requests/consent/${challenge}/accept`, payload).then(response2data)
    },
    rejectConsentRequest(challenge, payload) {
        return axios.put(`${BASE}/oauth2/auth/requests/consent/${challenge}/reject`, payload).then(response2data)
    }
}