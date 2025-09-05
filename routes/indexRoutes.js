const express = require('express')

const indexRoutes = express.Router()

indexRoutes.get('/',(req,res) => {
    res.render('start')
})




module.exports = indexRoutes