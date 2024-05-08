import Copyright from "./components/Copyright";
import PacMan from "./components/PacMan";
import MLTrain from "./components/MLTrain";
import { Box, CssBaseline, AppBar, Toolbar, Typography, Container, Grid, Paper} from '@mui/material';
import DataCollection from "./components/DataCollection";
import React from "react";



export default function App() {
  return  <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <AppBar position="absolute">
    <Toolbar
      sx={{
        pl: '24px', // left padding
      }}
    >
     
      <Typography
        component="h1"
        variant="h3"
        color="inherit"
        noWrap
      >
        Control your PAC MAN via gestures in the camera! 
      </Typography>
    </Toolbar>
  </AppBar>

  <Box
    component="main"
    sx={{
      backgroundColor: (theme) => theme.palette.grey[800],
      flexGrow: 1,
      height: '100vh',
      width: '100vw',
      overflow: 'auto',
    }}
  >
    <Toolbar />
    <Container sx={{paddingTop: 3}}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={6} lg={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 3
            }}
          >
            {/* part 1 where we collect training data */}
          <DataCollection />
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 340,
            }}
          >
            <MLTrain />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={6} lg={6}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
           3
            <PacMan />
          </Paper>
        </Grid>
      </Grid>
     
      <Copyright sx={{ pt: 4 }} />
    </Container>
  </Box>
</Box>
}
