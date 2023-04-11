import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { BiLike, BiDislike } from "react-icons/bi";

const MongoButtons = () => {
    const { songId } = useParams();
    const access_token = localStorage.getItem("accessToken");
    const display_name = localStorage.getItem("displayName");
    const [songData, setSongData] = useState(null);


    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const response = await fetch(`/api/get-disliked-songs/${display_name}`, {
                    method: "GET",
                });
                if (response.ok) {
                    const data = await response.json();
                    setSongData(data);
                } else {
                    console.error(response);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSongData();
    }, [display_name]);


    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/delete-song/${display_name}/${songId}`, {
                method: "DELETE",
            });
            if (response.ok) {
            } else {
                console.error(response);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        try {
            const response1 = await fetch(`https://api.spotify.com/v1/tracks/${songId}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            if (!response1.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response1.json();
            const response2 = await fetch(`/api/add-song/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    track: data,
                    displayname: display_name
                })
            });
            if (response2.ok) {
            } else {
                console.error("ERROR", response2);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const songExists = songData && songData.data.find(song => song._id === songId);



    return (
        <Button>
            {songExists ? (
                <BiLike onClick={handleDelete}/>
            ) : (
                <BiDislike onClick={handleAdd}/>
            )}
        </Button>
    );
};

const Button = styled.button`
    margin-top: 10px;
    background-color: black;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 30px;
    padding: 8px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;

    &:hover {
        background-color: lightgrey;
        color: black;
    }

`;


export default MongoButtons;