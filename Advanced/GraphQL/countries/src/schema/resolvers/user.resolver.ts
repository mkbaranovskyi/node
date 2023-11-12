import { MovieList, UserList } from '../../data';

export const friends = (user) => user.friends.map((friend) => UserList.find((u) => u.id === friend.id));

export const favoriteMovies = (user) => {
  // Since we don't have 'favoriteMovies' in users, you can assume we would query the DB here
};
