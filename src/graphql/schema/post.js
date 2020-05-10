import { gql } from 'apollo-server-express';

const post = gql`
  type Post {
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
    UserId: Int!
    src: String!
    createdAt: DATE!
    updatedAt: DATE!
  }
  type PostInfo{
    post:Post!
    image:Image!
    comment:Comment!
  }
  
  type File{
    filename:String!
    mimetype:String!
    encoding:String!
  }
`;

export default post;
