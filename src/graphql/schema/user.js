import { gql } from 'apollo-server-express';

const user = gql`
  type User {
    id: Int!
    email: String!
    nickname: String!
    password: String!
    description: String
    profile: String
  }
  type LoginUser {
    user:User!
    accessToken:String!
    refreshToken:String!
  }
`;

export default user;
