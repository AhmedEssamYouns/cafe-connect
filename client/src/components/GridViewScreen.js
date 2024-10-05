import { Grid } from "@mui/material";
import React from "react";

const GridLayoutScreen = (props) => {
  const { left, center, right } = props; // Destructure left, center, and right from props

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={2.5}
        sx={{
          display: { xs: "none", sm: "none", custom: "block" }, // Hide on screens < 1070px
        }}
      >
        {left}
      </Grid>
      <Grid
        item
        xs={12}
        md={6.5}
        sx={{
          mx: "auto", // Center the item horizontally
          paddingLeft:5,
          paddingRight:5,
          justifyContent: "center", // Center content when width is < 1070px
        }}
      >
        {center}
      </Grid>
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          display: { xs: "none", sm: "none", custom: "block" }, // Hide on screens < 1070px
        }}
      >
        {right}
      </Grid>
    </Grid>
  );
};

export default GridLayoutScreen;
