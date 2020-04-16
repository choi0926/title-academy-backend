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
`;

export default user;
