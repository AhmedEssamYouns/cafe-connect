import { Grid, useMediaQuery } from "@mui/material";
import React from "react";

const GridLayoutScreen = (props) => {
  const { left, center, right } = props; 
  const isMobile = useMediaQuery("(max-width: 634px)"); 
  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={2.5}
        sx={{
          display: { xs: "none", sm: "none", custom: "block" }, 
        }}
      >
        {left}
      </Grid>
      <Grid
        item
        xs={12}
        md={6.5}
        sx={{
          mx: "auto", 
          paddingLeft:isMobile?1:5,
          paddingRight:isMobile?1:5,
          justifyContent: "center", 
        }}
      >
        {center}
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          display: { xs: "none", sm: "none", custom: "block" }, 
        }}
      >
        {right}
      </Grid>
    </Grid>
  );
};

export default GridLayoutScreen;
