import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchQuery.trim() !== '') {
      navigate(`/listUsers?name=${encodeURIComponent(searchQuery.trim())}`);
      window.location.reload();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={{ position: 'relative', marginRight: '20px' }}>
      <InputBase
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ backgroundColor: '#119299', borderRadius: '5px', padding: '5px 10px' }}
      />
      <IconButton onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    </div>
  );
};

export default SearchBar;