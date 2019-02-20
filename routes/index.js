const express = require('express')
const router = express.Router() // makes a router
const {
    ensureAuthenticated
} = require('../config/auth')

// welcome page 
router.get('/', (req, res) => res.render('welcome')) // creates a get route to '/'

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        name: req.user.name
    }))


module.exports = router // exports router