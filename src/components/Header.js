import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import { Tabs, Tab } from '@mui/material';
import Container from '@mui/material/Container'
import Link from '../Link';
import Hidden from '@mui/material/Hidden';
import Drawer from '@mui/material/Drawer';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, ListItemText } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Header() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDrawer, setOpenDrawer] = useState(false);

  const styles = {
    appBar: {
      zIndex: 1302
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

  const tabs = (
    <Tabs value={value} onChange={handleChange} sx={styles.tabContainer} indicatorColor='primary' textColor='secondary'>
      <Tab disableRipple component={Link} sx={styles.tab} href='/' label='Calculator' />
      <Tab disableRipple component={Link} sx={styles.tab} href='/trainer' label='Trainer' />
    </Tabs>
  );

  const drawer = (
    <React.Fragment>
      <Drawer PaperProps={{ sx: { backgroundColor: theme.palette.primary.main } }} sx={{ zIndex: 1303 }} anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)} onOpen={() => setOpenDrawer(true)}>
        <List disablePadding>
          <ListItem component={Link} href='/' onClick={() => setOpenDrawer(false)}>
            <ListItemText disableTypography sx={{ color: theme.palette.secondary.main }}>Calculator</ListItemText>
          </ListItem>
          <ListItem component={Link} href='/trainer' onClick={() => setOpenDrawer(false)}>
            <ListItemText disableTypography sx={{ color: theme.palette.secondary.main }}>Trainer</ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <IconButton sx={{ ml: "auto", mr: "-8px" }} onClick={() => setOpenDrawer(!openDrawer)} disableRipple>
        <MenuIcon color='secondary' />
      </IconButton>
    </React.Fragment>
  );

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}