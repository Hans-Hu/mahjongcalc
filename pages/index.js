import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import { getSuitTiles, getHonorTiles, suits, honors } from '../src/mahjong/tileMapping';
import Button from '@mui/material/Button';

export default function Index() {
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));

  const [seatWind, setSeatWind] = useState(null);
  const [roundWind, setRoundWind] = useState(null);
  const [dora, setDora] = useState([]);
  const [hand, setHand] = useState(Array(13).fill(null));
  const [winningTile, setWinningTile] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(0); // 0 - seat, 1 - round, 2 - dora, 3 - hand


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
    },
    selectedTile: {
      filter: "invert(48%) sepia(86%) saturate(359%) hue-rotate(84deg) brightness(94%) contrast(91%)"
    }
  };

  const addTileFront = ({ src, alt }) => (
    <Box key={src} sx={styles.tileBackground}>
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

  const selectedEmptyTile = (
    <Box sx={[styles.tileBackground, styles.emptyTile, styles.selectedTile]}>
    </Box>
  );

  const onSelectionTileClick = (tile) => {
    switch (selectedIndex) {
      case 0:
        setSeatWind(tile);
        if (roundWind === null) {
          setSelectedIndex(1);
        } else if (dora.length < 8) {
          setSelectedIndex(2);
        } else if (hand.filter(tile => tile === null).length > 0) {
          setSelectedIndex(3);
        } else {
          setSelectedIndex(4);
        }
        break;
      case 1:
        setRoundWind(tile);
        if (dora.length < 8) {
          setSelectedIndex(2);
        } else if (hand.filter(tile => tile === null).length > 0) {
          setSelectedIndex(3);
        } else if (winningTile === null) {
          setSelectedIndex(4);
        } else {
          setSelectedIndex(5);
        }
        break;
      case 2:
        if (dora.length < 8) {
          if (dora.length === 7 && hand.filter(tile => tile === null).length > 0) {
            setSelectedIndex(3);
          }
          setDora([...dora, tile]);
        } else if (hand.filter(tile => tile === null).length > 0) {
          setSelectedIndex(3);
        } else if (winningTile === null) {
          setSelectedIndex(4);
        } else {
          setSelectedIndex(5);
        }
        break;
      case 3:
        if (hand.filter(tile => tile === null).length > 0) {
          if (hand.filter(tile => tile === null).length === 1) {
            if (winningTile === null) {
              setSelectedIndex(4);
            } else {
              setSelectedIndex(5);
            }
          }
          let index = hand.indexOf(null);
          const sorted = [...hand.slice(0, index), tile, ...hand.splice(index + 1)].sort((a, b) => (b?.key < (a?.key ?? String.fromCodePoint(0x10ffff))) ? 1 : -1);
          setHand(sorted);

        } else if (winningTile === null) {
          setSelectedIndex(4);
        } else {
          setSelectedIndex(5);
        }
        break;
      case 4:
        setWinningTile(tile);
        setSelectedIndex(5);
        break;
      default:
        break;
    }
  }

  // use useEffect to update the ui with selected tile box, if selected === 2, delete dora clicked on and set selected to last tile

  useEffect(() => {
    console.log(selectedIndex);
    // also use this to set the disabled prop for selectionTile button
    switch (selectedIndex) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      default:
        break;
    }
  }, [selectedIndex])

  const selectionTiles = (
    <React.Fragment>
      <Grid item container direction="column" spacing={1}>
        {suits.map((suit, index) => (
          <Grid key={`${suit}${index}`} item container direction="row" spacing={1} justifyContent="center">
            {[1, 2, 3, 4, 5, 5, 6, 7, 8, 9].map((value, i) => (
              <Grid item key={`${value}${i}`}>
                <Button disabled={selectedIndex <= 1} sx={{ padding: 0, opacity: selectedIndex <= 1 ? 0.7 : 1 }} onClick={() => onSelectionTileClick(i === 5 ? addTileFront(getSuitTiles(suit, value, true)) : addTileFront(getSuitTiles(suit, value)))}>
                  {i === 5 ? addTileFront(getSuitTiles(suit, value, true)) : addTileFront(getSuitTiles(suit, value))}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}
        <Grid item container direction="row" spacing={1} justifyContent="center">
          {honors.map((tile, index) => (
            <Grid item key={`${tile}${index}`}>
              <Button disabled={selectedIndex <= 1 && (tile[0] === 'g' || tile[0] === 'r' || tile[1] === 'h')} sx={{ padding: 0, opacity: selectedIndex <= 1 && (tile[0] === 'g' || tile[0] === 'r' || tile[1] === 'h') ? 0.7 : 1 }} onClick={() => onSelectionTileClick(addTileFront(getHonorTiles(tile)))}>
                {addTileFront(getHonorTiles(tile))}
              </Button>
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
                  <Button sx={{ padding: 0 }} onClick={() => { setSeatWind(null); setSelectedIndex(0); }}>
                    {seatWind === null ? selectedIndex === 0 ? selectedEmptyTile : emptyTile : seatWind}
                  </Button>
                </Grid>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h2" sx={{ mb: 2 }}>Round</Typography>
                  <Button sx={{ padding: 0 }} onClick={() => { setRoundWind(null); setSelectedIndex(1); }}>
                    {roundWind === null ? selectedIndex === 1 ? selectedEmptyTile : emptyTile : roundWind}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item container direction="column">
                <Typography variant="h2" align="center" sx={{ mb: 2 }}>Dora/Uradora</Typography>
                <Grid item container direction="row" spacing={1} justifyContent="center">
                  {dora.map((tile, index) => (
                    <Grid item key={`${tile}${index}`}>
                      <Button sx={{ padding: 0 }} onClick={() => { setSelectedIndex(2); setDora(dora.filter((_, i) => i !== index)) }}>
                        {tile}
                      </Button>
                    </Grid>
                  ))}
                  {dora.length === 8 ? null :
                    <Grid item>
                      <Button sx={{ padding: 0 }} onClick={() => setSelectedIndex(2)}>
                        {selectedIndex === 2 ? selectedEmptyTile : emptyTile}
                      </Button>
                    </Grid>
                  }
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
                <Button sx={{ padding: 0 }} onClick={() => { setSelectedIndex(3); setHand([...hand.filter((_, i) => i !== index), null]) }}>
                  {tile === null ? selectedIndex === 3 && hand.filter(t => t !== null).length === index ? selectedEmptyTile : emptyTile : tile}
                </Button>
              </Grid>
            ))}
            <Grid item sx={{ ml: matchesMD ? undefined : 'auto' }}>
              <Button sx={{ padding: 0 }} onClick={() => { setWinningTile(null); setSelectedIndex(4);}}>
                {winningTile === null ? selectedIndex === 4 ? selectedEmptyTile : emptyTile : winningTile}
              </Button>
            </Grid>
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
