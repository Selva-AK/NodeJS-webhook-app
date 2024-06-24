const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(':memory:')

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      secret_token TEXT NOT NULL,
      website TEXT
    )
  `)
  
  db.run(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      method TEXT NOT NULL,
      headers TEXT NOT NULL,
      FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    )
  `)
})

const createAccount = (account, callback) => {
  const { email, name, website } = account
  const secret_token = require('crypto').randomBytes(16).toString('hex')
  db.run(
    'INSERT INTO accounts (email, name, secret_token, website) VALUES (?, ?, ?, ?)',
    [email, name, secret_token, website],
    function (err) {
      if (err) return callback(err)
      callback(null, { id: this.lastID, email, name, secret_token, website })
    }
  )
}

const getAccountById = (id, callback) => {
  db.get('SELECT * FROM accounts WHERE id = ?', [id], callback)
}

const getAccountByToken = (token, callback) => {
  db.get('SELECT * FROM accounts WHERE secret_token = ?', [token], callback)
}

const deleteAccount = (id, callback) => {
  db.run('DELETE FROM accounts WHERE id = ?', [id], callback)
}

const createDestination = (destination, callback) => {
  const { account_id, url, method, headers } = destination
  db.run(
    'INSERT INTO destinations (account_id, url, method, headers) VALUES (?, ?, ?, ?)',
    [account_id, url, method, JSON.stringify(headers)],
    function (err) {
      if (err) return callback(err)
      callback(null, { id: this.lastID, account_id, url, method, headers })
    }
  )
}

const getDestinationsByAccountId = (account_id, callback) => {
  db.all('SELECT * FROM destinations WHERE account_id = ?', [account_id], callback)
}

const deleteDestination = (id, callback) => {
  db.run('DELETE FROM destinations WHERE id = ?', [id], callback)
}

module.exports = {
  createAccount,
  getAccountById,
  getAccountByToken,
  deleteAccount,
  createDestination,
  getDestinationsByAccountId,
  deleteDestination
}
