import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { getRandomUsers } from "../api/users";
import Loading from "./Loading";
import UserEntry from "./UserEntry";
import HorizontalStack from "./util/HorizontalStack";

const FindUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getRandomUsers({ size: 5 });
    setLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClick = () => {
    fetchUsers();
  };




  return (
    <Card  className="sticky">
      <Stack spacing={2} >
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack>
            <AiOutlineUser />
            <Typography>Find Others</Typography>
          </HorizontalStack>
          <IconButton
            sx={{ padding: 0 }}
            disabled={loading}
            onClick={handleClick}
          >
            <MdRefresh />
          </IconButton>
        </HorizontalStack>

        <Divider />

        {loading ? (
          <Loading />
        ) : (
          users.length > 0 ? (
            users.map((user) => (
              <UserEntry username={user.username} avatar={user.avatar} key={user.username} />
            ))
          ) : (
            <Typography>No users found.</Typography>
          )
        )}
      </Stack>
    </Card>
  );
};

export default FindUsers;
