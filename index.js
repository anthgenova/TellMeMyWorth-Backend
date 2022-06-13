const mongoose = require('mongoose');
const express = require('express')
const app = express()
// const mongoDbConnect = require('./mongoDbConnect.js')
const wallets = require('./src/routes/wallets')
const projects = require('./src/routes/projects')
const cors = require('cors')

mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    .then(() => console.log('Connecting to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(cors())
app.use('/api/wallets', wallets)
app.use('/api/projects', projects)
app.use('/api', (req,res) => {
    res.send('Sup fam! It appears that there is nothing to show you here =]( :{| )')
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))