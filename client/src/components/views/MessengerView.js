import { Card, Grid } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Messages from "../Messages";
import Navbar from "../Navbar";
import UserMessengerEntries from "../UserMessengerEntries";
import { getConversations } from "../../api/messages";
import { isLoggedIn } from "../../helpers/authHelper";
import { useLocation } from "react-router-dom";

const MessengerView = () => {
  const [conservant, setConservant] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWindowWidth] = useState(0);
  const mobile = width < 800;
  const user = isLoggedIn();
  const { state } = useLocation();
  const newConservant = state && state.user;

  const getConversation = (conversations, conservantId) => {
    return conversations.find(
      (conversation) => conversation.recipient._id === conservantId
    );
  };

  const fetchConversations = async () => {
    if (!user) {
      console.error("User not logged in");
      setLoading(false);
      return; // Exit if the user is not logged in
    }
    
    try {
      let conversationsData = await getConversations(user);
      if (newConservant) {
        setConservant(newConservant);
        // Add new conversation if it does not exist
        if (!getConversation(conversationsData, newConservant._id)) {
          const newConversation = {
            _id: newConservant._id,
            recipient: newConservant,
            new: true,
            messages: [],
          };
          conversationsData = [newConversation, ...conversationsData];
        }
      }
      setConversations(conversationsData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false in any case
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
    };

    updateDimensions(); // Update width initially
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Render a loading indicator while loading
  if (loading) {
    return (
      <Container>
        <Navbar />
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <h2>Loading...</h2> {/* You can replace this with a spinner */}
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <Box>
        <Card sx={{ padding: 0 }}>
          <Grid
            container
            sx={{ height: "calc(100vh - 110px)" }}
            alignItems="stretch"
          >
            {!mobile ? (
              <>
                <Grid
                  item
                  xs={5}
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    height: "100%",
                  }}
                >
                  <UserMessengerEntries
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    loading={loading}
                  />
                </Grid>

                <Grid item xs={7} sx={{ height: "100%" }}>
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                  />
                </Grid>
              </>
            ) : !conservant ? (
              <Grid
                item
                xs={12}
                sx={{
                  borderRight: 1,
                  borderColor: "divider",
                  height: "100%",
                }}
              >
                <UserMessengerEntries
                  conservant={conservant}
                  conversations={conversations}
                  setConservant={setConservant}
                  loading={loading}
                />
                {/* This Messages component is hidden in mobile view if no conservant is selected */}
                <Box sx={{ display: "none" }}>
                  <Messages
                    conservant={conservant}
                    conversations={conversations}
                    setConservant={setConservant}
                    setConversations={setConversations}
                    getConversation={getConversation}
                  />
                </Box>
              </Grid>
            ) : (
              <Grid item xs={12} sx={{ height: "100%" }}>
                <Messages
                  conservant={conservant}
                  conversations={conversations}
                  setConservant={setConservant}
                  setConversations={setConversations}
                  getConversation={getConversation}
                  mobile
                />
              </Grid>
            )}
          </Grid>
        </Card>
      </Box>
    </Container>
  );
};

export default MessengerView;
