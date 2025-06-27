import React, { useState } from 'react';
import PacMan from "./components/PacMan";
import MLTrain from "./components/MLTrain";
import DataCollection from "./components/DataCollection";
import AllTrainingImages from "./components/AllTrainingImages";
import AIInfoDialog from "./components/AIInfoDialog";
import { predictionAtom, predictionConfidenceAtom } from "./GlobalState";
import ConfidenceAudioFeedback from "./components/ConfidenceAudioFeedback";
import { useAtom } from "jotai";   
import {
    Box,
    Button,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
} from "@mui/material";

export default function App() {
    const webcamRef = React.useRef(null);
    const [prediction] = useAtom(predictionAtom);
    const [predictionConfidence] = useAtom(predictionConfidenceAtom);
    // Also will add sounds based on the label prediction accuracy
   
    // Map the prediction to labels
    
    const predictionLabel = {
        0: "Right",
        1: "Up",
        2: "Left",
        3: "Down",
        '-1': "No prediction",
    }[prediction] || "No prediction";


    return (
        <Box sx={{ display: "flex" }}>
            <ConfidenceAudioFeedback />
            <CssBaseline />
            <AppBar position="absolute">
                <Toolbar
                    sx={{
                        pl: "24px",
                        pr: "24px",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography component="h1" variant="h3" color="inherit" noWrap>
                        Control PAC MAN via the camera!
                    </Typography>
                    <AIInfoDialog />
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
                                <DataCollection webcamRef={webcamRef} />
                            </Paper>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    height: 340,
                                }}
                            >
                                <MLTrain webcamRef={webcamRef} />
                            </Paper>
                        </Grid>
                        {/* Recent Deposits */}
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                                <PacMan />
                                <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
                                    Prediction: {predictionLabel}
                                </Typography>
                                <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
    
                                    Confidence: {(predictionConfidence * 100).toFixed(2)}%
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                                <AllTrainingImages />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            
        </Box>
    );
}
