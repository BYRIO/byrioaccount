require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const session = require('express-session')

const ooth = require('./ooth')
// Create express instnace
const app = express()

app.use(morgan('dev'))

app.use(session({
  name: 'api-session-id',
  secret: process.env.SESSION_SECERT,
  resave: false,
  saveUninitialized: true,
}))

// Require API routes
const users = require('./routes/users')

// Import API Routes
app.use(users)

ooth(app).then(() => console.log('ooth startup.'), console.error)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}