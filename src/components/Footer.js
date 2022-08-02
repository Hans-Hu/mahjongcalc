import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';

export default function Footer() {
  return (
    <footer style={{marginTop: "auto"}}>
      <Box>
        <Container maxWidth="lg">
          <Typography variant='subtitle1' align="center" sx={{mb: 1, color: "#A0A0A0"}}>
            {`Copyright © ${new Date().getFullYear()} mahjongscore.com | `}
            <MuiLink href="https://github.com/Hans-Hu/mahjongscore" target="_blank" color="inherit">GitHub</MuiLink>
          </Typography>
        </Container>
      </Box>
    </footer>
  )
}
