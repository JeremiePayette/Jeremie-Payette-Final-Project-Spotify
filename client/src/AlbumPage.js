import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";

const AlbumPage = () => {
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [album, setAlbum] = useState({});
    const display_name = localStorage.getItem("displayName")

    const accessToken = localStorage.getItem("accessToken");
    const { albumId } = useParams();
    console.log(albumId)

    useEffect(() => {
        console.log("Fetching album data...");
        const fetchData = async () => {
            try {
                const albumResponse = await fetch(
                    `https://api.spotify.com/v1/albums/${albumId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const albumData = await albumResponse.json();
                console.log("Album data:", albumData);
                setAlbum(albumData);
                const tracksResponse = await fetch(
                    `https://api.spotify.com/v1/albums/${albumId}/tracks`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                const tracksData = await tracksResponse.json();
                console.log("Tracks data:", tracksData);
                setTracks(tracksData.items);

                setIsLoading(false);
                console.log("Finished fetching data.");
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [albumId, accessToken]);

    const playSong = async (track) => {
        if (!track) {
            return;
        }
        console.log(`Playing ${track.name} - ${track.artists[0].name}`);
        
        const access_token = localStorage.getItem('accessToken');
        try {
            // Play the selected track
            await fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: [track.uri],
                }),
            });
        } catch (error) {
            console.error(error);
        }
    };

        return (
            <>
            <AlbumContainer>
            <Sidebar/>
            {isLoading ? (
                <LoadingText>Loading...</LoadingText>
            ) : (
                <>
                <Album>
                <AlbumName>{album.name}</AlbumName>
                <ArtistName>{album.artists[0].name}</ArtistName>
                <AlbumImage src={album.images[0].url} alt={album.name} />
                <SectionTitle>Tracks</SectionTitle>
                {tracks.length > 0 ? (
                    <SongList>
                    {tracks.map((track, index) => {
                        const { id, name } = track;
                        return (
                        <SongListItem key={id}>
                            <Link to={`/songs/${display_name}/${id}`} onClick={() => playSong(track)}>
                            {track.album && track.album.images && track.album.images[0] && (
                            <SongImage src={track.album.images[0].url} alt={track.album.name} />
                            )}
                            <SongInfo>
                                <SongName>{name}</SongName>
                            </SongInfo>
                            </Link>
                        </SongListItem>
                        );
                    })}
                    </SongList>
                ) : (
                    <NoContentText>No tracks found.</NoContentText>
                )}                    
                </Album>
                </>
            )}                
            </AlbumContainer>

            </>
        );
    }

const Album = styled.div`

display: flex;
flex-direction: column;
width: 100%;
margin-top: 30px;
margin-bottom: 100px;

`

const AlbumContainer = styled.div`

display: flex;

`

const SongImage = styled.img`

width: 100px;
height: 100px;


`

const SongInfo = styled.h4`



`

const ArtistName = styled.h1`

color: white;
text-align: center;
margin-bottom: 5em;

`

const Link = styled(NavLink)`
    color: #fff;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
        color: white;
    }
    `;

const AlbumPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #282c34;
  color: #fff;
  min-height: 100vh;
`;

const AlbumImage = styled.img`
  display: block;
  margin: 0 auto 20px;
  width: 300px;
  height: 300px;
  object-fit: cover;
`;


const AlbumName = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
  color: white;
`;


const SectionTitle = styled.h2`
    font-size: 40px;
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 5em;
    color: white;
    text-align: center;
`;

const SongList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const SongListItem = styled.li`
    margin-top: 10px;
    text-align: center;
`;

const SongName = styled.span`
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
`;

const NoContentText = styled.p`
    font-size: 18px;
    font-style: italic;
    margin-top: 20px;
`;

const LoadingText = styled.p`
    font-size: 18px;
    font-style: italic;
    margin-top: 20px;
`;

export default AlbumPage