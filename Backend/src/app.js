const express = require('express');
const authRouter = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const interviewRouter = require('./routes/interview.routes')

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"https://hiresense-ai-backend-33rz.onrender.com",
    credentials: true
}))

/* Require all the auth routes here*/
app.use('/api/auth',authRouter);

app.use('/api/interview',interviewRouter)

module.exports = app;