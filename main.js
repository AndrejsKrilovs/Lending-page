const {google} = require('googleapis')
const keys = require('./keys.json')

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

client.authorize((err, tokens) => {
    if(err) {
        console.log(err)
    } else {
        run(client).then(console.log(''))
    }
})

async function run(cl) {
    const spreadsheetApi = google.sheets({version: 'v4', auth: cl})

    const request = {
        spreadsheetId: keys.spreadsheet_id,
        range: 'Data!B3',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                ['1','2','3','4']
            ]
        }
    }

    await spreadsheetApi.spreadsheets.values.append(request)

    const opt = {
        spreadsheetId: keys.spreadsheet_id,
        range: 'Data!B2:E100'
    }

    let data = await spreadsheetApi.spreadsheets.values.get(opt)
    let dataArray = data.data.values
    console.log(dataArray)
}
