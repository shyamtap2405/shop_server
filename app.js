const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

// const shopRoutes = require('./routes/shop');
const port = 8080;
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');


const app = express();
app.use(cors());
app.use(helmet());

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST ,PUT ,PATCH ,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/shop', shopRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.use((error, req, res, next) => {

    const status = error.statuscode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(
        `mongodb+srv://shyam:hU2vBfpOwu5Aesxb@clusters.jvjc3.mongodb.net/shop?retryWrites=true`, { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(res => {
        app.listen(process.env.PORT || 8080);
        console.log('success');
    })
    .catch(err => console.log(err));