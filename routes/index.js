const express = require('express')
const router = express.Router() // makes a router

router.get('/', (req, res) => res.render('welcome')) // creates a get route to '/'

module.exports = router // exports router