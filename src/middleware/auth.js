import db from '../models';
import dotenv from 'dotenv';
import redis from 'redis';
import JWTR from 'jwt-redis';
const redisClient = redis.createClient(process.env.REDIS_URL);
const jwtr = new JWTR(redisClient);
dotenv.config();

export const context = async ({ req }) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1] || '';
    if (accessToken) {
      const accessTokenVerifed = await jwtr.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await db.User.findOne({ where: { email: accessTokenVerifed.email } });
      if (!user) {
        throw new Error('You can use it after logging in.');
      }
      const AccessTokenVerifyJti = accessTokenVerifed.jti;
      return { user, AccessTokenVerifyJti };
    } else {
      return 'No auth token';
    }
  } catch (err) {
    return err;
  }
};
