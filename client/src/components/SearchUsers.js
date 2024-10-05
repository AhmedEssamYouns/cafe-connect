import React, { useState, useEffect } from "react";
import { TextField, List, ListItem, Button, Typography, Box } from "@mui/material";
import { getRandomUsers } from "../api/users";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [visibleResults, setVisibleResults] = useState(5);

  // Fetch random users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = { limit: 10 }; // Adjust query parameters as needed
        const users = await getRandomUsers(query);
        
        // Log all usernames to verify they are being fetched correctly
        console.log("Usernames:", users.map((user) => user.username));
        
        // Set filtered users to all users initially
        setFilteredUsers(users);
      } catch (err) {
        console.log("Error fetching users: ", err);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      return; // If the search query is empty, return early
    }

    const filtered = filteredUsers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setVisibleResults(5); // Reset visible results when a new search is triggered
  }, [searchQuery]);

  const handleLoadMore = () => {
    setVisibleResults((prevVisible) => prevVisible + 5);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setVisibleResults(5);
  };

  return (
    <Box>
      {/* Search Input */}
      <TextField
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search users..."
        variant="outlined"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      {/* User Results List */}
      {filteredUsers.length > 0 ? (
        <List>
          {filteredUsers.slice(0, visibleResults).map((user, index) => (
            <ListItem key={index}>
              <Typography>{user.username}</Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        searchQuery && <Typography>No users found by this username.</Typography> // Show message if no users found
      )}

      {/* Show View More button if there are more results */}
      {visibleResults < filteredUsers.length && (
        <Button onClick={handleLoadMore} variant="text">
          View More
        </Button>
      )}

      {/* Clear Button */}
      {searchQuery && (
        <Button onClick={handleClearSearch} color="secondary" sx={{ mt: 2 }}>
          Clear Search
        </Button>
      )}
    </Box>
  );
};

export default UserSearch;
