"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movies = exports.movie = exports.users = exports.user = void 0;
const data_1 = require("../../data");
const user = (_, { id }) => data_1.UserList.find((user) => user.id === Number(id));
exports.user = user;
const users = () => data_1.UserList;
exports.users = users;
const movie = (_, { title }) => data_1.MovieList.find((movie) => movie.title === title);
exports.movie = movie;
const movies = () => data_1.MovieList;
exports.movies = movies;
