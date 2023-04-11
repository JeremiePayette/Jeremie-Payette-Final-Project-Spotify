import styled from "styled-components";
import { PLAY, PAUSE, NEXT, PREVIOUS } from "./Variables";
import { FiPlay, FiPause, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useState } from "react";

const SongButtons = ({ isPlaying }) => {
    const [isPaused, setIsPause] = useState(false);
    const accessToken = localStorage.getItem('accessToken');

        const handlePlay = () => {
            fetch(PLAY, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((data) => {
                console.log("Play");
                setIsPause(false);
            })
            .catch((error) => console.error(error));
        };

        const handlePause = async () => {
            try {
            const response = await fetch(PAUSE, {
                method: 'PUT',
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Pause');
            setIsPause(true);
            } catch (error) {
            console.error(error);
            }
        };

        const handleNext = async () => {
            if (isPlaying) {
            return;
            }
            try {
            const response = await fetch(NEXT, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response.json());
            setIsPause(false);
            } catch (error) {
            console.error(error);
            }
        };


        const handlePrevious = async () => {
            try {
            const response = await fetch(PREVIOUS, {
                method: 'POST',
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log(response.json());
            setIsPause(false);
            } catch (error) {
            console.error(error);
            }
        };

    return (
        <>
        <ButtonContainer>
        <Button onClick={handlePrevious}><FiChevronLeft /></Button>
        <Button onClick={!isPaused ? handlePause : handlePlay}>
            {!isPaused ? <FiPause /> : <FiPlay />}
        </Button>
        <Button onClick={handleNext}><FiChevronRight /></Button>
        </ButtonContainer>
        </>
    );
    };

    const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Button = styled.button`
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 2rem;
    color: white;
    margin: 0 10px;
    transition: transform 0.2s ease-in-out;

    &:hover {
        transform: scale(1.2);
    }
`;

export default SongButtons;