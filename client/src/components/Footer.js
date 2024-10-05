import { useTheme } from "@emotion/react";
import { Typography, Box } from "@mui/material";
import React from "react";

const Footer = () => {
  const theme = useTheme()
  return (
    <Box
      pb={3}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100%' }} // Optional: Ensures the Box takes full height
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: 'Caveat, cursive',
          textAlign: 'center' // Center the text within the Typography component
        }}
      >
         created by 
        <Typography 
        variant="h6"
         sx={{
          fontFamily: 'Caveat, cursive',
          color:theme.palette.text.secondary}}>

         Ahmed Essam
      </Typography>

    </Typography>
    </Box >
  );
};

export default Footer;
