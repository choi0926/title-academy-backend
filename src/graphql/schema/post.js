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
    content: String!
    createdAt: DATE!
    updatedAt: DATE!
    UserId: Int!
    PostId: Int!
  }

  type Image {
    PostId: Int!
    UserId: Int!
    src: String!
    createdAt: DATE!
    updatedAt: DATE!
  }
  
  type PostThumbnail {
    category: String!
    subject: String!
    content: String!
    createdAt: DATE!
    updatedAt: DATE!
    recommend: Int!
    views: Int!
    UserId: Int!
    nickname: String!
  }
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`;

export default post;
