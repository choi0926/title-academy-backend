import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    password: String!
    birthday: String!
    gender: String!
    job: String!
  }

  type Board {
    board_id: Int!
    title: String!
    content: String!
    email: String!
    date: String!
    hit: Int!
  }

  type Query {
    users: [User!]!
    user(email: String!): User
  }

  type Mutation {
    register(name: String!,email:String!, password: String!,  birthday: String!, gender: String!, job: String!): User!
  }
`;

export default typeDefs;
