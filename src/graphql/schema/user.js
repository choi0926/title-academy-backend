import { gql } from 'apollo-server-express';

const user = gql`
  type User {
    email: String!
    nickname: String!
    description: String
    profile: String
  }
  
  type LoginUser {
    user: User!
    accessToken: String!
    refreshToken: String!
    expiresIn : String!
  }
  type tokenReissue{
    accessToken: String!
    expiresIn : String!
  }
`;

export default user;
