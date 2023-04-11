import styled from "styled-components";
import { handleAuthorization } from "./Authorization";
import { useEffect } from "react";
import { getReturnedParamsSpotify } from "./Authorization";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthorized } ) => {

  const navigate = useNavigate()

  useEffect(() => {
    const access_token = localStorage.getItem("accessToken");
    if (access_token) {
      setIsAuthorized(true);
    }

    if (window.location.hash) {
      const { access_token, expires_in, token_type } = getReturnedParamsSpotify(
        window.location.hash
      );
      
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("token_type", token_type);
      localStorage.setItem("expires_in", expires_in);
      
      setIsAuthorized(true);
    }
  }, [setIsAuthorized]);

  if(setIsAuthorized){

    navigate("profile")

  }


  return (
    <HomeContainer>
      <HomeTitle>Welcome to My Spotify App!</HomeTitle>
        <>
          <P>Please authorize your Spotify account to get started.</P>
          <AuthButton onClick={handleAuthorization}>Authorize</AuthButton>
        </>
    </HomeContainer>
  );
};

const P = styled.p`


color: white;

`

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
  font-family: "Helvetica Neue", sans-serif;
`;

const HomeTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #fff;
`;

const AuthButton = styled.button`
  margin-top: 2rem;
  background-color: #1db954;
  color: #fff;
  font-size: 1rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    background-color: #1ed760;
  }
`;

export default Home;