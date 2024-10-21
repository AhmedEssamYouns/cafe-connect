import { Avatar } from "@mui/material";
import React from "react";
import { BASE_URL } from "../config";
import UpdateAvatar from "./updateAvatar";
const UserAvatar = ({ avatarId, username, height, width }) => {
  const avatarUrl = avatarId
    ? `${BASE_URL}api/users/avatar/image/${avatarId}`
    : `https://robohash.org/${username}`;

  return (
    <>
      <Avatar
        sx={{
          height: height,
          width: width,
          backgroundColor: "lightgray",
        }}
        src={avatarUrl}
        alt={username}
      />
    </>
  );
};

export default UserAvatar;
