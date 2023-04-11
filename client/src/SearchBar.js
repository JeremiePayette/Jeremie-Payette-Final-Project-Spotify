import React, { useState } from 'react';
import styled from 'styled-components';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const display_name = localStorage.getItem("displayName")


  const handleSearchTermChange = async (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      await searchForSong(event.target.value);
    } else {
      setSearchResults([]);
    }
  };

  const searchForSong = async (searchTerm) => {
    const access_token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = await response.json();
      setSearchResults(data.tracks.items);
    } catch (error) {
      console.error(error);
    }
  };

const playSong = async (track) => {
  if (!track) {
    return;
  }
  console.log(`Playing ${track.name} - ${track.artists[0].name}`);
  setSearchTerm('');
  setSearchResults([]);
  
  const access_token = localStorage.getItem('accessToken');
  try {
    // Pause the current song if it's playing
    if (isPlaying) {
      await fetch(`https://api.spotify.com/v1/me/player/pause`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setIsPlaying(false);
    }
    
    // Play the new song
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track.id}`],
        }),
      }
    );
    console.log(response);

    // Redirect the user to the songs page with the song ID appended to the URL
    window.location.href = `http://localhost:3000/songs/${display_name}/${track.id}`;
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Form>
      <Input
        type="text"
        placeholder="Search for a song"
        value={searchTerm}
        onChange={handleSearchTermChange}
      />
      <Dropdown>
        {searchResults.map((track) => {
          if (!track) {
            return null;
          }
          return (
            <DropdownItem key={track.id} onClick={() => playSong(track)}>
              {track.name} - {track.artists[0].name}
            </DropdownItem>
          );
        })}
      </Dropdown>
    </Form>
  );
};



const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  position: absolute;
  width: 400px;
  left: 200px;
  top: 20px;
  `

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  width: 400px;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: calc(100%);
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
  z-index: 1;
  box-sizing: border-box;
`;

const DropdownItem = styled.li`
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default SearchBar;