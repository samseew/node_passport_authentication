module.exports = {
    ensureAuthenticated: function (req, res, next) { // passport is giving u all this stuff
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please Log in to view this resource')
        res.redirect('/users/login')
    }
}