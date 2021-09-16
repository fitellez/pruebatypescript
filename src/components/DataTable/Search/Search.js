import React, { useState } from 'react';

const SearchComponent = ({ onSearch }) => {
  const [search, setSearch] = useState('');

  const onInputChange = (value) => {
    setSearch(value);
    onSearch(value);
  };
  return (
    <input
      type='text'
      name=''
      id=''
      className='form-control mt-2'
      // style={{ width: '240px' }}
      placeholder='Buscar'
      value={search}
      onChange={(e) => onInputChange(e.target.value)}
    />
  );
};

export default SearchComponent;
