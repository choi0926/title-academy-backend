import { gql } from 'apollo-server-express';
import user from './user';
import post from './post';

const common = gql`
  scalar DATE

  type Query {
    users: [User!]!
    user(email: String!): User
    login(email: String!, password: String!): User
    logout: String!
    posts: [Post!]!
    post(UserId: Int!): [Post]
    postInfo(PostId: Int!): [Post]
    comments(PostId: Int!): [Comment]
    comment(UserId: Int!): [Comment]
    image(PostId: Int!): [Image]
  }
  type Mutation {
    addUser(email: String!, nickname: String!, password: String!): User!
    updateUser(nickname: String, password: String, description: String, profile: String): User!
    addPost(category: String!, subject: String!, content: String, src: String): Post!
    protectedAction: String
    imageUpload(PostId: Int!, src: String!): [Image]
  }
`;

const typeDefs = [common, user, post];
export default typeDefs; 