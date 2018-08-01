const Ooth = require('ooth')
const oothLocal = require('ooth-local')
const {
    MongoClient,
    ObjectId
} = require('mongodb')
const OothMongo = require('ooth-mongo')
const emailer = require('ooth-local-emailer')
const mailcomposer = require('mailcomposer')
const Mg = require('mailgun-js')

const MAIL_CONFIG = require('../mail.config')

module.exports = async function start(app) {
    const ooth = new Ooth({
        sharedSecret: process.env.SHARED_SECERT,
        path: "/auth",
    })
    const client = await MongoClient.connect(process.env.MONGOURL)
    const oothMongo = new OothMongo(client.db(process.env.MONGODB), ObjectId)
    await ooth.start(app, oothMongo)

    ooth.use('local', oothLocal(emailer({
        ...MAIL_CONFIG,
        sendMail: function ({
            from,
            to,
            subject,
            body,
            html
        }) {
            return new Promise((resolve, reject) => {
                const mail = mailcomposer({
                    from,
                    to,
                    subject,
                    body,
                    html
                })
                mail.build((e, message) => {
                    if (e) {
                        return reject(e)
                    }
                    Mg({
                        apiKey: process.env.MAILGUN_API,
                        domain: process.env.MAILGUN_DOMAIN
                    }).messages().sendMime({
                        to,
                        message: message.toString('ascii')
                    }, (e, r) => {
                        if (e) {
                            return reject(e)
                        }
                        resolve(e)
                    })
                })
            })
        }
    })));
}