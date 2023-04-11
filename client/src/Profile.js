import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client_id, client_secret } from "./Variables";
import styled from "styled-components";
import { CURRENTLYPLAYING } from "./Variables";
import SongButtons from "./SongButtons";
import Sidebar from "./Sidebar";
import TrackList from "./RandomTrack";
import UserProfile from './UserInfo';
import { NavLink } from "react-router-dom";

const useCurrentlyPlaying = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const fetchCurrentlyPlaying = async () => {
        const accessToken = await localStorage.getItem("accessToken");
        fetch(CURRENTLYPLAYING, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
              setCurrentlyPlaying(data);
          })
          .catch((error) => console.error(error));
      };
    
      fetchCurrentlyPlaying();
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [currentlyPlaying]);
  return currentlyPlaying;
}

const Profile = ({ isAuthorized }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState("");
  const [audio] = useState(new Audio());
  const currentlyPlaying = useCurrentlyPlaying();
  const display_name = localStorage.getItem("displayName")

  useEffect(() => {
    const access = localStorage.getItem("accessToken");
    setAccessToken(access);

    const checkTokenExpiration = () => {
      const expiresAt = localStorage.getItem("expires_in");
      const now = new Date().getTime();
      if (expiresAt && now > parseInt(expiresAt)) {
        refreshAccessToken(now);
      }
    };

    const refreshAccessToken = (now) => {
      const refreshToken = localStorage.getItem("refreshToken");
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      })
        .then((response) => response.json())
        .then((data) => {
          setAccessToken(data.access_token);
          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("expires_in", now + data.expires_in * 1000);
          localStorage.setItem("refreshToken", data.refresh_token);
        })
        .catch((error) => console.error(error));
    };

    const intervalId = setInterval(checkTokenExpiration, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  const handleArtistClick = (e) => {
    e.preventDefault();
    const artistId = currentlyPlaying?.item?.album?.artists[0]?.id;
    if (artistId) {
      navigate(`/artist/${artistId}`);
    }
  };

  return (
    <>
      <Welcome>
        Welcome, <UserProfile />
      </Welcome>
      <SongArea>
      <SidebarSong>
      <Sidebar/>
      <Song>
            {currentlyPlaying ? (
                <PlayingSongContainer>
                <Link to={`/songs/${display_name}/${currentlyPlaying.item.id}`}>
                  <CurrentlyPlayingSong>
                    {currentlyPlaying.item.name}{" "}
                    <Artist onClick={handleArtistClick}>
                      {currentlyPlaying.item.album.artists[0].name}
                    </Artist>
                  </CurrentlyPlayingSong>
                  <Img src={currentlyPlaying.item.album.images[0].url} alt={currentlyPlaying.item.name} />
                </Link>
                <SongButtons />
              </PlayingSongContainer>
            ) : (
              <>
                <NoSong>No song is currently playing.</NoSong>  
              </>
            )}    
          </Song>
      </SidebarSong>
      </SongArea>
      <TrackListContainer>
      <TrackList/>      
      </TrackListContainer>
    </>
  );
};


export default Profile;

const Artist = styled.h3`

color: white;

`

const Link = styled(NavLink)`

text-decoration: none;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
&:hover {
        text-decoration: underline;
        color: white;
    }

`

const PlayingSongContainer = styled.div`

display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
max-width: 500px;

`



const TrackListContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Img = styled.img`

height: 200px;
width: 200px;
margin-bottom: 10px;

`

const Song = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const SongArea = styled.div`

display: flex;
flex-direction: row;

`


const CurrentlyPlayingSong = styled.div`
  color: white;
  font-size: 2rem;
  text-align: center;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;


const SidebarSong = styled.div`

display: flex;
flex-direction: row;
width: 100%;
`

const Welcome = styled.h1`
  color: white;
`;

const NoSong = styled.h2`

color: white;

`