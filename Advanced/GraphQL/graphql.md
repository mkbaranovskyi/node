# GraphQL

- [GraphQL](#graphql)
  - [Express example](#express-example)
    - [Basics](#basics)
    - [Books \& Authors example](#books--authors-example)
    - [Mutations](#mutations)

---

## Express example

### Basics

```bash
npm i express express-graphql graphql
```

```js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const app = express();

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'HelloWorld',
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => 'Hello World',
      },
    }),
  }),
});

app.use(
  '/hello-world',
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

app.listen(5000, () => console.log('The server is running on port 5000'));
```

Open `localhost:5000/graphql` in your browser and run the following query:

```graphql
{
  message
}
```

Output: 
  
```json
{
  "data": {
    "message": "Hello World"
  }
}
```

### Books & Authors example

```js
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql');
const { authors, books } = require('./data/book-data');

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => books.filter((book) => book.authorId === author.id),
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id === book.authorId),
    },
  }),
});

const RootQuetyType = new GraphQLObjectType({
  name: 'Query',
  description: "Root Query (you'll see this in the docs)",
  fields: () => ({
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => authors.find((author) => author.id === args.id),
    },
    authorsByName: {
      type: new GraphQLList(AuthorType),
      description: 'A Single Author by name',
      args: {
        name: { type: GraphQLString },
      },
      resolve: (parent, args) =>
        authors.filter((author) => author.name.toLowerCase().includes(args.name.toLowerCase())),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQuetyType,
});
```

---

### Mutations

The GraphQL version of POST/PUT/DELETE is called a mutation. Mutations are used to create, update, or delete data in the back end

```js

```