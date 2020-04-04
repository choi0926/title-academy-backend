import users from '../database/users';

const resolvers = {
  Query: {
    users: () => users,
    user: (_, { email }) => {
      return users.filter(user => user.email === email)[0];
    }
  },
  Mutation: {
    register: (_, { name, email,password,birthday,gender,job }) => {
      // 영화 제목 중복 검사
      if (users.find(user => user.email === email)) return null;
      
      // 데이터베이스에 추가
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        birthday,
        gender,
        job
      };
      users.push(newUser);
      return newUser;
    }
  }
};

export default resolvers;