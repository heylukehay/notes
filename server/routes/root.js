const express = require('express')
const router = express.Router()
const path = require('path')

/* GET home page */
// This route serves the index.html file when the root URL is accessed
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router