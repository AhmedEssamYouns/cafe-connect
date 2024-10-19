import { useTheme } from "@emotion/react";
import {
  Avatar,
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { AiFillHome, AiOutlineCoffee, AiFillMessage, AiOutlineSearch } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import { RiContrast2Line, RiSunFill } from "react-icons/ri";
import { getAllUsers } from '../api/users';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && user.username;
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(window.innerWidth);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchBoxWidth, setSearchBoxWidth] = useState(0);

  const searchInputRef = useRef(null); // Ref for the search input

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const updateSearchBoxWidth = () => {
      if (searchInputRef.current) {
        setSearchBoxWidth(searchInputRef.current.clientWidth);
      }
    };

    const resizeObserver = new ResizeObserver(updateSearchBoxWidth);

    if (searchInputRef.current) {
      resizeObserver.observe(searchInputRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (searchInputRef.current) {
        resizeObserver.unobserve(searchInputRef.current);
      }
    };
  }, [searchInputRef]); // Run this effect on mount or when the input reference changes

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?" + new URLSearchParams({ search }));
  };

  const handleSearchIcon = () => {
    setSearchIcon(!searchIcon);
  };

  const handleUserSelect = (user) => {
    navigate(`/users/${user.username}`);
    setSearch("");
    setFilteredUsers([]);
  };

  const mobile = width < 635;

  return (
    <Stack
      mb={1}
      sx={{
        px: 2,
        backgroundColor: theme.palette.background.stack,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        position: 'fixed',
        paddingBottom: 1,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pt: 1,
          pb: 0,
        }}
        spacing={!mobile ? 1 : 0}
      >
        <HorizontalStack>
          <AiOutlineCoffee
            size={30}
            color={theme.palette.primary.main}
            onClick={() => navigate("/")}
          />
          <Typography
            sx={{
              display: width < 535 ? "none" : "block",
              paddingTop: 1,
              fontFamily: 'Caveat, cursive',
            }}
            variant={width < 635 ? "h6" : "h5"}
            mr={0.5}
            color={theme.palette.primary.main}
          >
            CaféConnect
          </Typography>
        </HorizontalStack>

        {width >= 635 && (
          <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              label="Search..."
              value={search}
              onChange={handleChange}
              inputRef={searchInputRef} // Attach the ref to the input
              sx={{
                width: "100%",
                maxWidth: "600px",
                borderRadius: 16,
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: 16,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.dark,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiInputBase-input": {
                  padding: "6px 12px",
                },
              }}
            />
          </Box>
        )}

        <HorizontalStack>
          {mobile && (
            <IconButton onClick={handleSearchIcon}>
              <AiOutlineSearch />
            </IconButton>
          )}

          <IconButton component={Link} to={"/"}>
            <AiFillHome />
          </IconButton>
          {user ? (
            <>
              <IconButton component={Link} to={"/messenger"}>
                <AiFillMessage />
              </IconButton>
              <IconButton component={Link} to={"/users/" + username}>
                <UserAvatar width={28} height={28} username={user.username} />
              </IconButton>
              <Button size="small" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="text" size="small" href="/signup">
                Sign Up
              </Button>
              <Button variant="text" size="small" href="/login">
                Login
              </Button>
            </>
          )}
          <IconButton size="small">
            {darkMode ?
              <RiSunFill onClick={toggleDarkMode} /> :
              <RiContrast2Line onClick={toggleDarkMode} />}
          </IconButton>
        </HorizontalStack>
      </Stack>

      {mobile && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} mt={1}>
          <TextField
            size="small"
            label="Search..."
            fullWidth
            inputRef={searchInputRef}
            onChange={handleChange}
            value={search}
          />
        </Box>
      )}

      {width >= 635 && search && filteredUsers.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            alignSelf: 'center',
            top: 40,
            marginRight: 13,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            mt: 1,
            zIndex: 1000,
            width: searchBoxWidth || 'auto',
          }}
        >
          <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {filteredUsers.map(user => (
              <ListItem button key={user._id} onClick={() => handleUserSelect(user)}>
                <ListItemAvatar>
                  <UserAvatar username={user.username} width={30} height={30} />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {width <= 634 && search && searchIcon && filteredUsers.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            alignSelf: 'center',
            top: 100,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            mt: 1,
            zIndex: 1000,
            width: '98%',
          }}
        >
          <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {filteredUsers.map(user => (
              <ListItem button key={user._id} onClick={() => handleUserSelect(user)}>
                <ListItemAvatar>
                  <UserAvatar username={user.username} width={30} height={30} />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Stack>
  );
};

export default Navbar;
