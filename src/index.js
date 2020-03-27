import { ApolloServer } from 'apollo-server';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';

// ApolloServer는 스키마와 리졸버가 반드시 필요함
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});


const port = 4000;
// listen 함수로 웹 서버 실행
server.listen({ port: process.env.PORT || port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// 배포 테스트