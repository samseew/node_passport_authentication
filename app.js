const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')

const app = express() // initialize express

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

// routes 
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000; //port

app.listen(PORT, console.log(`Server started on port ${PORT}`)) //listens for port


/////////21:28 Node.js With Passport Authentication | Full Project