import { MovieList, UserList } from '../../data';

export const user = (_, { id }) => UserList.find((user) => user.id === Number(id));

export const users = () => UserList;

export const movie = (_, { title }) => MovieList.find((movie) => movie.title === title);

export const movies = () => MovieList;
