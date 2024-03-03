"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../data");
const query_resolver_1 = require("./query.resolver");
const user_resolver_1 = require("./user.resolver");
exports.default = {
    Query: {
        movie: query_resolver_1.movie,
        movies: query_resolver_1.movies,
        user: query_resolver_1.user,
        users: query_resolver_1.users,
    },
    User: {
        friends: user_resolver_1.friends,
        favoriteMovies: user_resolver_1.favoriteMovies,
    },
    Mutation: {
        createUser: (parent, args) => {
            const { input } = args;
            const lastId = data_1.UserList[data_1.UserList.length - 1].id;
            const user = { ...input, id: lastId + 1 };
            data_1.UserList.push(user);
            return user;
        },
        updateUser: (parent, args) => {
            const { id, input } = args;
            const user = data_1.UserList.find((user) => user.id === Number(id));
            if (!user) {
                throw new Error(`Couldn't find user with id ${id}`);
            }
            Object.assign(user, input);
            return user;
        },
        deleteUser: (parent, args) => {
            const { id } = args;
            const userIndex = data_1.UserList.findIndex((user) => user.id === Number(id));
            if (userIndex === -1) {
                throw new Error(`Couldn't find user with id ${id}`);
            }
            const deletedUsers = data_1.UserList.splice(userIndex, 1);
            return deletedUsers[0];
        },
        // createMovie: () => {
        //   // Since we don't have a DB, you can assume we would create a movie here
        // },
        // updateMovie: () => {
        //   // Since we don't have a DB, you can assume we would update a movie here
        // },
        // deleteMovie: () => {
        //   // Since we don't have a DB, you can assume we would delete a movie here
        // },
    },
};
