import {gql} from 'apollo-server-express';

// const typeDefs =[userType,postType,imageType,commentType];
const typeDefs = gql`
  scalar DATE

  type User {
    id: Int!
    email: String!
    nickname: String!
    password: String!
    description: String
    profile: String
  }
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
  type Query {
    users: [User!]!
    user(email: String!): User
    login(email: String!, password: String!): User
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
    addPost(category:String!,subject:String!,content:String,src:String):Post!
    protectedAction:String
    imageUpload(PostId:Int!,src: String!): [Image]
  }
`;

export default typeDefs;
