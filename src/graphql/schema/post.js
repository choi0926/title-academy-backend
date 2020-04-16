import { gql } from 'apollo-server-express';

const post = gql`
  type Post {
    id: Int!
    category: String!
    subject: String!
    content: String!
    createdAt: DATE!
    updatedAt: DATE!
    recommend: Int!
    views: Int!
    UserId: Int!
  }

  type Comment {
    id: Int!
    content: String!
    createdAt: DATE!
    updatedAt: DATE!
    UserId: Int!
    PostId: Int!
  }
  
  type Image {
    id: Int!
    UserId: Int!
    src: String!
    createdAt: DATE!
    updatedAt: DATE!
    PostId: Int!
  }
`;

export default post;
