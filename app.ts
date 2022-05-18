import express from 'express'
import config from 'config';
import helmet from  'helmet'
import cors from 'cors';
import bodyParser from 'body-parser';
import userRouter from './routes/auth.routes';
import categoriesRouter from './routes/categories.routes';
import productsRouter from './routes/products.routes';
import usersRouter from './routes/users.routes';
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';
import couponRouter from './routes/coupons.routes';
import reviewsRouter from './routes/reviewss.routes';

const window = {
  localStorage: getLocalStorageMock(),
};
const {port,baseurl,origin} = config.get('App.appConfig');

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(helmet());
app.use(express.json())
app.use(cors({origin:origin}))
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
app.use('/reviews',reviewsRouter)
app.use('/users',usersRouter)


const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: ${baseurl}:${port}
⭐️ Made with ❤️ with Prisma: http://prisma.io`),
)