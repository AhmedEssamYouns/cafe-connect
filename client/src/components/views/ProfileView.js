import { Card, Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getUser, updateUser } from "../../api/users";
import { isLoggedIn } from "../../helpers/authHelper";
import CommentBrowser from "../CommentBrowser";
import ErrorAlert from "../ErrorAlert";
import FindUsers from "../FindUsers";
import Footer from "../Footer";
import GoBack from "../GoBack";
import GridLayout from "../GridLayout";
import Loading from "../Loading";
import MobileProfile from "../MobileProfile";
import Navbar from "../Navbar";
import PostBrowser from "../PostBrowser";
import Profile from "../Profile";
import ProfileTabs from "../ProfileTabs";

const ProfileView = () => {
    const currentUser = isLoggedIn()
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [tab, setTab] = useState("posts");
    const user = isLoggedIn();
    const [error, setError] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    const fetchUser = async () => {
        setLoading(true);
        
        // Check if we have cached user data
        const cachedUser = sessionStorage.getItem(`user_${params.userId}`);
        if (cachedUser) {
          const parsedUser = JSON.parse(cachedUser);
          if (parsedUser.username === currentUser.username) {
            setProfile(parsedUser);
            setLoading(false);
            return;
          }
        }
        
        
        const data = await getUser(params);
        setLoading(false);
        if (data.error) {
            setError(data.error);
        } else {
            setProfile(data);
            // Cache the user data
            sessionStorage.setItem(`user_${params.userId}`, JSON.stringify(data));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const content = e.target.content.value;

        await updateUser(user, { biography: content });

        setProfile({ ...profile, user: { ...profile.user, biography: content } });
        setEditing(false);
    };

    const handleEditing = () => {
        setEditing(!editing);
    };

    const handleMessage = () => {
        navigate("/messenger", { state: { user: profile.user } });
    };

    useEffect(() => {
        // Fetch user immediately on mount
        fetchUser();
    }, [params]); // Fetch user when params change

    const validate = (content) => {
        let error = "";

        if (content.length > 250) {
            error = "Bio cannot be longer than 250 characters";
        }

        return error;
    };

    let tabs;
    if (profile) {
        tabs = {
            posts: (
                <PostBrowser
                    profileUser={profile.user}
                    contentType="posts"
                    key="posts"
                />
            ),
            liked: (
                <PostBrowser
                    profileUser={profile.user}
                    contentType="liked"
                    key="liked"
                />
            ),
            comments: <CommentBrowser profileUser={profile.user} />,
        };
    }

    return (
        <Container>
            <GridLayout
                left={
                    <>
                        <MobileProfile
                            profile={profile}
                            editing={editing}
                            handleSubmit={handleSubmit}
                            handleEditing={handleEditing}
                            handleMessage={handleMessage}
                            validate={validate}
                        />
                        <Stack spacing={2}>
                            {profile ? (
                                <>
                                    <ProfileTabs tab={tab} setTab={setTab} />
                                    {tabs[tab]}
                                </>
                            ) : (
                                <Loading />
                            )}
                            {error && <ErrorAlert error={error} />}
                        </Stack>
                    </>
                }
                right={
                    <Stack spacing={2}>
                        <Profile
                            setProfile={setProfile}
                            profile={profile}
                            editing={editing}
                            handleSubmit={handleSubmit}
                            handleEditing={handleEditing}
                            handleMessage={handleMessage}
                            validate={validate}
                        />
                        <FindUsers />
                    </Stack>
                }
            />
        </Container>
    );
};

export default ProfileView;
