import { UserList } from '../../data';
import { movie, movies, user, users } from './query.resolver';
import { favoriteMovies, friends } from './user.resolver';

export default {
  Query: {
    movie,
    movies,
    user,
    users,
  },

  User: {
    friends,
    favoriteMovies,
  },

  Mutation: {
    createUser: (parent, args) => {
      const { input } = args;
      const lastId = UserList[UserList.length - 1].id;
      const user = { ...input, id: lastId + 1 };
      UserList.push(user);
      return user;
    },

    updateUser: (parent, args) => {G
      const { id, input } = args;
      const user = UserList.find((user) => user.id === Number(id));
      if (!user) {
        throw new Error(`Couldn't find user with id ${id}`);
      }
      Object.assign(user, input);
      return user;
    },
    deleteUser: (parent, args) => {
      const { id } = args;
      const userIndex = UserList.findIndex((user) => user.id === Number(id));
      if (userIndex === -1) {
        throw new Error(`Couldn't find user with id ${id}`);
      }
      const deletedUsers = UserList.splice(userIndex, 1);
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
