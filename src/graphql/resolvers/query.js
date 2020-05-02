import db from '../../models';
import { sendMail } from '../../middleware/mailsender';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const Query = {
  users: (parents, args) => {
    const users = db.User.findAll();
    return users;
  },
  async user(parents, { email }) {
    try {
      const users = await db.User.findOne({ where: { email } });
      if (!users) {
        throw new Error('User not found.');
      }
      return users;
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
      crypto.pbkdf2(user.email, process.env.AUTH_SECRET, 100000, 64, 'sha512', async(err, key) => {
        const authCode = key.toString('base64');
        await db.User.update({authCode},{where:{email:user.email}});
        sendMail(user.email, 'Your titleacademy password reset', authCode);
      });
      return 'Your mail has been sent successfully.';
    } catch (err) {
      return err;
    }
  },
  async authCode(parents, { authCode }) {
    try {
      const user = await db.User.findOne({where:{authCode}})
      if(!user){
        throw new Error('Authentication failed.')
      }
      return user;
    } catch (err) {
      return err;
    }
  },
};

export default Query;
