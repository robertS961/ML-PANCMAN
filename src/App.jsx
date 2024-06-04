import Copyright from "./components/Copyright";
import PacMan from "./components/PacMan";
import MLTrain from "./components/MLTrain";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import DataCollection from "./components/DataCollection";
import React from "react";
import { atom } from "jotai";
import { loadTruncatedMobileNet } from "./model/model";
import { ControllerDataset } from "./model/controller_dataset";

// ---- Configurations ----
export const epochsAtom = atom(10); // Number of epochs
export const batchSizeAtom = atom(1); // Selected batch size
export const batchArrayAtom = atom([1]); // Possible batch sizes
export const hiddenUnitsAtom = atom(100); // Number of hidden units
export const learningRateAtom = atom(0.0001); // Learning rate

// ---- Model Training ----
export const modelAtom = atom(null); // Model
export const truncatedMobileNetAtom = atom(await loadTruncatedMobileNet()); // truncatedMobileNet
export const controllerDatasetAtom = atom(new ControllerDataset(4)); // Collection of images and labels
export const imgSrcArrAtom = atom([]); // Array of image sources

// ---- UI Display ----
export const lossAtom = atom(null); // Loss value
export const emptySetMessageAtom = atom(""); // Message to alert user of empty dataset
export const trainingProgressAtom = atom(0); // Training progress
export const dataSetSizeAtom = atom(0); // Size of dataset
export const dataFlagAtom = atom(false); // Flag to indicate if dataset is empty

export default function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pl: "24px", // left padding
          }}
        >
          <Typography component="h1" variant="h3" color="inherit" noWrap>
            Control your PAC MAN via gestures in the camera!
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[800],
          flexGrow: 1,
          height: "100vh",
          width: "100vw",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container sx={{ paddingTop: 3 }}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 3,
                }}
              >
                {/* part 1 where we collect training data */}
                <DataCollection />
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 340,
                }}
              >
                <MLTrain />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={6} lg={6}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <PacMan />
              </Paper>
            </Grid>
          </Grid>

          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}
