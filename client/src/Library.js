import React, { useState, useEffect } from "react";
import { PLAYLISTS } from "./Variables";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistDetails, setSelectedPlaylistDetails] = useState([]);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const display_name = localStorage.getItem("displayName")

  useEffect(() => {
    const fetchPlaylists = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }
      const response = await fetch(PLAYLISTS, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const playlists = data.items;
      setPlaylists(playlists);
      setIsLoading(false);
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken || !selectedPlaylist) {
        return;
      }
      const response = await fetch(selectedPlaylist.tracks.href, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const tracks = data.items;
      setSelectedPlaylistDetails(tracks);
      setIsLoading(false);
    };
    fetchPlaylistDetails();
  }, [selectedPlaylist]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    const playlistName = e.target.playlistName.value;
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: playlistName
      })
    });
    const data = await response.json();
    setPlaylists([...playlists, data]);
    setCreatingPlaylist(false);
  };

  const playSong = async (track) => {
    if (!track) {
      return;
    }
    console.log(`Playing ${track.track.name} - ${track.track.artists[0].name}`);
  
    const access_token = localStorage.getItem('accessToken');
    try {
      // Play the selected track
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          uris: [`spotify:track:${track.track.id}`],
        }),
      });
  
      setIsPlaying(true);
      
      window.location.href = `http://localhost:3000/songs/${display_name}/${track.track.id}`;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTrack = async (track) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken || !selectedPlaylist) {
      return;
    }
    const response = await fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracks: [{ uri: track.track.uri }]
      })
    });
    if (response.ok) {
      setSelectedPlaylistDetails(selectedPlaylistDetails.filter((t) => t.track.id !== track.track.id));
    } else {
      console.error('Failed to delete track:', response);
    }
  };

  
  return (
    <Wrapper>
      {isLoading ? (
        <p>Loading playlists...</p>
      ) : (
        <div>
          <SideBarPlaylist>
          <Sidebar />
          <PlaylistsGrid>
            {playlists.map((playlist, index) => (
              <Playlist
                key={playlist.id}
                onClick={() => setSelectedPlaylist(playlist)}
                onFocus={() => setSelectedPlaylist(playlist)}
                tabIndex={0}
              >
                <H2>{playlist.name}</H2>
              </Playlist>
            ))}
            {!creatingPlaylist && (
              <CreatePlaylistButton onClick={() => setCreatingPlaylist(true)}>
                + Create New Playlist
              </CreatePlaylistButton>
            )}
            {creatingPlaylist && (
              <Form onSubmit={handleCreatePlaylist}>
                <Input type="text" name="playlistName" />
                <Button type="submit">Create Playlist</Button>
              </Form>
            )}
          </PlaylistsGrid>
        </SideBarPlaylist>
          {selectedPlaylistDetails && selectedPlaylistDetails.length > 0 && (
            <TracksGrid>
              {selectedPlaylistDetails.map((track, index) => (
                <TrackArea key={track.track.id}>
                  <Track onClick={() => playSong(track)}>
                    <Img src={track.track.album.images[0].url} alt={track.track.album.name} />
                    <Name>{track.track.name}</Name>
                    <Artists>{track.track.artists.map((artist) => artist.name).join(", ")}</Artists>
                  </Track>
                  <DeleteButton onClick={() => handleDeleteTrack(track)}>Remove</DeleteButton>
                </TrackArea>
              ))}
            </TracksGrid>
          )}
        </div>
      )}
    </Wrapper>
  );
}

  const SideBarPlaylist = styled.div`
  
  display: flex;
  gap: 30px;
  
  `

  const CreatePlaylistButton = styled.button`
  background-color: #1db954;
  color: white;
  font-size: 1.1rem;
  padding: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1ed760;
  }
`;

const TrackArea = styled.div`

text-align: center;
width: 240px;

`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;


const Input = styled.input`
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem;
  border-radius: 5px;
  border: none;
  background-color: #1db954;
  color: white;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1ed760;
  }
`;


const DeleteButton = styled.button`
cursor: pointer;
margin-top: 10px;
color: white;
border: none;
background-color: black;
`;

const Artists = styled.p`
  color: #b3b3b3;
  font-size: 14px;
`;

const Name = styled.h3`
  color: white;
  font-size: 16px;
  margin: 0;
  margin-bottom: 5px;
  margin-top: 10px;
`;

const Img = styled.img`
  width: 150px;
  height: 150px;
`;

const Wrapper = styled.div`
  padding: 30px;
  background-color: black;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
`;

const PlaylistsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  height: 80px;
  margin-top: 40px;
`;

const Playlist = styled.div`
  background-color: #282828;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

  const H2 = styled.h3`
    color: white;
    font-size: 18px;
    margin: 0;
    font-weight: bold;


  &:focus {
    outline: none;
    background-color: #444;
  }
`;


const TracksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Modified value */
  gap: 20px;
  margin-top: 30px;
`;

const Track = styled.div`
  background-color: #282828;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 200px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }`


export default Library;