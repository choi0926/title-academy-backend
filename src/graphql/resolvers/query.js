import db, { sequelize } from '../../models';
import { sendMail } from '../../middleware/mailsender';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { QueryTypes } from 'sequelize';
dotenv.config();

const Query = {
  async users(parents, args) {
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
      crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2(user.email, buf+process.env.AUTH_SECRET, 100000, 64, 'sha512', async (err, key) => {
          const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
          const authCode = key.toString('base64').replace(regExp, '');
          await db.User.update({ authCode }, { where: { email: user.email } });
          sendMail(user.email, 'Your titleacademy password reset', authCode);
        });
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

  async posts(parents, { limit, offset }) {
    try {
      const getPostInfo = await sequelize.query(
        `SELECT Posts.*,Users.nickname FROM Posts,Users WHERE Posts.UserId = Users.id ORDER BY Posts.id DESC LIMIT ${limit} OFFSET ${offset}`,
        { type: QueryTypes.SELECT },
      );
      return getPostInfo;
    } catch (err) {
      return err;
    }
  },
  async post(parents, { PostId }) {
    try {
      const getPost = await db.Post.findOne({ where: { id: PostId } });
      if (!getPost) {
        throw new Error('This post does not exist.');
      }
      const getUser = await db.User.findOne({ where: { id: getPost.UserId } });
      return { post: getPost, user: getUser };
    } catch (err) {
      return err;
    }
  },
  async comments(parents, { PostId }) {
    try {
      const getComment = await db.Comment.findAll({ where: { PostId } });
      return getComment;
    } catch (err) {
      return err;
    }
  },
  async image(parents, { PostId }) {
    try {
      const getImage = await db.Image.findAll({ where: { PostId } });
      return getImage;
    } catch (err) {
      return err;
    }
  },
  async searchPost(parents,{searchWord}){
    try{
      const post = await sequelize.query(`SELECT Posts.*,Users.email FROM Posts, Users WHERE Posts.UserId = Users.id AND ((Posts.subject LIKE '%${searchWord}%') OR (Posts.content LIKE '%${searchWord}%')) ORDER BY Posts.id DESC`,{type:QueryTypes.SELECT})
      console.log(post)
      return post;
    }catch(err){
      return err;
    }
  }
};

export default Query;
