import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";

export default function Trainer() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));


  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h1">TBA</Typography>
        {/*<Grid container direction="column">
          <Grid item container direction="row" justifyContent="space-between">
            <Grid item>
              <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 2 : 2 : 4}>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h1" sx={{ mb: 2 }}>Seat</Typography>
                </Grid>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h1" sx={{ mb: 2 }}>Round</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item container direction="column">
                <Typography variant="h1" align="center" sx={{ mb: 2 }}>Dora/Uradora</Typography>
                <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent="center">
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        */}
      </Box>
    </Container>
  )
}
