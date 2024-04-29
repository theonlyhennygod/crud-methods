const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/quotes', (err, client) => {
    if (err) return console.log(err)
    db = client.db('quotes')

    app.listen(3004, function () {
        console.log('listening on 3004')
    })
})


// const mongoose = require('mongoose')
// const url = 'mongodb://localhost:27017/quotes'

// mongoose.connect(url, { useNewUrlParser: true })


app.listen(3004, function () {
    console.log('listening on 3004')
})

// body parser

app.use(bodyParser.urlencoded({ extended: true }))

// Handlers
// GET

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/another', (req, res) => {
    res.send('another message')
})

app.get('/', (req, res) => {
    res.send('hello world')
})

// POST 

// app.post('/quotes', (req, res) => {
//     console.log('Hellooooooooooooooooo!')
// })

app.post('/quotes', (req, res) => {
    console.log(req.body)
})

//