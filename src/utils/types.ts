export interface CustomRequest extends Request {
    user?: string | JwtPayload;
   }