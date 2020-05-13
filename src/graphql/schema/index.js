import { gql } from 'apollo-server-express';
import user from './user';
import post from './post';

const common = gql`
  scalar DATE

  type Query {
    users: [User!]!
    user(email: String!): User
    forgotPassword(email:String!):String!
    authCode(authCode:String!):User!
    posts: [Post]!
    post(PostId: Int!): Post!
    comments(PostId:Int!):[Comment]!
    image(PostId:Int!):[Image]!
  }
  type Mutation {
    addUser(email: String!, nickname: String!, password: String!): User!
    login(email: String!, password: String!): LoginUser
    logout: String!
    tokenReissue(accessToken:String!,refreshToken:String!): String!
    userInfoModifed(email: String!, password: String!):String!
    addPost(category:String!,subject:String!,content:String!,files:[Upload]):String!
    addComment(PostId:Int!,content:String!):Comment!
  }
`;

const typeDefs = [common, user, post];
export default typeDefs; 