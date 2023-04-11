import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyle from './GlobalStyles.js';
import Home from "./Home.js";
import Profile from "./Profile.js";
import SongPage from "./SongPage.js";
import Library from "./Library.js";
import ArtistPage from "./ArtistPage.js";
import AlbumPage from "./AlbumPage.js";


const App = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  return (
    <>
    <GlobalStyle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setIsAuthorized={setIsAuthorized} />} />
        <Route path="/profile" element={<Profile isAuthorized={isAuthorized} />} />
        <Route path="/songs/:displayName/:songId" element={<SongPage/>} />
        <Route path="/library" element={<Library isAuthorized={isAuthorized}/>} />
        <Route path="/artist/:artistId" element={<ArtistPage/>} />
        <Route path="/albums/:albumId" element={<AlbumPage/>} />
      </Routes>
    </BrowserRouter>    
    </>
  );
};

export default App;