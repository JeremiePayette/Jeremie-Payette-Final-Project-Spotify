import React, { useState } from 'react';
import styled from 'styled-components';
import { AiFillHome } from 'react-icons/ai';
import { IoSearchSharp, IoLibrarySharp } from 'react-icons/io5';
import SearchBar from './SearchBar';
import { NavLink } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };


  return (
    <>
      <Buttons>
        <Link to="/profile">
          <Button>
            <AiFillHome />
          </Button>
        </Link>
        <Button onClick={handleSearchClick}>
          <IoSearchSharp />
        </Button>
        <Link to="/library">
          <Button>
            <IoLibrarySharp />
          </Button>
        </Link>
        <Button onClick={handleLogout}><FiLogOut/></Button>
      </Buttons>
      {showSearchBar && <SearchBar />}
    </>
  );
};

const Link = styled(NavLink)`
  text-decoration: none;
  &:hover {
        text-decoration: underline;
        color: white;
    }
`;


const Button = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 10px;
  margin-right: 10px;
  font-size: 3em;

  &:hover,
  &:focus {
    color: grey;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 5em;
  background-color: black;
  margin: 20px;
`;


export default Sidebar;