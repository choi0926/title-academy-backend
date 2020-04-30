import db from '../../models'

const Query = {
  // 모든 사용자 리스트
  users: (parents, args) => {  
    const users = db.User.findAll();
    return users;
  },
  // 특정 사용자 정보
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
};

export default Query;