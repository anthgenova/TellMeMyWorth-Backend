const mongoose = require('mongoose');
const express = require('express')
const app = express()
// const mongoDbConnect = require('./mongoDbConnect.js')
const wallets = require('./src/routes/wallets')
const projects = require('./src/routes/projects')
const tokens = require('./src/routes/tokens')
const cors = require('cors')
const { configSetting } = require('./config.js')

const database = configSetting()

mongoose.connect(database)
    .then(() => console.log('Connecting to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(cors())
app.use('/api/wallets', wallets)
app.use('/api/projects', projects)
app.use('/api/tokens', tokens)
app.use('/api', (req,res) => {
    res.send('Almost there... Try tellmemyworth.com/api/wallets/:addr or tellmemyworth.com/api/projects/:addr')
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))