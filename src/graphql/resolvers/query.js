import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from 'apollo-server';

const Query = {
  // 모든 사용자 리스트
  users: (parents, args, { db }) => {  
    const users = db.User.findAll();
    return users;
  },
  // 특정 사용자 정보
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
};

export default Query;