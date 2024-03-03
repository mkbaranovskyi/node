"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
exports.default = (0, graphql_tag_1.gql) `
  type Movie {
    id: ID!
    title: String!
    yearOfPublication: Int!
    rating: Float
    isInTheaters: Boolean!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    nationality: Nationality!
    friends: [User]
    favoriteMovies: [Movie]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "User" query returns an array of zero or more Users (defined above).
  type Query {
    users: [User]
    user(id: ID!): User!
    movies: [Movie]!
    movie(title: String!): Movie!
  }

  input CreateUserInput {
    name: String!
    username: String!
    age: Int = 18 # Default value
    nationality: Nationality!
  }

  input UpdateUserInput {
    name: String
    username: String
    age: Int
    nationality: Nationality
  }

  type Mutation {
    # We can this line but it's better to difeine the input type
    # createUser(user: User!): User!
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): User
  }

  enum Nationality {
    CANADA
    BRAZIL
    INDIA
    GERMANY
    CHILE
  }
`;
