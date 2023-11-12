"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = require("graphql-tag");
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
exports.default = (0, graphql_tag_1.gql) `
  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    nationality: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "User" query returns an array of zero or more Users (defined above).
  type Query {
    users: [User]
  }
`;
