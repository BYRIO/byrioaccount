const {
    Router
} = require('express')
const csrf = require('csrf')
const hydra = require('../hydra')

const router = Router()
const csrfProtect = csrf({
    cookie: true
})

router.get('/auth/consent',function (req, res, next) {
    if (!req.session.passport || !req.session.passport.user) {
        res.redirect('/login?redirect_to=' + req.originalUrl);
        next();
    } else {
        const userId = req.session.passport.user;
        const {
            consent_challenge
        } = req.query;
        hydra.getConsentRequest(consent_challenge)
            .then(({
                skip,
                requested_scope,
                subject,
                client
            }) => {
                console.log(requested_scope, subject, client);
                if (skip) {
                    //  client has requested the same scopes from the same user previously.
                    return hydra.acceptConsentRequest(consent_challenge, {
                        grant_scope: requested_scope,
                        session: {
                            access_token: {
                                id: userId
                            },
                            id_token: {
                                id: userId
                            }
                        }
                    }).then(({
                        redirect_to
                    }) => res.redirect(redirect_to))
                } else {
                    res.render('consent', {
                        csrfToken:"__!__",
                        challenge: consent_challenge,
                        // We have a bunch of data available from the response, check out the API docs to find what these values mean
                        // and what additional data you have available.
                        requested_scope,
                        subject,
                        client
                    })
                }

            })
    }

})

router.post('/auth/consent',  function (req, res, next) {
    if (!req.session.passport || !req.session.passport.user) {
        res.status(401).end();
    } else {
        const userId = req.session.passport.user;
        const {
            challenge
        } = req.body;

        if (req.body.submit === 'Deny access') {
            return hydra.rejectConsentRequest(challenge, {
                    error: 'access_denied',
                    error_description: 'The resource owner denied the request'
                })
                .then(({
                    redirect_to
                }) => {
                    res.redirect(redirect_to);
                })
                .catch(function (error) {
                    next(error);
                });
        }

        let {
            grant_scope,
            remember
        } = req.body
        if (!Array.isArray(grant_scope)) {
            grant_scope = [grant_scope]
        }

        hydra.acceptConsentRequest(challenge, {
                grant_scope: grant_scope,
                session: {
                    access_token: {
                        id: userId
                    },
                    id_token: {
                        id:userId
                    }
                },

                remember: Boolean(remember),


                remember_for: 3600,
            })
            .then(({
                redirect_to
            }) => {

                res.redirect(redirect_to);
            })

            .catch(function (error) {
                next(error);
            });
    }

});
module.exports = router