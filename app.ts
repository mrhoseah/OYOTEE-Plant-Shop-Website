import {  PrismaClient } from '@prisma/client'
import express from 'express'
import config from 'config';
import cors from 'cors';
import userRouter from './routes/auth.routes';
import categoriesRouter from './routes/categories.routes';
import productsRouter from './routes/products.routes';
import usersRouter from './routes/users.routes';

const {port,host,origin} = config.get('App.appConfig');

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors({origin}))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Oyotee shop." });
});

app.use('/auth',userRouter);

// app.use(function(req, res, next) {
//   res.status(401).send('Please login to get access');
// });

app.use('/categories',categoriesRouter)
app.use('/products',productsRouter)
app.use('/users',usersRouter)


const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: ${host}:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)