import { Container, Stack, Typography, Button, Card, CardContent, CardActionArea, CardActions } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import { getUserById } from "../../api/users";
import { isLoggedIn } from "../../helpers/authHelper";
import PostBrowser from "../PostBrowser";
import Profile from "../Profile";
import Sidebar from "../Sidebar";
import Loading from "../Loading";
import GridLayoutScreen from "../GridViewScreen";
import FindUsers from "../FindUsers";

const ExploreView = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const user = isLoggedIn();
  const fetchUser = useCallback(async () => {
    if (user) {
        setLoading(true);
        const cachedUser = sessionStorage.getItem(`user_${user.username}`);

        if (cachedUser) {
            setProfile(JSON.parse(cachedUser));
            setLoading(false);
            return; // Use cached data
        }

        try {
            const data = await getUserById(user.username);
            if (data && !data.error) {
                setProfile(data);
                sessionStorage.setItem(`user_${user.username}`, JSON.stringify(data)); // Cache the user data
            } else {
                setError(data.error || "User data is not available.");
            }
        } catch (err) {
            setError(`Failed to fetch user data. ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
}, [user]);

  // Fetch user data on component mount and when `user` changes
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;

    const validationError = validate(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setProfile({ ...profile, user: { ...profile.user, biography: content } });
    setEditing(false);
  };

  const handleEditing = () => {
    setEditing(!editing);
  };

  const validate = (content) => {
    if (content.length > 250) {
      return "Bio cannot be longer than 250 characters";
    }
    return "";
  };

  return (
    <Container>
      <GridLayoutScreen
        left={
          <Stack spacing={2} style={{ position: 'relative' }}>
            {user ? (
              <>
                {profile ? (
                  <>
                    <Profile
                      profile={profile}
                      editing={editing}
                      handleSubmit={handleSubmit}
                      handleEditing={handleEditing}
                      handleMessage={() => null} // Placeholder function
                      validate={validate}
                    />
                    <FindUsers />
                  </>
                ) : (
                  <Loading label="Loading profile data..." />
                )}
              </>
            ) : (
              <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2} alignItems="center">
                    <Typography variant="h6" align="center">
                      Please log in to view your profile.
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions>
                  <Stack spacing={2} alignItems="center" width="100%">
                    <Button variant="contained" onClick={() => (window.location.href = '/login')} fullWidth>
                      Go to Login
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            )}
          </Stack>
        }
        center={
          <>
            <PostBrowser createPost contentType="posts" />
          </>
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExploreView;
