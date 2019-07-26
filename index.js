
//////////////////////////////////////////////////
const express  = require('express')
const path = require('path')
const fs = require('fs')
//////////////////////////////////////////////////

const app = express()
const port = 3000

//////////////////////////////////////////////////
//


const dir = path.join(__dirname, 'dist');

app.use('/',express.static(dir));

const pdf_file = path.join(dir, '/index.pdf')
app.use('/pdf',express.static(dir));

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



