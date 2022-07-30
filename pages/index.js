import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import { getSuitTiles, getHonorTiles } from '../src/mahjong/tileMapping';
import {suits, honors} from '../src/mahjong/tile';
import Button from '@mui/material/Button';

export default function Index() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

  const [seatWind, setSeatWind] = useState(null);
  const [roundWind, setRoundWind] = useState(null);
  const [dora, setDora] = useState([]);
  const [hand, setHand] = useState(Array(13).fill(null));
  const [winningTile, setWinningTile] = useState(null);
  const [riichiDeclared, setRiichiDeclared] = useState(1);

  const [selectedIndex, setSelectedIndex] = useState(0); // 0 - seat, 1 - round, 2 - dora, 3 - hand


  const styles = {
    tileBackground: {
      background: `url("/tiles/front.svg") no-repeat`,
      backgroundSize: 'contain',
      width: '66px',
      height: '88px',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      [theme.breakpoints.between("sm", "lg")]: {
        width: '5.5vw',
        height: '7.33vw'
      },
      [theme.breakpoints.down("sm")]: {
        width: '33px',
        height: '44px'
      }
    },
    riichi: {
      width: '20em',
      height: '1.333em',
      borderRadius: '0.667em',
      background: '#ffffff',
      opacity: riichiDeclared > 0 ? 1 : 0.6
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
      <img height="75%" src={src} alt={alt} />
    </Box>
  );

  const emptyTile = (
    <Box sx={[styles.tileBackground, styles.emptyTile]}>
    </Box>
  );

  const selectedEmptyTile = (
    <Box sx={[styles.tileBackground, styles.emptyTile, styles.selectedTile]}>
    </Box>
  );

  const nextEmptySelection = () => {
    if (selectedIndex === 2 && dora.length < 8) return;
    if (selectedIndex === 3 && hand.filter(tile => tile === null).length > 0) return;
    if (selectedIndex === 3 && hand.filter(tile => tile === null).length === 0 && winningTile === null) {
      setSelectedIndex(4);
      return;
    }

    if (seatWind === null) {
      setSelectedIndex(0);
    } else if (roundWind === null) {
      setSelectedIndex(1);
    } else if (dora.length === 0) {
      setSelectedIndex(2);
    } else if (hand.filter(tile => tile === null).length > 0) {
      setSelectedIndex(3);
    } else if (winningTile === null) {
      setSelectedIndex(4);
    } else {
      setSelectedIndex(5);
    }
  }

  const onSelectionTileClick = (tile) => {
    switch (selectedIndex) {
      case 0:
        setSeatWind(tile);
        break;
      case 1:
        setRoundWind(tile);
        break;
      case 2:
        if (dora.length < 8) {
          setDora([...dora, tile]);
        }
        break;
      case 3:
        if (hand.filter(tile => tile === null).length > 0) {
          let index = hand.indexOf(null);
          const sorted = [...hand.slice(0, index), tile, ...hand.splice(index + 1)].sort((a, b) => (b?.key < (a?.key ?? String.fromCodePoint(0x10ffff))) ? 1 : -1);
          setHand(sorted);
        }
        break;
      case 4:
        setWinningTile(tile);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    console.log(selectedIndex);
    nextEmptySelection();
  }, [seatWind, roundWind, dora, hand, winningTile])

  const selectionTiles = (
    <Grid item container direction="column" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} sx={{ mb: 4 }}>
      {suits.map((suit, index) => (
        <Grid key={`${suit}${index}`} item container direction="row" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent="center">
          {[1, 2, 3, 4, 5, 5, 6, 7, 8, 9].map((value, i) => (
            <Grid item key={`${value}${i}`}>
              <Button
                disabled={
                  selectedIndex <= 1 || selectedIndex === 5
                }
                sx={{
                  padding: 0,
                  minWidth: 0,
                  opacity: selectedIndex <= 1 || selectedIndex === 5 ? 0.6 : 1,
                }}
                /* change onClick to send {suit: "", value: #} of tile instead of actual react tile component */
                onClick={
                  () => onSelectionTileClick(i === 4 ? addTileFront(getSuitTiles(suit, value, true)) : addTileFront(getSuitTiles(suit, value)))
                }
              >
                {i === 4 ? addTileFront(getSuitTiles(suit, value, true)) : addTileFront(getSuitTiles(suit, value))}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
      <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent="center">
        {honors.map((tile, index) => (
          <Grid item key={`${tile}${index}`}>
            <Button
              disabled={
                selectedIndex <= 1 && (tile[0] === 'g' || tile[0] === 'r' || tile[1] === 'h') || selectedIndex === 5
              }
              sx={{
                padding: 0,
                minWidth: 0,
                opacity: selectedIndex <= 1 && (tile[0] === 'g' || tile[0] === 'r' || tile[1] === 'h') || selectedIndex === 5 ? 0.6 : 1
              }}
              /* change onClick to send {honor: "name"} of tile instead of actual react tile component */
              onClick={() => onSelectionTileClick(addTileFront(getHonorTiles(tile)))}
            >
              {addTileFront(getHonorTiles(tile))}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container direction="column">

          {/*-----Seat, Round, Dora-----*/}
          <Grid item container direction="row" justifyContent="space-between">
            <Grid item>
              <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 2 : 2 : 4}>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h1" sx={{ mb: 2 }}>Seat</Typography>
                  <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setSeatWind(null); setSelectedIndex(0); }}>
                    {seatWind === null ? selectedIndex === 0 ? selectedEmptyTile : emptyTile : seatWind}
                  </Button>
                </Grid>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h1" sx={{ mb: 2 }}>Round</Typography>
                  <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setRoundWind(null); setSelectedIndex(1); }}>
                    {roundWind === null ? selectedIndex === 1 ? selectedEmptyTile : emptyTile : roundWind}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item container direction="column">
                <Typography variant="h1" align="center" sx={{ mb: 2 }}>Dora/Uradora</Typography>
                <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent="center">
                  {dora.map((tile, index) => (
                    <Grid item key={`${tile}${index}`}>
                      <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setSelectedIndex(2); setDora(dora.filter((_, i) => i !== index)) }}>
                        {tile}
                      </Button>
                    </Grid>
                  ))}
                  {dora.length === 8 ? null :
                    <Grid item>
                      <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => setSelectedIndex(2)}>
                        {selectedIndex === 2 ? selectedEmptyTile : emptyTile}
                      </Button>
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/*-----Hand-----*/}
          <Grid item sx={{ mt: 8, mb: 4 }}>
            <Typography variant="h1" align="center">Hand</Typography>
          </Grid>
          <Grid item container spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1}>
            {hand.map((tile, index) => (
              <Grid item key={`${tile}${index}`}>
                <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setSelectedIndex(3); setHand([...hand.filter((_, i) => i !== index), null]) }}>
                  {tile === null ? selectedIndex === 3 && hand.filter(t => t !== null).length === index ? selectedEmptyTile : emptyTile : tile}
                </Button>
              </Grid>
            ))}
            <Grid item sx={{ ml: matchesSM ? undefined : 'auto' }}>
              <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setWinningTile(null); setSelectedIndex(4); }}>
                {winningTile === null ? selectedIndex === 4 ? selectedEmptyTile : emptyTile : winningTile}
              </Button>
            </Grid>
          </Grid>

          {/*-----Riichi-----*/}
          <Grid item sx={{ my: 4 }} align="center">
            <Button sx={{ padding: 0 }} onClick={() => setRiichiDeclared((riichiDeclared + 1) % 3)} disableRipple>
              <Grid sx={styles.riichi} container direction="row" alignItems="center">
                <Box sx={{
                  height: "7px",
                  width: "7px",
                  backgroundColor: "#e31a1c",
                  borderRadius: "50%",
                  ml: "50%",
                  transform: "translateX(-3.5px)"
                }}></Box>
                <Typography variant='small' sx={{ textTransform: "none" }}>{riichiDeclared === 2 ? "x2" : ''}</Typography>
              </Grid>

            </Button>
          </Grid>

          {/*-----Selection Tiles-----*/}
          {selectionTiles}

          {/*-----Clear Buttons-----*/}
          <Grid item container justifyContent="center" spacing={3}>
            <Grid item>
              <Button variant="contained" onClick={() => { setDora([]) }} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear Dora</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => { setHand(hand.map(_ => null)), setWinningTile(null) }} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear Hand</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => { setSeatWind(null), setRoundWind(null), setDora([]), setHand(hand.map(_ => null)), setWinningTile(null) }} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear All</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
