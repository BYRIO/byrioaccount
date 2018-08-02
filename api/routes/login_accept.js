const {
    Router
} = require('express')
const csrf = require('csrf')
const hydra = require('../hydra')

const router = Router()


router.get('/login_accept', function (req, res, next) {
    console.log(req.user)
    if (!req.user) {
        res.status(401).end();
    } else {
        const {
            login_challenge
        } = req.query;
        hydra.acceptLoginRequest(challenge, {
                // Subject is an alias for user ID. A subject can be a random string, a UUID, an email address, ....
                subject: req.user.id,

                // This tells hydra to remember the browser and automatically authenticate the user in future requests. This will
                // set the "skip" parameter in the other route to true on subsequent requests!
                remember: Boolean(req.body.remember),

                // When the session expires, in seconds. Set this to 0 so it will never expire.
                remember_for: 3600,

                // Sets which "level" (e.g. 2-factor authentication) of authentication the user has. The value is really arbitrary
                // and optional. In the context of OpenID Connect, a value of 0 indicates the lowest authorization level.
                // acr: '0',
            })
            .then(function (response) {
                // All we need to do now is to redirect the user back to hydra!
                res.redirect(response.redirect_to);
            })
            // This will handle any error that happens when making HTTP calls to hydra
            .catch(function (error) {
                next(error);
            });

    }
})

module.exports = router