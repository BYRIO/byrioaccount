require('dotenv').config()
const passport = require('passport')
const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const path = require('path')
const ooth = require('./ooth')
const bodyParser = require('body-parser')
// Create express instnace
const app = express()

app.use(morgan('dev'))
app.use(bodyParser())
app.use(passport.initialize())
app.use(passport.session())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(session({
  name: 'api-session-id',
  secret: process.env.SESSION_SECERT,
  resave: false,
  saveUninitialized: true,
}))

// Require API routes
const users = require('./routes/users')
const consent = require('./routes/consent')
const login_accept = require('./routes/login_accept')
// Import API Routes
app.use(users)
app.use(consent)
app.use(login_accept)
ooth(app).then(() => console.log('ooth startup.'), console.error)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}