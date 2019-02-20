const express = require('express')
const router = express.Router() // makes a router
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Model
const User = require('../models/User')

//login page
router.get('/login', (req, res) => res.render('login'))
//Register Page
router.get('/register', (req, res) => res.render('register'))

//Register Handle
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body
    let errors = []

    // check required fields 
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'Please fill in all fields'
        })
    }
    //check passwords match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        })
    }

    //check password length
    if (password.length < 6) {
        errors.push({
            msg: 'Password should be at least 6 characters'
        })
    }

    // if we have errors, rerender page and show the messages, otherwise, pass to the next step 
    if (errors.length > 0) {
        // rerenders and passes objects to the register view
        res.render('register', {
            //keeps these values in their fields when it rerenders
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        //validation passes

        //finds one match - returns promise
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    // user exists, rerender page with error 
                    errors.push({
                        msg: 'Email is already registered'
                    })
                    res.render('register', {
                        //keeps these values in their fields when it rerenders
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    //create new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    })
                    //keep in mind, the above is short hand for this:
                    // const newUser = new User({
                    //     name: name,
                    //     email: email,
                    //     password: password
                    // })
                    // , same thing for all the above 

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            // set password to hash
                            newUser.password = hash
                            // save to database, returns a promise 
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in ')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        }))


                }
            })
    }
})


// Login Handle - using passport 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})


//Log out handle 
router.get('/logout', (req, res) => {
    req.logout() //passport function
    req.flash('success_msg', ' You are logged out')
    res.redirect('/users/login')
})

module.exports = router // exports router