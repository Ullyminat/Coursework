import express from 'express'
import { configDotenv } from 'dotenv'
import db_connect from './config/db_connect.mjs'
import cors from 'cors'
import docxrouter from './routes/docRoutes.mjs'
import userrouter from './routes/userRoutes.mjs'
import cookieParser from 'cookie-parser'

configDotenv();

db_connect(process.env.DB)
const app = express()
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
app.use('/media', express.static('media'))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api', docxrouter);
app.use('/api', userrouter);

app.listen(process.env.PORT,(err)=> err ? console.log(err) : console.log(`http://localhost:${process.env.PORT}`));