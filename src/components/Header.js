import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import { Tabs, Tab } from '@mui/material';
import Container from '@mui/material/Container'
import Link from '../Link';
import Hidden from '@mui/material/Hidden';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, ListItemText } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function Header(props) {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const [openDrawer, setOpenDrawer] = useState(false);

  const styles = {
    appBar: {
    },
    tabContainer: {
      ml: 'auto'
    },
    tab: {
      ...theme.typography.tab,
      px: "14px"
    }
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const tabs = (
    <Tabs value={value} onChange={handleChange} sx={styles.tabContainer} indicatorColor='primary' textColor='secondary'>
      <Tab disableRipple component={Link} sx={styles.tab} href='/' label='Calculator' />
      <Tab disableRipple component={Link} sx={styles.tab} href='/trainer' label='Trainer' />
    </Tabs>
  )

  useEffect(() => {
    switch (window.location.pathname) {
      case "/":
        setValue(0);
        break;
      case "/trainer":
        setValue(1);
        break;
      default:
        break;
    }
  }, [])


  const drawer = (
    <React.Fragment>
      <SwipeableDrawer PaperProps={{ sx: { backgroundColor: theme.palette.primary.main } }} anchor="right" disableBackdropTransition={!iOS} disableDiscovery={iOS} open={openDrawer} onClose={() => setOpenDrawer(false)} onOpen={() => setOpenDrawer(true)}>
        <List disablePadding>
          <ListItem component={Link} href='/' onClick={() => setOpenDrawer(false)}>
            <ListItemText disableTypography sx={{ color: theme.palette.secondary.main }}>Calculator</ListItemText>
          </ListItem>
          <ListItem component={Link} href='/trainer' onClick={() => setOpenDrawer(false)}>
            <ListItemText disableTypography sx={{ color: theme.palette.secondary.main }}>Trainer</ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton sx={{ ml: "auto" }} onClick={() => setOpenDrawer(!openDrawer)} disableRipple>
        <MenuIcon color='secondary' />
      </IconButton>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar position='sticky' sx={styles.appBar}>
          <Container maxWidth="lg">
            <Toolbar disableGutters variant="dense">
              <Typography variant='h1' sx={{ fontSize: matchesSM ? "1rem" : undefined }}>Riichi Mahjong Score {value === 0 ? "Calculator" : "Trainer"}</Typography>
              <Hidden smDown>
                {tabs}
              </Hidden>
              <Hidden smUp>
                {drawer}
              </Hidden>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  )
}