const express = require('express')
const body_parser = require('body-parser')

const app = express()
const data_parser = body_parser.urlencoded({
    extended: false
})

app.use(express.static(__dirname + '/public'))
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.post('/', data_parser, (request, response) => {
    if(!request.body) {
        return response.status(400)
    }
})

app.listen(3000)