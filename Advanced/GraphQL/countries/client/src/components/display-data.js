import React, { useState } from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query GetMovieByName($title: String!) {
    movie(title: $title) {
      id
      title
      yearOfPublication
    }
  }
`;

export function DisplayData() {
  const [movieSearch, setMovieSearch] = useState('');

  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  // fetchMovie - a function we'll invoke to query the server
  const [fetchMovie, { data: movieData, error: movieError }] = useLazyQuery(GET_MOVIE_BY_NAME);
  
  if (error) {
    console.error(error);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data) {
    console.log(data);
  }

  if (movieError) {
    console.error(movieError);
  }

  return (
    <div>
      {data?.users &&
        data?.users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
            <h3>{user.username}</h3>
            <h3>{user.age}</h3>
            <h3>{user.nationality}</h3>
          </div>
        ))}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(event) => {
            setMovieSearch(event.target.value);
          }}
        />
        <button
          onClick={() => {
            console.log(movieSearch);
            fetchMovie({ variables: { title: movieSearch } });
          }}
        >
          Fetch data
        </button>
        <div>
          {movieData?.movie && (
            <div>
              <h3>Movie title: {movieData?.movie?.title}</h3>
              <h3>Year of publication: {movieData?.movie?.yearOfPublication}</h3>
            </div>
          )}
          {movieError && <div>Movie not found</div>}
        </div>
      </div>
    </div>
  );
}
