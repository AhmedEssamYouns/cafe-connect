import React, { useEffect, useState } from "react";
import { CssBaseline, ThemeProvider, Box, useMediaQuery } from "@mui/material"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme"; 
import PostView from "./components/views/PostView";
import CreatePostView from "./components/views/CreatePostView";
import ProfileView from "./components/views/ProfileView";
import LoginView from "./components/views/LoginView";
import SignupView from "./components/views/SignupView";
import ExploreView from "./components/views/ExploreView";
import PrivateRoute from "./components/PrivateRoute";
import SearchView from "./components/views/SearchView";
import MessengerView from "./components/views/MessengerView";
import Navbar from "./components/Navbar"; 
import { initiateSocketConnection } from "./helpers/socketHelper";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useMediaQuery("(max-width: 634px)"); 

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    console.log("Loaded dark mode:", savedMode); // Debug log
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

  useEffect(() => {
    initiateSocketConnection();
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Box sx={{ pt: isMobile ? 15 : 10 }}>
          <Routes>
            <Route path="/" element={<ExploreView />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/posts/create" element={<PrivateRoute><CreatePostView /></PrivateRoute>} />
            <Route path="/messenger" element={<PrivateRoute><MessengerView /></PrivateRoute>} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/users/:id" element={<ProfileView />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignupView />} />
            {/* Add a catch-all route for 404 */}
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
