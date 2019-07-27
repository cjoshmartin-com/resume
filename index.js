'use strict'

//////////////////////////////////////////////////
const express  = require('express')
//const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
//////////////////////////////////////////////////

const app = express()
const connection = require('./database.js')
const port = 8080
//////////////////////////////////////////////////
// Middleware

//app.use(cors());
app.use(bodyParser.json({type: 'application/json'}));
app.disable('etag');

//////////////////////////////////////////////////

const dir = path.join(__dirname, 'dist');

app.use('/',express.static(dir));

app.use('/pdf', (req, res) =>{
    const pdf_file = path.join(dir, '/index.pdf')
    res.sendFile(pdf_file)
});

app.get('/hello', (req, res) => {
    res.send("Hello 👋")
}
)

app.get('/education', (req, res) => {
    res.send("Hello 👋")
}
)

app.get('/experience', (req, res) => { // return all experience (sorted by date)
    res.send("Hello 👋")

    /*
     * {
     *  {
     *      start_date: Auguest 2018,
     *      end_date: Auguest 2019,
     *      title: A Job,
     *      discription: fegjjkd kdl jflkalkaj lkajdlkjalkfakljdfl,
     *      tags: set(['embedded', 'python'])
     *  }
     * }
    */
}
)

app.get('/experience/:tag', (req, res) => { // embedded, web, python, javascript, react
    res.send("Hello 👋")
}
)

app.listen(port, () => console.log(`listening on port ${port}...`) )

