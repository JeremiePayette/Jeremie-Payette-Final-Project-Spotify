import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const ArtistPage = () => {
    const [artist, setArtist] = useState({});
    const [topSongs, setTopSongs] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [images, setImages] = useState([]);
    const [songImages, setSongImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const display_name = localStorage.getItem("displayName")


    const accessToken = localStorage.getItem("accessToken");
    const { artistId } = useParams();

    useEffect(() => {
        console.log("Fetching artist data...");
        const fetchData = async () => {
        try {
            const artistResponse = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}`,
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            const artistData = await artistResponse.json();
            console.log("Artist data:", artistData);
            setArtist(artistData);
            setImages(artistData.images);

            const topTracksResponse = await fetch(
            `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
            {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            }
            );
            const topTracksData = await topTracksResponse.json();
            console.log("Top tracks data:", topTracksData);
            setTopSongs(topTracksData.tracks);

            const albumsResponse = await fetch(
                `https://api.spotify.com/v1/artists/${artistId}/albums?market=US&include_groups=album`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const albumsData = await albumsResponse.json();
            console.log("Albums data:", albumsData);
            setAlbums(albumsData.items);

            const songImagePromises = topTracksData.tracks.map(async (track) => {
            const trackResponse = await fetch(
                `https://api.spotify.com/v1/tracks/${track.id}`,
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                }
            );
            const trackData = await trackResponse.json();
            return trackData.album.images[0];
            });

            const songImages = await Promise.all(songImagePromises);
            setSongImages(songImages);

            setIsLoading(false);
            console.log("Finished fetching data.");
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [artistId, accessToken]);

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
            <ArtistPageContainer>
            <Sidebar/>
            <ArtistPageInfo>
                {images.length > 0 && <ArtistImage src={images[0].url} alt={artist.name} />}
                <ArtistName>{artist.name}</ArtistName>
                {isLoading ? (
                <LoadingText>Loading...</LoadingText>
                ) : (
                <>
                    <SectionTitle>Top Songs</SectionTitle>
                    {topSongs.length > 0 ? (
                    <SongList>
                        {topSongs.map((song, index) => {
                        const { id, name } = song;
                        return (
                            <SongListItem key={id}>
                            <Link to={`/songs/${display_name}/${id}`} onClick={() => playSong(song)}>
                                {songImages[index] && <SongImage src={songImages[index].url} alt={name} />}
                                <SongName>{name}</SongName>
                            </Link>
                            </SongListItem>
                        );
                        })}
                    </SongList>
                    ) : (
                    <NoContentText>No top songs found.</NoContentText>
                    )}
        
                    <SectionTitle>Albums</SectionTitle>
                    {albums.length > 0 ? (
                    <AlbumList>
                        {albums.map((album) => {
                        const { id, name, images } = album;
                        return (
                            <Link to={`/albums/${id}`} key={id}>
                            <AlbumListItem>
                                {images.length > 0 && <AlbumImage src={images[0].url} alt={name} />}
                                <AlbumName>{name}</AlbumName>
                            </AlbumListItem>
                            </Link>
                        );
                        })}
                    </AlbumList>
                    ) : (
                    <NoContentText>No albums found.</NoContentText>
                    )}
                </>
                )}
            </ArtistPageInfo>
            </ArtistPageContainer>
        );
    };
        
        const NoContentText = styled.h2`
        
        color: white;
        
        `

        const Link = styled(NavLink)`
        
        text-decoration: none;
        color: grey;
        &:hover {
        text-decoration: underline;
        color: white;
    }
        
        `
    
        const ArtistPageContainer = styled.div`
            display: flex;
            margin-top: 50px;
            color: #333;
            width: 100%;
        `;
        
        const ArtistPageInfo = styled.div`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
        `;
        
        const ArtistImage = styled.img`
            max-width: 100%;
            height: auto;
            margin-bottom: 30px;
        `;
        
        const ArtistName = styled.h1`
            font-size: 2.5rem;
            margin-bottom: 30px;
        `;
        
        const LoadingText = styled.p`
            font-size: 1.5rem;
            margin-top: 30px;
        `;
        
        const SectionTitle = styled.h2`
            font-size: 1.8rem;
            margin-top: 40px;
            margin-bottom: 20px;
        `;
        
        const SongList = styled.ul`
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        `;
        
        const SongListItem = styled.li`
            margin: 20px;
            text-align: center;
        `;
        
        const SongImage = styled.img`

            height: 150px;
            width: 150px;
        `;
        
        const SongName = styled.p`
            font-size: 1.2rem;
            margin-top: 10px;
            width: 150px;
        `;
        
        const AlbumList = styled.ul`
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        `;
        
        const AlbumListItem = styled.li`
            margin: 20px;
            text-align: center;
        `;
        
        const AlbumImage = styled.img`
            height: 150px;
            width: 150px;
        `;
        
        const AlbumName = styled.p`
            font-size: 1.2rem;
            margin-top: 10px;
            width: 150px;
        `;

export default ArtistPage;