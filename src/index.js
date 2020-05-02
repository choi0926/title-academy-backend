import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';
import dotenv from 'dotenv';
import db from './models';
import { context } from './middleware/auth'
import cors from 'cors'

const app = express();
dotenv.config();
db.sequelize.sync();

// ApolloServer는 스키마와 리졸버가 반드시 필요함
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context
});

app.use(
  cors({
    origin: true, 
    credentials: true,
  })
);

server.applyMiddleware({ app, path: '/graphql' });
const port = 4000;

// listen 함수로 웹 서버 실행
app.listen({ port: process.env.PORT || port }, () => {
  console.log(`🚀  Server ready at localhost:${port}`);
});
