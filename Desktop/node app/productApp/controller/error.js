
exports.error404 = (req, res, next) => {
    res.render('404', {
        pageTitle: 'error 404',
        path: ''
    })
}