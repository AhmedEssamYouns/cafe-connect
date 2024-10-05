import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Copyright = () => {
  return (
    <Typography variant="subtitle1" color="text.secondary">
      Copyright © 2022{" "}
      <Link to="/" color="inherit" style={{
              fontFamily: 'Caveat, cursive',
      }}>
        CaféConnect
      </Link>
    </Typography>
  );
};

export default Copyright;
