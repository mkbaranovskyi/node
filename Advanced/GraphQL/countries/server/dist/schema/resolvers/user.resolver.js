"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteMovies = exports.friends = void 0;
const data_1 = require("../../data");
const friends = (user) => user.friends.map((friend) => data_1.UserList.find((u) => u.id === friend.id));
exports.friends = friends;
const favoriteMovies = (user) => {
    // Since we don't have 'favoriteMovies' in users, you can assume we would query the DB here
};
exports.favoriteMovies = favoriteMovies;
