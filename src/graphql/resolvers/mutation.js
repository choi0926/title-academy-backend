import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import db from '../../models';
import redis from 'redis';
import JWTR from 'jwt-redis';
import AWS from 'aws-sdk';
import moment from 'moment';

AWS.config.update({
  region: 'ap-northeast-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({ apiVersion: '2012-10-17' });

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
        expiresIn: '15000',
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
      return { accessToken: accessTokenReissue, expiresIn: '15000' };
    } catch (err) {
      return err;
    }
  },
  async userInfoModifed(parents, { email, password }) {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('The user does not exist.');
      }
      const hashpass = await bcrypt.hash(password, 10);
      await db.User.update({ password: hashpass, authCode: '' }, { where: { email: user.email } });
      return 'Your password has been modified.';
    } catch (err) {
      return err;
    }
  },
  async userWithdrawal(parents, args, context) {
    try {
      await jwtr.destroy(context.AccessTokenVerifyJti, process.env.ACCESS_TOKEN_SECRET);
      const refreshTokenDecoded = await jwtr.verify(context.user.refreshToken, process.env.REFRESH_TOKEN_SECRET);
      if (!refreshTokenDecoded) {
        throw new Error('Invalid token');
      }
      await jwtr.destroy(refreshTokenDecoded.jti, process.env.REFRESH_TOKEN_SECRET);
      await db.User.destroy({ where: { email: context.user.email } });
      return 'You have been successfully withdrawn.';
    } catch (err) {
      return err;
    }
  },
  async addPost(parents, { category, subject, content, files }, context) {
    try {
      const addPost = await db.Post.create({ category, subject, content, UserId: context.user.id });
      if (files) {
        files.map(async (ok) => {
          const { createReadStream, filename, mimetype } = await ok;
          const fileStream = createReadStream();
          const Date = moment().format('YYYYMMDD');
          const randomString = Math.random().toString(36).substring(2, 7);
          const uploadParams = {
            Bucket: 'title-academy',
            Key: `original/${Date}_${randomString}_${filename}`,
            Body: fileStream,
            ContentType: mimetype,
          };
          const result = await s3.upload(uploadParams).promise();
          await db.Image.create({ src: result.Location, UserId: context.user.id, PostId: addPost.id });
          console.log(result);
        });
      }
      return 'Successful post creation.';
    } catch (err) {
      return err;
    }
  },
  async addComment(parents, { PostId, content }, context) {
    try {
      const addComment = await db.Comment.create({ content, UserId: context.user.id, PostId });
      return addComment;
    } catch (err) {
      return err;
    }
  },
  async postModifed(parents, { PostId, category, subject, content, files }, context) {
    try {
      const modifiedRight = await db.Post.findOne({
        where: {
          UserId: context.user.id,
          id: PostId,
        },
      });
      if (!modifiedRight) {
        throw new Error('You can only modify your own posts.');
      }
      //
      const postModified = await db.Post.update({ category, subject, content }, { where: { id: PostId } });
      if (files) {
        files.map(async (ok) => {
          const { createReadStream, filename, mimetype } = await ok;
          const fileStream = createReadStream();
          const Date = moment().format('YYYYMMDD');
          const randomString = Math.random().toString(36).substring(2, 7);
          const uploadParams = {
            Bucket: 'title-academy',
            Key: `original/${Date}_${randomString}_${filename}`,
            Body: fileStream,
            ContentType: mimetype,
          };
          const result = await s3.upload(uploadParams).promise();
          await db.Image.destroy({ where: { PostId } });
          await db.Image.create({ src: result.Location, UserId: context.user.id, PostId });
          console.log(result);
        });
      }
      return 'ok';
    } catch (err) {
      return err;
    }
  },
  async postDeleted(parents, { PostId }, context) {
    try {
      const deletedRight = await db.Post.findOne({ where: { UserId: context.user.id, id: PostId } });
      if (!deletedRight) {
        throw new Error('You can delete only your own posts.');
      }
      await db.Image.destroy({ where: { PostId } });
      await db.Post.destroy({ where: { id: PostId } });
      return 'ok';
    } catch (err) {
      return err;
    }
  },
};

export default Mutation;
