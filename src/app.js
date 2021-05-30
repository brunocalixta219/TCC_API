const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routers');
const mongoose = require('mongoose');

mongoose.connect(
    'mongodb+srv://tcc:lGwai71c1nYOChJA@neuronuvem.4pp5a.mongodb.net/HWatch?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

const { connection } = mongoose;
connection.on('error', console.error.bind(console, 'Connection Error'));
connection.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});

app.use('/', router);

const port = process.env.PORT || '5050';

app.listen(port, function () {
    console.log(`App listening on port ${port}`);
});
