const Hydra = require('ory-hydra-sdk')

Hydra.ApiClient.instance.basePath = process.env.HYDRA_URL

module.exports =  new Hydra.OAuth2Api()