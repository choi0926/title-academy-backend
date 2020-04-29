import jwt from 'jsonwebtoken';
import db from '../models';
import dotenv from 'dotenv';
// const redis = require('redis');
import redis from 'redis';
import JWTR from 'jwt-redis';
const redisClient = redis.createClient();
const jwtr = new JWTR(redisClient);

dotenv.config();

export const context = async ({ req }) => {
  try {
    const accessToken = req.headers.authorization || '';
    if (accessToken) {
      const accessTokenVerifed = await jwtr.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await db.User.findOne({ where: { email: accessTokenVerifed.email } });
      if (!user) {
        throw new Error('Invalid token : login error');
      }
      const AccessTokenVerifyJti = accessTokenVerifed.jti;
      return { user, AccessTokenVerifyJti };
    } else {
      return 'No auth token';
    }
  } catch (err) {
    throw new Error(err);
  }
};
