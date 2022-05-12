import * as jwt from "jsonwebtoken";
import config from 'config';
import { User } from "@prisma/client";


export function checkAuth (req, res, next){
  try {
    const {secretToken,refreshToken,refreshLifetime} = config.get('App.client');
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, secretToken);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).send('Invalid user');
    } else {
      next();
    }
  } catch(err) {
    res.status(401).send(err.meta.cause);
  }
};

export function refreshToken(user=User){
    return jwt.sign({ userId: user.id },  refreshToken,{ expiresIn:refreshLifetime})
}