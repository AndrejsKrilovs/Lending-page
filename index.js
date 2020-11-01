const express = require('express')
const body_parser = require('body-parser')

const app = express()
const data_parser = body_parser.urlencoded({
    extended: false
})

const {google} = require('googleapis')
const keys = require('./keys.json')

app.listen(3000)
app.use(express.static(__dirname + '/public')) //redirect to manual css
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')) // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')) // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // redirect CSS bootstrap

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

const writer = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

let person = {
    name: '',
    instagram: '',
    phone: ''
}

app.post('/commit', data_parser, (request, response) => {
    if(!request.body) {
        return response.status(400)
    } else {
        person.name = request.body.name
        person.instagram = request.body.instagram
        person.phone = request.body.phone

        writer.authorize((err, tokens) => {
            if(err) {
                console.log(err)
            } else {
                save(writer, person).then(console.log(''))
                response.redirect('https://aks.customer.smartsender.eu/lp/Z909qPE0')
            }
        })
    }
})

async function save(cl, p) {
    const spreadsheetApi = google.sheets({version: 'v4', auth: cl})

    const request = {
        spreadsheetId: keys.spreadsheet_id,
        range: 'Data!B3',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [p.name, p.instagram, p.phone]
            ]
        }
    }

    await spreadsheetApi.spreadsheets.values.append(request)
}