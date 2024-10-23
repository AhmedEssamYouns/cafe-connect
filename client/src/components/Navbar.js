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
  useMediaQuery,
  Popover,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { AiFillHome, AiOutlineCoffee, AiFillMessage, AiOutlineSearch, AiOutlineLogout, AiOutlineMenu, AiOutlineUser } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import { RiContrast2Line, RiSunFill, RiUser2Fill, RiUser3Fill } from "react-icons/ri";
import { getAllUsers, getUser } from '../api/users';

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
  const searchListRef = useRef(null);


  const handleClickOutside = (event) => {
    // Check if the click is outside the search input and the search list
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target) &&
      searchListRef.current &&
      !searchListRef.current.contains(event.target)
    ) {
      setFilteredUsers([]); // Close the search list
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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

    return () => {
      if (searchInputRef.current) {
        resizeObserver.unobserve(searchInputRef.current);
      }
    };
  }, [searchInputRef]);

  const handleLogout = async () => {
    handleMenuClose()
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
    setSearch("");
    setFilteredUsers([]);
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
  const isMobile = useMediaQuery("(max-width: 634px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopover = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlur = () => {
    setFilteredUsers([]);
  };

  const handleFocus = () => {
    if (search) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

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
              onFocus={handleFocus}
              size="small"
              label="Search..."
              value={search}
              onChange={handleChange}
              inputRef={searchInputRef}
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
                <RiUser3Fill />
              </IconButton>
              {isMobile ? (
                <>
                  <IconButton onClick={handleMenuOpen}>
                    <AiOutlineMenu size={24} />
                  </IconButton>
                  <Popover
                    open={openPopover}
                    anchorEl={anchorEl}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  >
                    <List>
                      <ListItem button onClick={toggleDarkMode}>
                        {darkMode ?
                          <RiSunFill style={{ marginRight: 8 }} /> :
                          <RiContrast2Line style={{ marginRight: 8 }} />}
                        <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
                      </ListItem>
                      <ListItem button onClick={handleLogout}>
                        <AiOutlineLogout style={{ marginRight: 8 }} />
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </List>
                  </Popover>
                </>
              ) : (
                <>
                  <Button size="small" onClick={handleLogout}>Logout</Button>
                  <IconButton size="small" onClick={darkMode ? toggleDarkMode : toggleDarkMode}>
                    {darkMode ?
                      <RiSunFill /> :
                      <RiContrast2Line />
                    }
                  </IconButton>
                </>
              )}
            </>
          ) : (
            <>
              <Button variant="text" size="small" href="/signup">
                Sign Up
              </Button>
              <Button variant="text" size="small" href="/login">
                Login
              </Button>
              <IconButton size="small" onClick={darkMode ? toggleDarkMode : toggleDarkMode}>
                {darkMode ?
                  <RiSunFill /> :
                  <RiContrast2Line />
                }
              </IconButton>

            </>
          )}


        </HorizontalStack>
      </Stack>

      {mobile && searchIcon && (
        <Box component="form" onSubmit={handleSubmit} mt={1}>
          <TextField
            onFocus={handleFocus}
            size="small"
            label="Search..."
            fullWidth
            style={{ display: !searchIcon ? "none" : 'flex' }}
            inputRef={searchInputRef}
            onChange={handleChange}
            value={search}
          />
        </Box>
      )}

      {width >= 635 && search && filteredUsers.length > 0 && (
        <Box
          ref={searchListRef}
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
                  <UserAvatar username={user.username} avatarId={user.avatar} width={30} height={30} />
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {width <= 634 && search && searchIcon && filteredUsers.length > 0 && (
        <Box
          ref={searchListRef}
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
                  <UserAvatar username={user.username} avatarId={user.avatar} width={30} height={30} />
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
