import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import SongButtons from "./SongButtons";
import MongoButtons from "./MongoButtons";


const SongPage = () => {
  const [track, setTrack] = useState(null);
  const { songId } = useParams();
  const {displayName} = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPlaylists(data.items);
        setSelectedPlaylist(data.items[0].id); // Select the first playlist by default
      })
      .catch((error) => console.error(error));
  }, [accessToken]);

  const handleAddToPlaylist = () => {
    fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const trackUris = data.items.map((item) => item.track.uri);
        if (trackUris.includes(track.uri)) {
          window.alert("Track is already in the playlist");
        } else {
          fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uris: [track.uri],
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Added track to playlist:", data);
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));

  };
  useEffect(() => {
    fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrack(data);
      })
      .catch((error) => console.error(error));
  }, [accessToken, songId]);

  if (!track) {
    return <div>Loading...</div>;
  }



  return (
    <>
    <SongPageContainer>
      <Sidebar />
      <Container>
        <Img
          src={track.album.images[0].url}
          alt={`Cover art for ${track.name}`}
        />
        <H1>{track.name}</H1>
        <H2>
        {track.artists.map((artist) => (
          <Artists key={artist.id}>
            <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
          </Artists>
        ))}
        </H2>
        <SongButtons />
        <Select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
        >
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </Select>
        <Button onClick={handleAddToPlaylist}>Add to Playlist</Button>
        <MongoButtons/>
      </Container>
    </SongPageContainer>
    </>
  );
};

const SongPageContainer = styled.div`

display: flex;


`

const Select = styled.select`

background-color: black;
color: white;
border: none;
:hover{
  cursor: pointer;

}
`

const Button = styled.button`

background-color: black;
color: white;
border: none;

:hover{
  cursor: pointer;

}

`

const Artists = styled.p`

color: white;
padding-right: 10px;

`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const Img = styled.img`
  width: 600px;
  height: 600px;
`;

const H2 = styled.h2`
  color: white;
  display: flex;
  ;
`;

const H1 = styled.h1`
  color: white;
`;

const Link = styled(NavLink)`

text-decoration: none;
color: white;
&:hover {
        text-decoration: underline;
        color: white;
    }

`

export default SongPage;