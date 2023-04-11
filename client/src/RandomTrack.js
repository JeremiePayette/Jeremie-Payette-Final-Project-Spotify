import { useState, useEffect } from "react";
import { TRACKS_RANDOM, getRandomInt } from "./Variables";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaSyncAlt } from "react-icons/fa";
import { getArtistInfo } from "./Authorization";

const TrackList = () => {
  const [tracks, setTracks] = useState([]);
  const [refreshTracks, setRefreshTracks] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const display_name = localStorage.getItem("displayName")
  

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const offset = getRandomInt(1000);
        const searchTerm = "year:2023";
        const limit = 30;
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            searchTerm
          )}&type=track&limit=${limit}&offset=${offset}&market=US`, // Add market parameter
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTracks(data.tracks.items);
      } catch (error) {
        console.error(error);
      }
    };

    if (refreshTracks) {
      fetchTracks();
      setRefreshTracks(false);
    }
  }, [refreshTracks]);

  const handleRefresh = () => {
    setRefreshTracks(true);
  };

  const playSong = async (track) => {
    if (!track) {
      return;
    }
    console.log(`Playing ${track.name} - ${track.artists[0].name}`);

    const access_token = localStorage.getItem("accessToken");
    try {
      // Pause the current song if it's playing
      if (isPlaying) {
        await fetch(`https://api.spotify.com/v1/me/player/pause`, {
          method: "PUT",
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
          method: "PUT",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [`spotify:track:${track.id}`],
          }),
        }
      );
      console.log(response);

      // Redirect the user to the songs page with the song ID appended to the URL
      window.location.href = `http://localhost:3000/songs/${display_name}/${track.track.id}`;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <RefreshArea>
        <Refresh className="text">Refresh Songs</Refresh>
        <RefreshButton onClick={handleRefresh}>
          <FaSyncAlt className="icon" />
        </RefreshButton>
      </RefreshArea>
      <Container>
        {tracks.map((track) => (
          <Link to={`/songs/${display_name}/${track.id}`}>
            <SongContainer key={track.id} onClick={() => playSong(track)}>
              <Img
                src={track.album.images[0].url}
                alt={`Cover art for ${track.name}`}
              />
              <P>{track.artists.map((artist) => artist.name).join(", ")}</P>
              <P>{track.name}</P>
            </SongContainer>
          </Link>
        ))}
      </Container>
    </>
  );
};

export default TrackList;

const RefreshArea = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const Refresh = styled.span`
  color: white;
  text-align: center;
  align-self: center;
  margin-right: 5px;
`;

const RefreshButton = styled.button`
  display: flex;
  background-color: #1db954;
  border: none;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #1ed760;
  }

  .icon {
    margin: 0;
  }

  .text {
    margin-left: 5px;
  }
`;
const Link = styled(NavLink)`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: white;
  }
`;

const P = styled.p`
  color: white;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  overflow-x: hidden;
`;

const SongContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 200px;
  max-height: 250px;
  text-align: center;
  background-color: #292929;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media only screen and (min-width: 600px) {
    max-width: 250px;
    max-height: 300px;
  }

  @media only screen and (min-width: 960px) {
    max-width: 300px;
    max-height: 350px;
  }
`;

const Img = styled.img`
  max-height: 100%;
  max-width: 100%;
`;
