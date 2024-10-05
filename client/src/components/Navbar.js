import { useTheme } from "@emotion/react";
import {
  Avatar,
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Switch,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import {
  AiFillBook,
  AiFillHome,
  AiOutlineCoffee,
  AiFillMessage,
  AiOutlineSearch,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logoutUser } from "../helpers/authHelper";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";
import { RiContrast2Line, RiSunFill, } from "react-icons/ri";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const user = isLoggedIn();
  const theme = useTheme();
  const username = user && isLoggedIn().username;
  const [search, setSearch] = useState("");
  const [searchIcon, setSearchIcon] = useState(false);
  const [width, setWindowWidth] = useState(window.innerWidth); // Set initial window width

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobile = width < 635;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search?" + new URLSearchParams({ search }));
  };

  const handleSearchIcon = () => {
    setSearchIcon(!searchIcon);
  };

  return (
    <Stack
      mb={1}
      sx={{
        px: 2,
        backgroundColor: theme.palette.background.stack,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        position: 'fixed', // Make navbar fixed
        top: 0, // Position it at the top
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure it stays above other content
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

        {/* Center the search box, only render if not mobile */}
        {width >= 635 && ( // Show the search box only on larger screens
          <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              label="Search for posts..."
              value={search}
              onChange={handleChange}
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
            label="Search for posts..."
            fullWidth
            onChange={handleChange}
            value={search}
          />
        </Box>
      )}
    </Stack>
  );
};

export default Navbar;
