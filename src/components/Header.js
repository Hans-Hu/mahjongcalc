import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import { Tabs, Tab } from '@mui/material';
import Container from '@mui/material/Container'
import Link from '../Link';

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

  const styles = {
    appBar: {
    },
    tabContainer: {
      ml: 'auto'
    },
    tab: {
      ...theme.typography.tab,
    }
  };

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <ElevationScroll>
        <AppBar position='sticky' sx={styles.appBar}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography variant='h1'>Riichi Mahjong Score {value === 0 ? "Calculator" : "Trainer"}</Typography>
              <Tabs value={value} onChange={handleChange} sx={styles.tabContainer} indicatorColor='primary' textColor='secondary'>
                <Tab component={Link} sx={styles.tab} href='/' label='Calculator' />
                <Tab component={Link} sx={styles.tab} href='/trainer' label='Trainer' />
              </Tabs>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  )
}