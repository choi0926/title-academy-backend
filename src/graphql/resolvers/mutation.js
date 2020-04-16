import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ValidationError, ForbiddenError } from 'apollo-server';

export const Mutation = {
  async addUser(parents, { email, nickname, password }, { res, req, db }) {
    try {
      const users = await db.User.findOne({ where: { email } });
      if (users) {
        throw new ValidationError('이미사용중인 이메일 주소입니다.');
      }

      const hashpass = await bcrypt.hash(password, 10);
      const addUser = await db.User.create({ email, nickname, password: hashpass });
      return addUser;
    } catch (error) {
      throw new ForbiddenError('회원가입을 실패하였습니다.');
    }
  },
  async updateUser(parents, { nickname, password, description, profile }, { res, req, db }) {
    try {
      const token = req.headers.auth;
      if (!token) {
        throw new ForbiddenError('not token');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        throw new ForbiddenError('not decode');
      }
      const user = await db.User.findOne({ where: { email: decoded.email } });
      const hashpass = await bcrypt.hash(password, 10);

      await db.User.update({ nickname, password: hashpass, description, profile }, { where: { email: user.email } });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
};
