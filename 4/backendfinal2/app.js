const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const pictureRoutes = require('./routes/pictureRoutes');
const errorHandler = require('./utils/errorHandler');

app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/pictures', pictureRoutes);


app.use(errorHandler);

module.exports = app;