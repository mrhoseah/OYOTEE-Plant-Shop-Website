import express from 'express'
import config from 'config';
import helmet from  'helmet'
import cors from 'cors';
import userRouter from './routes/auth.routes';
import categoriesRouter from './routes/categories.routes';
import productsRouter from './routes/products.routes';
import usersRouter from './routes/users.routes';
import { getLocalStorageMock } from '@shinshin86/local-storage-mock';

const window = {
  localStorage: getLocalStorageMock(),
};
const {port,host,origin} = config.get('App.appConfig');

const app = express()
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
app.use('/products',productsRouter)
app.use('/users',usersRouter)


const server = app.listen(port, () =>
  console.log(`
🚀 Server ready at: ${host}:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)