const express = require('express')
const router = express.Router()

const {
  createAccount,
  getAccountById,
  deleteAccount,
  createDestination,
  getDestinationsByAccountId,
  deleteDestination
} = require('./models')

// Account CRUD operations
router.post('/accounts', (req, res) => {
  createAccount(req.body, (err, account) => {
    if (err) return res.status(400).json({ error: err.message })
    res.status(201).json(account)
  })
})

router.get('/accounts/:id', (req, res) => {
  getAccountById(req.params.id, (err, account) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!account) return res.status(404).json({ error: 'Account not found' })
    res.json(account)
  })
})

router.delete('/accounts/:id', (req, res) => {
  deleteAccount(req.params.id, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    res.status(204).end()
  })
})

// Destination CRUD operations
router.post('/accounts/:accountId/destinations', (req, res) => {
  const destination = { ...req.body, account_id: req.params.accountId }
  createDestination(destination, (err, destination) => {
    if (err) return res.status(400).json({ error: err.message })
    res.status(201).json(destination)
  })
})

router.get('/accounts/:accountId/destinations', (req, res) => {
  getDestinationsByAccountId(req.params.accountId, (err, destinations) => {
    if (err) return res.status(400).json({ error: err.message })
    res.json(destinations)
  })
})

router.delete('/destinations/:id', (req, res) => {
  deleteDestination(req.params.id, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    res.status(204).end()
  })
})

module.exports = router
