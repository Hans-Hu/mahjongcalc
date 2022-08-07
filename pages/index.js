import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from "@mui/material/styles";
import { getTile, handToRiichiString } from '../src/mahjong/tileMapping';
import Button from '@mui/material/Button';
import { Dialog, DialogContent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Hidden from '@mui/material/Hidden';
import Head from 'next/head';
import Riichi from '../src/mahjong/riichi';

export default function Index() {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

  const [seatWind, setSeatWind] = useState(null);
  const [roundWind, setRoundWind] = useState(null);
  const [doraIndicators, setDoraIndicators] = useState([]);
  const [hand, setHand] = useState(Array(13).fill(null));
  const [winningTile, setWinningTile] = useState(null);
  const [riichiDeclared, setRiichiDeclared] = useState(1); // 0 - no riichi, 1 - riichi, 2 - double riichi
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 - seat, 1 - round, 2 - dora, 3 - hand
  const [tilesUsed, setTilesUsed] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");
  const [scoreName, setScoreName] = useState("");
  const [miniPointsMessage, setMiniPointsMessage] = useState("");
  const [yakus, setYakus] = useState({});

  const [winButtonDisabled, setWinButtonDisabled] = useState(true);

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

  const generateTile = ({ suitIndex, number, dora = false }) => (
    addTileFront(getTile(suitIndex, number, dora))
  );

  const addTileFront = ({ src, alt }) => (
    <Box sx={styles.tileBackground}>
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
    if (selectedIndex === 2 && doraIndicators.length < 8) return;
    if (selectedIndex === 3 && hand.filter(tile => tile === null).length > 0) return;
    if (selectedIndex === 3 && hand.filter(tile => tile === null).length === 0 && winningTile === null) {
      setSelectedIndex(4);
      return;
    }
    if (selectedIndex === 4 && winningTile === null) return;

    if (seatWind === null) {
      setSelectedIndex(0);
    } else if (roundWind === null) {
      setSelectedIndex(1);
    } else if (doraIndicators.length === 0) {
      setSelectedIndex(2);
    } else if (hand.filter(tile => tile === null).length > 0) {
      setSelectedIndex(3);
    } else if (winningTile === null) {
      setSelectedIndex(4);
    } else {
      setSelectedIndex(5);
    }
  }

  const updateTilesUsed = (tiles, removed = false) => {
    if (tiles[0] === null) return;

    const updatedTilesUsed = tilesUsed;
    tiles.forEach(tile => {
      if (tile === null) return;
      let tileKey = `${tile.suitIndex},${tile.index}`;
      if (removed) {
        updatedTilesUsed = { ...updatedTilesUsed, [tileKey]: updatedTilesUsed[tileKey] - 1 };
      } else if (updatedTilesUsed[tileKey]) {
        updatedTilesUsed = { ...updatedTilesUsed, [tileKey]: updatedTilesUsed[tileKey] + 1 };
      } else {
        updatedTilesUsed = { ...updatedTilesUsed, [tileKey]: 1 };
      }
    });
    setTilesUsed(updatedTilesUsed);
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
        if (doraIndicators.length < 8) {
          setDoraIndicators([...doraIndicators, tile]);
          updateTilesUsed([tile]);
        }
        break;
      case 3:
        if (hand.filter(tile => tile === null).length > 0) {
          let index = hand.indexOf(null);
          const sorted = [...hand.slice(0, index), tile, ...hand.slice(index + 1)].sort((a, b) => (
            b?.sortIndex < (a?.sortIndex ?? Number.MAX_VALUE)) ? 1 : -1
          );
          setHand(sorted);
          updateTilesUsed([tile]);
        }
        break;
      case 4:
        setWinningTile(tile);
        updateTilesUsed([tile]);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    nextEmptySelection();
    if (seatWind !== null && roundWind !== null & doraIndicators.length > 0 && hand.filter(tile => tile === null).length === 0 && winningTile !== null) {
      // modify handToRiichiString for calls
      const riichiString = handToRiichiString(riichiDeclared, seatWind, roundWind, doraIndicators, hand, winningTile, "ron");
      const riichi = new Riichi(riichiString);
      const result = riichi.calc();

      if (result.isAgari) {
        setWinButtonDisabled(false);
      } else {
        setWinButtonDisabled(true);
        //show invalid hand message on ron/tsumo button aria label/tip
      }
    } else {
      setWinButtonDisabled(true);
    }
  }, [seatWind, roundWind, doraIndicators, hand, winningTile])

  const onWinButtonClick = (winningType) => {
    const riichiString = handToRiichiString(riichiDeclared, seatWind, roundWind, doraIndicators, hand, winningTile, winningType);
    const riichi = new Riichi(riichiString);
    const result = riichi.calc();

    setScoreName(result.name)
    setScoreMessage(`${result.ten} Points` + (winningType === "tsumo" ? seatWind.number === 1 ? ` (${result.oya[0]} all)` : ` (${Math.max(...result.ko)} / ${Math.min(...result.ko)})` : ""));
    if (result.fu !== 0) {
      setMiniPointsMessage(`${result.fu} Fu / ${result.han} Han`);
    } else {
      setMiniPointsMessage("");
    }
    setYakus(result.yaku);
    setDialogOpen(true);
  }

  const tileDisabled = (index, i) => {
    if (index < 3 && i === 4 && tilesUsed[`${index},${i}`] >= 1) {
      return true;
    } else if (index < 3 && i === 5 && tilesUsed[`${index},${i}`] >= 3) {
      return true;
    } else if (tilesUsed[`${index},${i}`] >= 4) {
      return true;
    } else {
      return selectedIndex <= 1 && (i >= 4 || index < 3) || selectedIndex === 5;
    }
  }

  const selectionTiles = (
    <Grid item container direction="column" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} sx={{ mb: matchesSM ? 3 : 4 }}>
      {Array(4).fill().map((_, index) => (
        <Grid key={`${index}`} item container direction="row" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent="center">
          {(index === 3 ? Array(7).fill().map((_, i) => i + 1) : [1, 2, 3, 4, 5, 5, 6, 7, 8, 9]).map((number, i) => (
            <Grid item key={`${number}${i}`}>
              <Button
                disabled={
                  tileDisabled(index, i)
                }
                sx={{
                  padding: 0,
                  minWidth: 0,
                  opacity: tileDisabled(index, i) ? 0.6 : 1
                }}
                /* change onClick to send {honor: "name"} of tile instead of actual react tile component */
                onClick={() => onSelectionTileClick({
                  suitIndex: index,
                  index: i,
                  number: number,
                  dora: index < 3 && i === 4,
                  sortIndex: index * 10 + i
                })}
              >
                {generateTile({ suitIndex: index, index: i, number: number, dora: i === 4 })}
              </Button>
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Container maxWidth="lg">
      <Head>
        <title key="title">Riichi Mahjong Score Calculator</title>
        <meta name="description" key="description" content="Simple online calculator for Japanese Riichi Mahjong. Accurately calculates the score and yakus of a hand." />
        <meta property="og:title" content="Riichi Mahjong Score Calculator" key="og:title" />
        <meta property="og:url" content="mahjongscore.com" key="og:url" />
        <link rel="canonical" key="canonical" href="https://mahjongscore.com" />
      </Head>
      <Box sx={{ my: matchesSM ? 2 : 4 }}>
        <Grid container direction="column">

          {/*-----Seat, Round, Dora-----*/}
          <Grid item container direction={matchesSM ? "column" : "row"} justifyContent={matchesSM ? "center" : "space-between"}>
            <Grid item>
              <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 0 : 2 : 4} sx={{ width: matchesSM ? "8em" : undefined, mx: matchesSM ? "auto" : undefined }}>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h1" sx={{ mb: 2 }}>Seat</Typography>
                  <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setSeatWind(null); setSelectedIndex(0); }}>
                    {seatWind === null ? selectedIndex === 0 ? selectedEmptyTile : emptyTile : generateTile(seatWind)}
                  </Button>
                </Grid>
                <Grid item container direction="column" align="center" xs>
                  <Typography variant="h1" sx={{ mb: 2 }}>Round</Typography>
                  <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setRoundWind(null); setSelectedIndex(1); }}>
                    {roundWind === null ? selectedIndex === 1 ? selectedEmptyTile : emptyTile : generateTile(roundWind)}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item container direction="column">
                <Typography variant="h1" align="center" sx={{ mb: 2, mt: matchesSM ? 2 : 0 }}>Dora/Uradora Indicator</Typography>
                <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent="center">
                  {doraIndicators.map((tile, index) => (
                    <Grid item key={`${tile}${index}`}>
                      <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { updateTilesUsed([tile], true); setSelectedIndex(2); setDoraIndicators(doraIndicators.filter((_, i) => i !== index)) }}>
                        {generateTile(tile)}
                      </Button>
                    </Grid>
                  ))}
                  {doraIndicators.length === 8 ? null :
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
          <Grid item sx={{ mt: matchesSM ? 2 : 4, mb: matchesSM ? 2 : 4 }}>
            <Typography variant="h1" align="center">Hand</Typography>
          </Grid>
          <Grid item container spacing={matchesLG ? matchesSM ? 0.3 : 0.5 : 1} justifyContent={matchesSM ? "center" : undefined}>
            {hand.map((tile, index) => (
              <Grid item key={`${tile}${index}`}>
                <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { updateTilesUsed([tile], true); setSelectedIndex(3); setHand([...hand.filter((_, i) => i !== index), null]) }}>
                  {tile === null ? selectedIndex === 3 && hand.filter(t => t !== null).length === index ? selectedEmptyTile : emptyTile : generateTile(tile)}
                </Button>
              </Grid>
            ))}
            <Grid item sx={{ ml: matchesSM ? undefined : 'auto' }}>
              <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { updateTilesUsed([winningTile], true); setWinningTile(null); setSelectedIndex(4); }}>
                {winningTile === null ? selectedIndex === 4 ? selectedEmptyTile : emptyTile : generateTile(winningTile)}
              </Button>
            </Grid>
          </Grid>

          {/*-----Riichi-----*/}
          <Grid item sx={{ my: matchesSM ? 3 : 4 }} align="center">
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
                <Typography variant='subtitle1' sx={{ textTransform: "none" }}>{riichiDeclared === 2 ? "x2" : ''}</Typography>
              </Grid>

            </Button>
          </Grid>

          {/*-----Selection Tiles-----*/}
          {selectionTiles}

          {/*-----Ron/Tsumo Buttons-----*/}
          <Grid item container justifyContent="center" spacing={3}>
            <Grid item>
              <Button disabled={winButtonDisabled} variant="contained" onClick={() => onWinButtonClick("ron")} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined, opacity: winButtonDisabled ? 0.7 : 1 }}>Ron</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button disabled={winButtonDisabled} variant="contained" onClick={() => onWinButtonClick("tsumo")} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined, opacity: winButtonDisabled ? 0.7 : 1 }}>Tsumo</Typography>
              </Button>
            </Grid>
          </Grid>

          {/*-----Clear Buttons-----*/}
          <Grid item container justifyContent="center" spacing={3} sx={{ my: matchesSM ? 0 : 2 }}>
            <Grid item>
              <Button variant="contained" onClick={() => { updateTilesUsed(doraIndicators, true); setDoraIndicators([]); setSelectedIndex(2); }} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear Dora</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => { updateTilesUsed([...hand, winningTile], true); setHand(hand.map(_ => null)), setWinningTile(null); setSelectedIndex(3); }} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear Hand</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={() => { setTilesUsed({}); setSeatWind(null), setRoundWind(null), setDoraIndicators([]), setHand(hand.map(_ => null)), setWinningTile(null); setSelectedIndex(0); }} sx={{ width: matchesMD ? "8em" : "10em" }}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear All</Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Dialog sx={{ zIndex: 1302 }} open={dialogOpen} fullScreen={matchesSM} onClose={() => setDialogOpen(false)} PaperProps={{ sx: { backgroundColor: theme.palette.background.default } }}>
          <DialogContent onClick={() => matchesSM ? setDialogOpen(false) : undefined}>
            <Hidden smUp>
              <IconButton
                aria-label="close"
                onClick={() => setDialogOpen(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: theme.palette.text.primary
                }}
              >
                <CloseIcon />
              </IconButton>
            </Hidden>
            <Grid container direction="column" sx={{ width: matchesSM ? undefined : "25em", height: matchesSM ? "100%" : undefined }} alignItems="center" justifyContent={matchesSM ? "center" : undefined}>
              {Object.keys(yakus).length === 0 ?
                <Grid item sx={{ mt: 2, mb: 2 }}>
                  <Typography variant='h1' sx={{ fontSize: "1.6rem" }} align='center'>
                    No Yaku
                  </Typography>
                </Grid> :
                <React.Fragment>
                  <Grid item sx={{ mt: 2, mb: 1 }}>
                    <Typography variant='h1' sx={{ fontSize: "1.8rem", fontWeight: 400 }} align='center'>
                      {scoreName}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant='h1' sx={{ fontSize: "1.6rem" }} align='center'>
                      {scoreMessage}
                    </Typography>
                  </Grid>
                  <Grid item sx={{ mt: 1, mb: 4 }}>
                    <Typography variant='h1' align='center'>
                      {miniPointsMessage}
                    </Typography>
                  </Grid>
                  <Grid item container direction="column" sx={{ px: 2, mb: 2 }} spacing={0.3}>
                    {Object.entries(yakus).map(([name, value], index) => (
                      <Grid item container key={`${name}${value}${index}`} justifyContent="space-between">
                        <Grid item>
                          <Typography variant='h1'>{name}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant='h1'>{value}</Typography>
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </React.Fragment>
              }

            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
}
