import express from 'express'
import helmet from  'helmet'
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/auth.routes';
import categoriesRouter from './routes/categories.routes';
import productsRouter from './routes/products.routes';
import usersRouter from './routes/users.routes';
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import couponRouter from './routes/coupons.routes';
import dotenv from 'dotenv';

dotenv.config();

const window = {
  localStorage: getLocalStorageMock(),
};

const app = express()
const corsOptions = {
  credentials: true,
  origin:process.env.WHITELISTORIGIN,
}
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'))
app.use(helmet());
app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send({ message: "Welcome to Oyotee shop." });
});

app.use('/auth',userRouter);

app.use(function(req, res,next ) {
  if(JSON.parse(window.localStorage.getItem('accessToken'))){
    return res.status(401).json({"message":"Please login to get access"});
  } 
  return next();
});

app.use('/categories',categoriesRouter)
app.use('/coupons',couponRouter)
app.use('/products',productsRouter)
app.use('/users',usersRouter)


const server = app.listen(process.env.APP_PORT, () =>
  console.log(`
🚀 Server ready at: ${process.env.APP_BASEURL}:${process.env.APP_PORT}
⭐️ Made with ❤️ with Prisma: http://prisma.io`),
)