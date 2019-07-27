const rdb = require('rethinkdb')
const _config = {
    host: 'resume_db_1',
    port: 28015,
}

const connection = rdb.connect(_config)
    .then((connection) => {
        console.log('Connected!') 
        console.log(connection)
    })

module.exports.connection = connection
