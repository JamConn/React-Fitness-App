import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import UserCard from '../Components/UserCard';
import Navbar from '../Components/Navigation';

const ListUsers = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchName = searchParams.get('name');

    if (searchName) {
      console.log('Search Name:', searchName);
      fetch(`http://localhost:5000/searchUsers?name=${encodeURIComponent(searchName)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Search Results:', data);
          setSearchResults(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setError('Failed to fetch search results');
          setLoading(false);
        });
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  }, [window.location.search]);

  return (
    <div>
      <Navbar />
      {loading && <Typography variant="h6">Loading...</Typography>}
      {error && <Typography variant="h6">{error}</Typography>}
      {!loading && !error && searchResults.length === 0 && (
        <Typography variant="h6">No users found</Typography>
      )}
      {!loading && !error && searchResults.length > 0 && (
        <Grid container spacing={2}>
          {searchResults.map((user) => (
            <Grid item xs={12} key={user._id}>
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ListUsers;