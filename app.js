const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const axios = require('axios')
const routes = require('./routes')
const { getAccountByToken, getDestinationsByAccountId } = require('./models')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json())

// Initialize SQLite database
const db = new sqlite3.Database(':memory:')

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      secret_token TEXT NOT NULL,
      website TEXT
    )
  `)
  
  db.run(`
    CREATE TABLE destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      method TEXT NOT NULL,
      headers TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    )
  `)
})

// Routes
app.use('/api', routes)

app.post('/server/incoming_data', (req, res) => {
  const token = req.headers['cl-x-token']
  if (!token) {
    return res.status(401).json({ error: 'Un Authenticate' })
  }

  getAccountByToken(token, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Un Authenticate' })
    }
    getDestinationsByAccountId(account.id, (err, destinations) => {
      if (err || !destinations.length) {
        return res.status(400).json({ error: 'No destinations found' })
      }
      destinations.forEach(destination => {
        const { url, method, headers } = destination
        const options = {
          method,
          url,
          headers: JSON.parse(headers),
          data: method.toUpperCase() === 'GET' ? null : req.body
        }

        if (method.toUpperCase() === 'GET') {
          options.params = req.body
        }

        axios(options).catch(err => console.error(`Error forwarding to ${url}: ${err.message}`))
      })

      res.status(200).json({ message: 'Data forwarded to destinations' })
    })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
