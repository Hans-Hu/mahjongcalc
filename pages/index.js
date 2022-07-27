import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import { getSuitTiles, getHonorTiles, suits, honors } from '../src/mahjong/tileMapping';

export default function Index() {
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));

  const [seatWind, setSeatWind] = useState(null);
  const [roundWind, setRoundWind] = useState(null);
  const [dora, setDora] = useState([]);
  const [hand, setHand] = useState(Array(14).fill(null));


  const styles = {
    tileBackground: {
      background: `url("/tiles/front.svg") no-repeat`,
      backgroundSize: 'contain',
      width: '66px',
      height: '88px',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
    riichi: {
      width: '20em',
      height: '1.333em',
      borderRadius: '0.667em',
      background: '#ffffff'
    },
    emptyTile: {
      background: `url("/tiles/empty.svg") no-repeat`,
    }
  };

  const addTileFront = ({ src, alt }) => (
    <Box sx={styles.tileBackground}>
      <img height="66px" src={src} alt={alt} />
    </Box>
  );

  const overlapImg = (
    <Box sx={styles.tileBackground}>
      <img height="66px" src="/tiles/ton.svg" />
    </Box>
  )

  const emptyTile = (
    <Box sx={[styles.tileBackground, styles.emptyTile]}>
    </Box>
  );

  const selectionTiles = (
    <React.Fragment>
      <Grid item container direction="column" spacing={1}>
        {suits.map((suit, index) => (
          <Grid key={`${suit}${index}`} item container direction="row" spacing={1} justifyContent="center">
            {[1, 2, 3, 4, 5, 5, 6, 7, 8, 9].map((value, i) => (
              <Grid item key={`${value}${i}`}>
                {i === 5 ? addTileFront(getSuitTiles(suit, value, true)) : addTileFront(getSuitTiles(suit, value))}
              </Grid>
            ))}
          </Grid>
        ))}
        <Grid item container direction="row" spacing={1} justifyContent="center">
          {honors.map((tile, index) => (
            <Grid item key={`${tile}${index}`}>
              {addTileFront(getHonorTiles(tile))}
            </Grid>
          ))}
        </Grid>
      </Grid>
    </React.Fragment>
  )

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container direction="column">
          <Grid item container direction="row" justifyContent="space-between">
            <Grid item>
              <Grid item container direction="row" spacing={4}>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h2" sx={{ mb: 2 }}>Seat</Typography>
                  {seatWind === null ? emptyTile : seatWind}
                </Grid>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h2" sx={{ mb: 2 }}>Round</Typography>
                  {roundWind === null ? emptyTile : roundWind}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item container direction="column">
                <Typography variant="h2" align="center" sx={{ mb: 2 }}>Dora/Uradora</Typography>
                <Grid item container direction="row" spacing={1} justifyContent="center">
                  <Grid item>
                    {dora.length === 0 ? emptyTile : dora}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h1" align="center">Hand</Typography>
          </Grid>
          <Grid item container spacing={1}>
            {hand.map((tile, index) => (
              <Grid item key={`${tile}${index}`} sx={{ ml: index === 13 & !matchesMD ? 'auto' : undefined }}>
                {tile === null ? emptyTile : tile}
              </Grid>
            ))}
          </Grid>
          <Grid item sx={{ my: 4 }} align="center">
            <Box sx={styles.riichi}>
              <Typography variant="h1" align="center" sx={{ color: '#e31a1c', fontSize: '2rem', lineHeight: '0.667em' }}>•</Typography>
            </Box>
          </Grid>
          {selectionTiles}
        </Grid>
      </Box>
    </Container>
  );
}
