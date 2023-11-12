"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../data");
exports.default = {
    Query: {
        users() {
            return data_1.UserList;
        },
    },
    // Mutation: {
    // Define your mutation resolvers here
    // },
    // Define any other resolvers here
};
