import { gql } from 'apollo-server-express';
import user from './user';
import post from './post';

const common = gql`
  scalar DATE

  type Query {
    users: [User!]!
    user(email: String!): User
    posts: [Post!]!
    post(UserId: Int!): [Post]
    postInfo(PostId: Int!): [Post]
    comments(PostId: Int!): [Comment]
    comment(UserId: Int!): [Comment]
    image(PostId: Int!): [Image]
  }
  type Mutation {
    addUser(email: String!, nickname: String!, password: String!): User!
    login(email: String!, password: String!): LoginUser
    logout: Boolean!
    tokenReissue(accessToken:String!,refreshToken:String!): String!
  }
`;

const typeDefs = [common, user, post];
export default typeDefs; 