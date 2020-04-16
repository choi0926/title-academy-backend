import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from 'apollo-server';

export const Query = {
  users: (parents, args, { db }) => {
    const users = db.User.findAll();
    return users;
  },
  async user(parents, { email }, { req, res, db }) {
    try {
      const users = await db.User.findOne({ where: { email } });
      if (!users) {
        res.status(403).send('사용자를 찾을 수 없습니다.');
      }
      return users;
    } catch (error) {
      throw new ForbiddenError('사용자를 찾을 수 없습니다.');
    }
  },
  async login(parents, { email, password }, { req, res, db }) {
    try {
      const users = await db.User.findOne({ where: { email } });
      if (!users) {
        throw new ForbiddenError('이메일 주소를 다시 확인해주십시오.');
        // res.status(403).send('이메일 주소를 다시 확인해주십시오.');
      }
      const hashpass = await bcrypt.compare(password, users.password);
      if (hashpass) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.cookie('auth', token);
        return users;
      }
    } catch (error) {
      throw new ForbiddenError('로그인에 실패하셨습니다..');
    }
  },
};
