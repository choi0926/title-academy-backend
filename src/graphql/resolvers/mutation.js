import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import db from '../../models';
import redis from 'redis';
import JWTR from 'jwt-redis';

const redisClient = redis.createClient(process.env.REDIS_URL);
const jwtr = new JWTR(redisClient);
dotenv.config();

const Mutation = {
  async addUser(parents, { email, nickname, password }) {
    try {
      const users = await db.User.findOne({ where: { email } });
      if (users) {
        throw new Error('That email has already been registered.');
      }
      const hashpass = await bcrypt.hash(password, 10);
      const addUser = await db.User.create({ email, nickname, password: hashpass });
      return addUser;
    } catch (err) {
      return err;
    }
  },

  async login(parents, { email, password }) {
    try {
      let users = await db.User.findOne({ where: { email } });
      if (!users) {
        throw new Error('Please check your email or password.');
      }
      const hashpass = await bcrypt.compare(password, users.password);
      if (!hashpass) {
        throw new Error('Please check your email or password.');
      }
      const payload = { email };
      const accessToken = await jwtr.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      const refreshToken = await jwtr.sign(payload, process.env.REFRESH_TOKEN_SECRET);
      await db.User.update({ refreshToken }, { where: { id: users.id } });
      return {
        user: users,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      return err;
    }
  },
  async logout(parents, args, context) {
    try {
      await jwtr.destroy(context.AccessTokenVerifyJti, process.env.ACCESS_TOKEN_SECRET);
      const logoutUser = await db.User.findOne({ where: { id: context.user.id } });
      const refreshTokenDecoded = await jwtr.verify(logoutUser.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!refreshTokenDecoded) {
        throw new Error('Invalid token');
      }
      await jwtr.destroy(refreshTokenDecoded.jti, process.env.REFRESH_TOKEN_SECRET);
      await db.User.update({ refreshToken: '' }, { where: { id: logoutUser.id } });
      return 'Successful logout';
    } catch (err) {
      return err;
    }
  },
  async tokenReissue(parents, { accessToken, refreshToken }) {
    try {
      const accessTokenDecoded = await jwtr.decode(accessToken);
      const tokenReissueUser = await db.User.findOne({ where: { email: accessTokenDecoded.email } });
      const meRefreshToken = tokenReissueUser.refreshToken;
      if (meRefreshToken !== refreshToken) {
        throw new Error('Invalid token');
      }
      const payload = { email: tokenReissueUser.email };
      const accessTokenReissue = await jwtr.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
      return accessTokenReissue;
    } catch (err) {
      return err;
    }
  },
  async userInfoModifed(parents,{email, password}){
    try{
      const user = await db.User.findOne({where:{email}});
      if(!user){
        throw new Error('The user does not exist.');
      }
      const hashpass = await bcrypt.hash(password, 10);
      await db.User.update({password:hashpass},{where:{email:user.email}});
      return 'Your password has been modified.';
    }catch(err){
      return err;
    }
  }
};

export default Mutation;
