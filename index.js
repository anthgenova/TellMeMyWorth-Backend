const mongoose = require('mongoose');
const express = require('express')
const app = express()
// const mongoDbConnect = require('./mongoDbConnect.js')
const wallets = require('./src/routes/wallets')
const projects = require('./src/routes/projects')
const cors = require('cors')

mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
    .then(() => console.log('Connecting to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(cors())
app.use('/api/wallets', wallets)
app.use('/api/projects', projects)
app.use('/api', (req,res) => {
    res.send('Almost there... Try tellmemyworth.com/api/wallets/:addr or tellmemyworth.com/api/projects/:addr')
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))