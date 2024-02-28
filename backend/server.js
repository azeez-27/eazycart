const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose')
const cors = require('cors')

const cartRoute = require('./routes/cartRouter')

mongoose.connect(process.env.DB)
const db = mongoose.connection;


db.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});


const app = express()

app.use(express.json());
app.use(cors())
app.use('/api', cartRoute)

app.listen(process.env.PORT, ()=>{
    console.log('Server is listening to port 3000');
})