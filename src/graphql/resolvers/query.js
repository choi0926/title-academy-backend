import db from '../../models';
import { sendMail } from '../../middleware/mailsender';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const Query = {
  async users (parents, args){
    const users = await db.User.findAll();
    return users;
  },
  async user(parents, { email }) {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found.');
      }
      return user;
    } catch (err) {
      return err;
    }
  },
  async forgotPassword(parents, { email }) {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User email does not exist.');
      }
      crypto.pbkdf2(user.email, process.env.AUTH_SECRET, 100000, 64, 'sha512', async (err, key) => {
        const authCode = key.toString('base64');
        await db.User.update({ authCode }, { where: { email: user.email } });
        sendMail(user.email, 'Your titleacademy password reset', authCode);
      });
      return 'Your mail has been sent successfully.';
    } catch (err) {
      return err;
    }
  },
  async authCode(parents, { authCode }) {
    try {
      const user = await db.User.findOne({ where: { authCode } });
      if (!user) {
        throw new Error('Authentication failed.');
      }
      return user;
    } catch (err) {
      return err;
    }
  },

  async posts(parents, args) {
    try {
      //TODO: 페이징, 유저정보 포함,  display, page 인자값, 최신순으로
      const getPost = await db.Post.findAll();
      return getPost;
    } catch (err) {
      return err;
    }
  },
  async post(parents, { PostId }) {
    try {
      const getPost = await db.Post.findOne({where:{id:PostId}});
      if(!getPost){
        throw new Error('This post does not exist.')
      }
      return getPost;
    } catch (err) {
      return err;
    }
  },
  async comments(parents, { PostId }) {
    try {
      const getComment = await db.Comment.findAll({where:{PostId}});
      return getComment;
    } catch (err) {
      return err;
    }
  },
  async image(parents, { PostId }) {
    try {
      const getImage = await db.Image.findAll({where:{PostId}});
      return getImage;
    } catch (err) {
      return err;
    }
  },
};

export default Query;
