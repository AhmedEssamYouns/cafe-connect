import { Avatar, Typography } from "@mui/material";
import React from "react";
import HorizontalStack from "./util/HorizontalStack";
import Moment from "react-moment";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";

const ContentDetails = ({ username, createdAt, edited, preview,avatar }) => {
  return (
    <HorizontalStack sx={{}}>
      <UserAvatar width={30} height={30} avatarId={avatar} username={username} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Typography
          component={Link} 
          to={`/users/${username}`}
          sx={{
            color: "primary.main", 
            textDecoration: "none",
            '&:hover': {
              color: "primary.dark",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {username}
        </Typography>
        {!preview && (
          <>
            {" "}· <Moment fromNow>{createdAt}</Moment>{" "}
            {edited && <>(Edited)</>}
          </>
        )}
      </Typography>
    </HorizontalStack>
  );
};

export default ContentDetails;
