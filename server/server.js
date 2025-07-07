import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { prismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const path = require('path')

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))

/* 404 handler */
// This middleware handles 404 errors for any unmatched routes
app.use((req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))