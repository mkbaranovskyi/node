const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const app = express();

const { bookSchema } = require('./books');
const { helloWorldSchema } = require('./hello-world');

app.use(
  '/hello-world',
  graphqlHTTP({
    graphiql: true,
    schema: helloWorldSchema,
  })
);

app.use(
  '/books',
  graphqlHTTP({
    graphiql: true,
    schema: bookSchema,
  })
);

app.listen(5000, () => console.log('The server is running on port 5000'));
