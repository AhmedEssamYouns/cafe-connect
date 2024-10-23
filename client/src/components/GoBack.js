import { Typography, useTheme } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const GoBack = () => {
  const theme = useTheme();

  return (
    <Typography sx={{ mb: 2 }}>
      <Link
        to="/"
        style={{
          textDecoration: "none", // Remove underline
          color: theme.palette.primary.main, // Use a color from your theme or a custom one
          fontWeight: "bold", // Make the font bold
          transition: "color 0.3s", // Smooth color transition
        }}
        onMouseEnter={(e) => (e.target.style.color = "#115293")} // Darker shade on hover
        onMouseLeave={(e) => (e.target.style.color = theme.palette.primary.main)} // Revert to original color
      >
        &lt;&lt; Go back to posts
      </Link>
    </Typography>
  );
};

export default GoBack;
