const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express() // initialize express

// Passport config
require('./config/passport')(passport)

// DB Config 
const db = require('./config/keys').MongoURI // key 

//Connect to Mongo
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log('Mongo DB Connected'))
    .catch(err => console.log(err))

//ejs 
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Body Parser 
app.use(express.urlencoded({
    extended: false
}))

// Express Session -   login session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// passport middleware - initialziing the Local Strategy session 
app.use(passport.initialize());
app.use(passport.session());

// connect flash 
app.use(flash())

//global variables
//using flash to create flash messages globally 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000; //port

app.listen(PORT, console.log(`Server started on port ${PORT}`)) //listens for port


/////////21:28 Node.js With Passport Authentication | Full Project