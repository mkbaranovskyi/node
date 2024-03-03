import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import resolvers from './schema/resolvers/resolvers';
import typeDefs from './schema/type-defs/type-defs';

const server = new ApolloServer({ typeDefs, resolvers });

async function bootstrap() {
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
}

bootstrap();
