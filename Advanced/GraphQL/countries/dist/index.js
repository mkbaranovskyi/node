"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const resolvers_1 = __importDefault(require("./schema/resolvers"));
const type_defs_1 = __importDefault(require("./schema/type-defs"));
const server = new server_1.ApolloServer({ typeDefs: type_defs_1.default, resolvers: resolvers_1.default });
async function bootstrap() {
    const { url } = await (0, standalone_1.startStandaloneServer)(server, { listen: { port: 4000 } });
}
bootstrap();
