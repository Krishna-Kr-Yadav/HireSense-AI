const express = require('express');
const authRouter = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')

const app = express();
app.use(express.json());
app.use(cookieParser());

/* Require all the auth routes here*/
app.use('/api/auth',authRouter);

module.exports = app;