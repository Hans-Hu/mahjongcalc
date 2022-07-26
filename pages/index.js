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
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';

const clone2D = (array) => array.map(subArray => subArray.slice());

export default function Index() {
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

  const [seatWind, setSeatWind] = useState(null);
  const [roundWind, setRoundWind] = useState(null);
  const [doraIndicators, setDoraIndicators] = useState([]);
  const [hand, setHand] = useState(Array(13).fill(null));
  const [calledTiles, setCalledTiles] = useState([]);
  const [winningTile, setWinningTile] = useState(null);
  const [riichiDeclared, setRiichiDeclared] = useState(1); // 0 - no riichi, 1 - riichi, 2 - double riichi
  const [selectedIndex, setSelectedIndex] = useState(0); // 0 - seat, 1 - round, 2 - dora, 3 - hand, 4 - winning tile
  const [selectedSuit, setSelectedSuit] = useState(3); // 0 - Man, 1 - Pin, 2 - Sou, 3 - Jihai
  const [tilesUsed, setTilesUsed] = useState({});
  const [akaDora, setAkaDora] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");
  const [scoreName, setScoreName] = useState("");
  const [miniPointsMessage, setMiniPointsMessage] = useState("");
  const [yakus, setYakus] = useState({});

  const [ippatsu, setIppatsu] = useState(false);
  const [extraIndex, setExtraIndex] = useState(0); // 0 - none, 1 - chankan, 2 - rinshan kaihou, 3 - haitei/houtei,  4 - tenhou/chiihou
  const extraMapping = ["", "k", "k", "h", "t"];

  const [winButtonDisabled, setWinButtonDisabled] = useState(true);

  const [callSelected, setCallSelected] = useState(0); // 0 - none, 1 - chi, 2 - pon, 3 - kan, 4 - ankan

  const [openOptions, setOpenOptions] = useState(false);

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
    tileBackgroundSmall: {
      width: '54px',
      height: '72px',
      [theme.breakpoints.between("sm", "lg")]: {
        width: '4.5vw',
        height: '6vw'
      },
      [theme.breakpoints.down("sm")]: {
        width: '27px',
        height: '36px'
      }
    },
    tileBack: {
      filter: "brightness(0%) invert(81%) sepia(62%) saturate(1671%) hue-rotate(356deg) brightness(101%) contrast(91%)"
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
    },
    button: {
      width: matchesMD ? matchesSM ? "5.8em" : "8em" : "10em",
      "&:hover": { backgroundColor: matchesSM || windowHeight < 500 ? undefined : "#535A64" }
    },
    clearButton: {
      width: matchesMD ? "8em" : "10em"
    },
    extraOptions: {
      backgroundColor: theme.palette.primary.main,
      minWidth: "350px",
      position: "fixed",
      top: openOptions ? "48px" : "-291px",
      zIndex: 1301,
      left: "50%",
      transform: "translateX(-50%)",
      transition: "top 0.3s",
      borderRadius: "0 0 5px 5px",
      boxShadow: openOptions ? 4 : 0
    }
  };

  const generateTile = ({ suitIndex, number, showBack = false }, small = false) => (
    showBack ? tileBack(small) : addTileFront(getTile(suitIndex, number), small)
  );

  const addTileFront = ({ src, alt }, small = false) => (
    <Box sx={[styles.tileBackground, small ? styles.tileBackgroundSmall : undefined]}>
      <img height="75%" src={src} alt={alt} />
    </Box>
  );

  const emptyTile = (
    <Box sx={[styles.tileBackground, styles.emptyTile]}>
    </Box>
  );

  const tileBack = (small = false) => (
    <Box sx={[styles.tileBackground, styles.tileBack, small ? styles.tileBackgroundSmall : undefined]}>
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

  const handleTileCalls = (tile) => {
    setHand(hand.slice(0, hand.length - 3));
    switch (callSelected) {
      case 1:
        let startingNumber = tile.number;
        if (tile.number >= 7) {
          startingNumber = 7;
        }
        let tileSet = [];
        for (let number = startingNumber; number <= startingNumber + 2; number++) {
          tileSet.push({ ...tile, number: number, index: number - 1 })
        }
        setCalledTiles(clone2D([...calledTiles, tileSet]));
        updateTilesUsed(tileSet);
        setRiichiDeclared(0);
        break;
      case 2:
        setCalledTiles(clone2D([...calledTiles, Array(3).fill(tile)]))
        updateTilesUsed(Array(3).fill(tile));
        setRiichiDeclared(0);
        break;
      case 3:
        setCalledTiles(clone2D([...calledTiles, Array(4).fill(tile)]))
        updateTilesUsed(Array(4).fill(tile));
        setRiichiDeclared(0);
        break;
      case 4:
        setCalledTiles(clone2D([...calledTiles, [{ ...tile, showBack: true }, tile, tile, { ...tile, showBack: true }]]));
        updateTilesUsed(Array(4).fill(tile));
        break;
      default:
        break;
    }
  }

  const handleSelectionTileClick = (tile) => {
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
        if (callSelected > 0) handleTileCalls(tile);
        else if (hand.filter(tile => tile === null).length > 0) {
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
      const riichiString = handToRiichiString(riichiDeclared, seatWind, roundWind, doraIndicators, hand, calledTiles, winningTile, "ron");
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
  }, [seatWind, roundWind, doraIndicators, hand, calledTiles, winningTile]);

  useEffect(() => {
    const len = hand.filter(tile => tile === null).length;
    if (len < 3 || selectedIndex !== 3) {
      setCallSelected(0);
      setCallsDisabled(true);
    } else {
      setCallsDisabled(false);
    }

    if (selectedIndex < 2) {
      setSelectedSuit(3);
    }
  }, [hand, selectedIndex]);

  const handleWinButtonClick = (winningType) => {
    const riichiString = handToRiichiString(riichiDeclared, seatWind, roundWind, doraIndicators, hand, calledTiles, winningTile, winningType);
    const riichi = new Riichi(riichiString);
    riichi.aka = akaDora;
    riichi.extra = `${ippatsu ? "i" : ""}${extraMapping[extraIndex]}` + riichi.extra;
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
    if (selectedIndex === 5) return true;
    if (selectedIndex < 2) {
      return i >= 4 || index < 3;
    }
    switch (callSelected) {
      case 1:
        if (index === 3) return true;
        let startingIndex = i;
        if (startingIndex >= 6) {
          startingIndex = 6
        }
        return tilesUsed[`${index},${startingIndex}`] >= 4 || tilesUsed[`${index},${startingIndex + 1}`] >= 4 || tilesUsed[`${index},${startingIndex + 2}`] >= 4
      case 2:
        return tilesUsed[`${index},${i}`] >= 2;
      case 3:
      case 4:
        return tilesUsed[`${index},${i}`] >= 1;
      default:
        break;
    }
    return tilesUsed[`${index},${i}`] >= 4;
  }

  const [callsDisabled, setCallsDisabled] = useState(false);

  const calls = ["Chi", "Pon", "Kan", "Ankan"];
  const suits = ["Man", "Pin", "Sou", "Jihai"];

  const tileSpacing = matchesLG ? matchesSM ? 0.15 : 0.5 : 0.5;

  const selectionTiles = (
    <React.Fragment>
      <Grid item container sx={{ mb: 2 }} justifyContent="center" spacing={tileSpacing}>
        {suits.map((suit, index) => (
          <Grid item key={`${suit}${index}`}>
            <Button
              variant="contained"
              onClick={() => setSelectedSuit(index)}
              sx={[styles.button, {
                backgroundColor: selectedSuit === index ? "#535A64" : undefined,
                "&:hover": {
                  backgroundColor: "#535A64"
                }
              }]}
            >
              <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>{suit}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Grid item container direction="column" spacing={tileSpacing} sx={{ mb: matchesSM ? 3 : 4 }}>
        {Array(4).fill().map((_, index) => (
          <Grid key={`${index}`} item container direction="row" spacing={tileSpacing} justifyContent="center" sx={{ display: selectedSuit === index ? undefined : "none" }}>
            {Array(index === 3 ? 7 : 9).fill().map((_, i) => (
              <Grid item key={`${i}`}>
                <Button
                  disabled={
                    tileDisabled(index, i)
                  }
                  sx={{
                    padding: 0,
                    minWidth: 0,
                    opacity: tileDisabled(index, i) ? 0.6 : 1
                  }}
                  onClick={() => handleSelectionTileClick({
                    suitIndex: index,
                    index: i,
                    number: i + 1,
                    sortIndex: index * 10 + i
                  })}
                >
                  {generateTile({ suitIndex: index, index: i, number: i + 1 })}
                </Button>
              </Grid>
            ))}
          </Grid>
        ))}

      </Grid>
    </React.Fragment>
  )

  const extraOptionsName = ["Chankan", "Rinshan Kaihou", "Haitei / Houtei", seatWind === null ? "Tenhou / Chiihou" : seatWind.index === 0 ? "Tenhou" : "Chiihou"];
  const extraOptionsContent = (
    <Grid container direction="column" sx={{ px: 3, pt: 3 }}>
      <Grid item container direction="row" alignItems="center">
        <Grid item>
          <Typography variant='h1'>Aka dora: </Typography>
        </Grid>
        <Grid item container xs justifyContent="flex-end" alignItems="center">
          <Grid item>
            <Button
              sx={{
                backgroundColor: theme.palette.background.default,
                minWidth: 0,
                width: "2em",
                height: "2em",
                mr: 1,
                "&:hover": {
                  backgroundColor: theme.palette.background.default
                }
              }}
              onClick={() => setAkaDora(Math.max(akaDora - 1, 0))}
            >
              <Typography variant='h1'>-</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Typography variant='h1'>{akaDora}</Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                backgroundColor: theme.palette.background.default,
                minWidth: 0,
                width: "2em",
                height: "2em",
                ml: 1,
                "&:hover": {
                  backgroundColor: theme.palette.background.default
                }
              }}
              onClick={() => setAkaDora(Math.min(akaDora + 1, 4))}
            >
              <Typography variant='h1'>+</Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          sx={[styles.button, {
            backgroundColor: ippatsu ? "#535A64" : theme.palette.background.default,
            width: "100%", mt: 2,
            "&:hover": {
              backgroundColor: (!matchesSM && windowHeight >= 500) || ippatsu ? "#535A64" : undefined
            }
          }]}
          onClick={() => { setIppatsu(!ippatsu); setExtraIndex(extraIndex % 2 === 0 ? false : extraIndex) }}
        >
          <Typography variant='h1' >Ippatsu</Typography>
        </Button>
      </Grid>
      {extraOptionsName.map((name, index) => (
        <Grid item key={`${name}${index}`}>
          <Button
            sx={[styles.button, {
              backgroundColor: index + 1 === extraIndex ? "#535A64" : theme.palette.background.default,
              width: "100%", mt: 2,
              "&:hover": {
                backgroundColor: (!matchesSM && windowHeight >= 500) || index + 1 === extraIndex ? "#535A64" : undefined
              }
            }]}
            onClick={() => { extraIndex === index + 1 ? setExtraIndex(0) : setExtraIndex(index + 1); setIppatsu((index + 1) % 2 === 0 ? false : ippatsu) }}
          >
            <Typography variant='h1' >{name}</Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  )

  const extraOptions = (
    <React.Fragment>
      {windowHeight < 500 ?
        <Grid container justifyContent="center" sx={{position: "absolute", left: 0}}>
          <Box display="flex" justifyContent="center" sx={{ mx: "auto", width: "60px", height: "30px", backgroundColor: theme.palette.primary.main, borderRadius: "0 0 15px 15px", boxShadow: 4 }}>
            <IconButton onClick={() => setOpenOptions(!openOptions)} disableRipple sx={{ width: "100%" }}>
              {openOptions ? <ArrowDropUp color='secondary' /> : <ArrowDropDown color='secondary' />}
            </IconButton>
          </Box>
        </Grid>

        :
        <Box sx={styles.extraOptions} justifyContent="center">
          <Box>
            {extraOptionsContent}
          </Box>
          <Box display="flex" justifyContent="center" sx={{ mx: "auto", width: "60px", height: "30px", transform: "translateY(30px)", backgroundColor: theme.palette.primary.main, borderRadius: "0 0 15px 15px", boxShadow: 4 }}>
            <IconButton onClick={() => setOpenOptions(!openOptions)} disableRipple sx={{ width: "100%" }}>
              {openOptions ? <ArrowDropUp color='secondary' /> : <ArrowDropDown color='secondary' />}
            </IconButton>
          </Box>
        </Box>
      }
      <Dialog sx={{ zIndex: 1302 }} open={windowHeight < 500 ? openOptions : false} fullScreen onClose={() => setOpenOptions(false)} PaperProps={{ sx: { backgroundColor: theme.palette.primary.main, alignItems: "center" } }}>
        <DialogContent sx={{ minWidth: 400, pt: 0 }}>
          {extraOptionsContent}
        </DialogContent>
        <IconButton
          aria-label="close"
          onClick={() => setOpenOptions(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.text.primary
          }}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    </React.Fragment>

  )

  return (
    <Container maxWidth="lg" sx={{ px: matchesSM ? "8px" : undefined }}>
      <Head>
        <title key="title">Riichi Mahjong Score Calculator</title>
        <meta name="description" key="description" content="Simple online calculator for Japanese Riichi Mahjong. Accurately calculates the score and yakus of a hand." />
        <meta property="og:title" content="Riichi Mahjong Score Calculator" key="og:title" />
        <meta property="og:url" content="www.mahjongscore.com" key="og:url" />
        <meta property="og:description" key="og:description" content="Simple online calculator for Japanese Riichi Mahjong. Accurately calculates the score and yakus of a hand." />
        <meta property="twitter:url" content="https://www.mahjongcalc.com/" key="twitter:url" />
        <meta property="twitter:description" key="twitter:description" content="Simple online calculator for Japanese Riichi Mahjong. Accurately calculates the score and yakus of a hand." />
        <meta property="twitter:title" content="Riichi Mahjong Score Calculator" key="twitter:title" />

        <link rel="canonical" key="canonical" href="https://www.mahjongscore.com" />
      </Head>
      {extraOptions}
      <Box sx={{ my: matchesMD ? 2 : 4 }}>
        <Grid container direction="column">

          {/*-----Seat, Round, Dora-----*/}
          <Grid item container direction={matchesSM ? "column" : "row"} justifyContent={matchesSM ? "center" : "space-between"}>
            <Grid item>
              <Grid item container direction="row" spacing={matchesLG ? matchesSM ? 0 : 2 : 4} sx={{ mx: matchesSM ? "auto" : undefined }}>
                <Grid item container
                  direction={matchesSM ? "row" : "column"}
                  align="center"
                  justifyContent={matchesSM ? "flex-end" : undefined}
                  alignItems={matchesSM ? "center" : undefined}
                  sx={{ mr: matchesSM ? 10 : 0 }} xs
                >
                  <Typography variant="h1" sx={{ mb: matchesSM ? 0 : 2, mr: matchesSM ? 1 : 0 }}>Seat</Typography>
                  <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setSeatWind(null); setSelectedIndex(0); }}>
                    {seatWind === null ? selectedIndex === 0 ? selectedEmptyTile : emptyTile : generateTile(seatWind)}
                  </Button>
                </Grid>
                <Grid item container
                  direction={matchesSM ? "row" : "column"}
                  align="center"
                  alignItems={matchesSM ? "center" : undefined} xs
                >
                  <Hidden smDown><Typography variant="h1" sx={{ mb: 2 }}>Round</Typography></Hidden>
                  <Button sx={{ padding: 0, minWidth: 0 }} onClick={() => { setRoundWind(null); setSelectedIndex(1); }}>
                    {roundWind === null ? selectedIndex === 1 ? selectedEmptyTile : emptyTile : generateTile(roundWind)}
                  </Button>
                  <Hidden smUp><Typography variant="h1" sx={{ mb: matchesSM ? 0 : 2, ml: matchesSM ? 1 : 0 }}>Round</Typography></Hidden>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid item container direction="column">
                <Typography variant="h1" align="center" sx={{ mb: 2 }}>Dora/Uradora Indicator</Typography>
                <Grid item container direction="row" spacing={tileSpacing} justifyContent="center">
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

          <Grid item container direction="column" sx={{ minHeight: matchesSM ? "197px" : undefined }}>
            <Grid item sx={{ mt: matchesMD ? 2 : 4, mb: matchesMD ? 2 : 4 }}>
              <Typography variant="h1" align="center">Hand</Typography>
            </Grid>
            <Grid item container sx={{ mb: 2 }} spacing={tileSpacing} justifyContent={matchesSM ? "center" : undefined}>
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

            {/*-----Called Tiles-----*/}
            {calledTiles.length === 0 ?
              <Box sx={[styles.tileBackground, { background: "none" }, styles.tileBackgroundSmall]}>
              </Box> :
              <Grid item container spacing={tileSpacing * 4} justifyContent={matchesSM ? "center" : undefined}>
                {calledTiles.map((tileSet, index) => (
                  <Grid item key={`${tileSet}${index}`}>
                    <Grid item container spacing={tileSpacing * 0.8}>
                      {tileSet.map((tile, i) => (
                        <Grid item key={`${tile}${i}`}>
                          <Button sx={{ padding: 0, minWidth: 0 }}
                            onClick={() => {
                              updateTilesUsed(tileSet, true);
                              setSelectedIndex(3);
                              setHand([...hand, ...Array(3).fill(null)]);
                              setCalledTiles(clone2D([...calledTiles.slice(0, index), ...calledTiles.slice(index + 1)]));
                            }}
                          >
                            {generateTile(tile, true)}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            }
          </Grid>




          {/*-----Riichi-----*/}
          <Grid item sx={{ mt: matchesMD ? 3 : 4 }} align="center">
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

          {/*-----Chi/Pon/Kan Selection-----*/}
          <Grid item sx={{ mt: matchesMD ? 3 : 4, mb: 2 }} container justifyContent="center" spacing={tileSpacing}>
            {calls.map((call, index) => (
              <Grid item key={`${call}${index}`}>
                <Button
                  disabled={callsDisabled}
                  variant="contained"
                  onClick={() => callSelected === index + 1 ? setCallSelected(0) : setCallSelected(index + 1)}
                  sx={[styles.button, {
                    backgroundColor: callSelected === index + 1 ? "#535A64" : undefined,
                    "&:hover": {
                      backgroundColor: !matchesSM || callSelected === index + 1 ? "#535A64" : undefined
                    }
                  }]}
                >
                  <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined, opacity: callsDisabled ? 0.7 : 1 }}>{call}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>

          {/*-----Selection Tiles-----*/}
          {selectionTiles}

          {/*-----Ron/Tsumo Buttons-----*/}
          <Grid item container justifyContent="center" spacing={3}>
            <Grid item>
              <Button disabled={winButtonDisabled || extraIndex === 2 || extraIndex === 4} variant="contained" onClick={() => handleWinButtonClick("ron")} sx={styles.button}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined, opacity: winButtonDisabled ? 0.7 : 1 }}>Ron</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button disabled={winButtonDisabled || extraIndex === 1} variant="contained" onClick={() => handleWinButtonClick("tsumo")} sx={styles.button}>
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined, opacity: winButtonDisabled ? 0.7 : 1 }}>Tsumo</Typography>
              </Button>
            </Grid>
          </Grid>

          {/*-----Clear Buttons-----*/}
          <Grid item container justifyContent="center" spacing={3} sx={{ my: matchesMD ? 0 : 2 }}>
            <Grid item>
              <Button variant="contained"
                onClick={() => {
                  updateTilesUsed(doraIndicators, true);
                  setDoraIndicators([]);
                  setSelectedIndex(2);
                }}
                sx={[styles.button, styles.clearButton]}
              >
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear Dora</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained"
                onClick={() => {
                  updateTilesUsed([...hand, winningTile, ...calledTiles.flat()], true);
                  setHand(Array(13).fill(null)),
                  setCalledTiles([]),
                  setWinningTile(null);
                  setSelectedIndex(3);
                  setCallSelected(0);
                  setAkaDora(0);
                  setIppatsu(false);
                  setExtraIndex(0);
                }}
                sx={[styles.button, styles.clearButton]}
              >
                <Typography variant='h1' sx={{ fontSize: matchesMD ? "0.9rem" : undefined }}>Clear Hand</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained"
                onClick={() => {
                  setTilesUsed({});
                  setSeatWind(null),
                  setRoundWind(null),
                  setDoraIndicators([]),
                  setHand(Array(13).fill(null)),
                  setCalledTiles([]),
                  setWinningTile(null);
                  setSelectedIndex(0);
                  setCallSelected(0);
                  setAkaDora(0);
                  setIppatsu(false);
                  setExtraIndex(0);
                }}
                sx={[styles.button, styles.clearButton]}
              >
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
