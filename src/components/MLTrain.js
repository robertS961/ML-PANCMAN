import {
    Button,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    LinearProgress,
} from "@mui/material";
import React, { useEffect, useState, Suspense, useRef } from "react";
import { buildModel, processImages, predictDirection, predictDirectionWithConfidence } from "../model";
import {
    batchArrayAtom,
    trainingProgressAtom,
    lossAtom,
    modelAtom,
    truncatedMobileNetAtom,
    epochsAtom,
    batchSizeAtom,
    learningRateAtom,
    hiddenUnitsAtom,
    stopTrainingAtom,
    imgSrcArrAtom,
    gameRunningAtom,
    predictionAtom,
    predictionConfidenceAtom,
} from "../GlobalState";
import { useAtom } from "jotai";
import { data, train } from "@tensorflow/tfjs";
// import JSONWriter from "./JSONWriter";
// import JSONLoader from "./JSONLoader";


function generateSelectComponent(
    label,
    options,
    handleChange,
    currentValue,
    isDisabled = false
) {
    const id = label.toLowerCase().replace(/\s+/g, '-') + "-select";
    return (
        <>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                size="small"
                sx={{ minWidth: 120 }}
                labelId={`${id}-label`}
                id={id}
                value={currentValue}
                label={label}
                onChange={(e) => handleChange(e.target.value)}
                disabled={isDisabled}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </>
    );
}



export default function MLTrain({ webcamRef }) {
    // ---- Configurations ----
    const [learningRate, setLearningRate] = useAtom(learningRateAtom);
    const [epochs, setEpochs] = useAtom(epochsAtom);
    const [hiddenUnits, setHiddenUnits] = useAtom(hiddenUnitsAtom);
    const [isRunning] = useAtom(gameRunningAtom);
    const [, setPredictionDirection] = useAtom(predictionAtom);
    const [, setPredictionConfidence] = useAtom(predictionConfidenceAtom);

    // ---- Model Training ----
    const [model, setModel] = useAtom(modelAtom);
    const [truncatedMobileNet] = useAtom(truncatedMobileNetAtom);
    const [imgSrcArr] = useAtom(imgSrcArrAtom);

    // ---- UI Display ----
    const [lossVal, setLossVal] = useAtom(lossAtom);
    const [trainingProgress, setTrainingProgress] = useAtom(trainingProgressAtom);


    const [batchSize, setBatchSize] = useAtom(batchSizeAtom);
    const batchValueArray = [0.05, 0.1, 0.4, 1].map(r=>Math.floor(imgSrcArr.length * r));
    
    const [, setStopTraining] = useAtom(stopTrainingAtom);

    // Reference to update isRunning
    const isRunningRef = useRef(isRunning);

    // Updating reference
    useEffect(() => {
        isRunningRef.current = isRunning;
    }, [isRunning]);

    // Loop to predict direction
    async function runPredictionLoop() {
        while (isRunningRef.current) {
            const predictionResult = await predictDirectionWithConfidence(webcamRef, truncatedMobileNet, model);
            setPredictionDirection(predictionResult.direction);
            setPredictionConfidence(predictionResult.confidence);
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
    }

    // Call to run prediction loop
    useEffect(() => {
        if (isRunning && webcamRef.current != null && model != null) {
            runPredictionLoop();
        }
    }, [isRunning]);

    

    // Train the model when called
    async function trainModel() {
        setTrainingProgress(-1);
        const dataset = await processImages(imgSrcArr, truncatedMobileNet);
        const model = await buildModel(truncatedMobileNet,
            setLossVal,
            dataset,
            hiddenUnits,
            batchSize,
            epochs,
            learningRate)
        setModel(model);
    }

    const stopTrain = () => {
        setStopTraining(true);
    };

    const EmptyDatasetDisaply = (
        <Typography variant="h6" sx={{ marginTop: "10px" }}>
            Please collect some data first! 
            {/* Or <JSONLoader /> */}
        </Typography>
    );

    const ReguarlDisplay = (
        <Grid container space={2}>
            <Grid item xs={6}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        trainingProgress == -1? trainModel() : stopTrain();
                    }}
                >
                    {trainingProgress == -1 ? "Train" : lossVal? "Stop": 'Loading...'}
                </Button>
                    {typeof trainingProgress === "number" && trainingProgress >= 0 && (
                        <LinearProgress
                            variant="determinate"
                            value={trainingProgress}
                            style={{
                            width: "75%",
                            marginTop: "10px",
                            }}
                        />
                    )}
                <Typography variant="h6">
                    LOSS: {lossVal === null ? "" : lossVal} <br />
                    Dataset Size: {imgSrcArr.length} <br />
                </Typography>
                {/* <JSONWriter /> <br /> */}
            </Grid>
            <Grid item xs={6}>
                <div className="hyper-params">
                    {/* <label>Learning rate</label> */}
                    {generateSelectComponent(
                        "Learning Rate",
                        [0.003, 0.001, 0.0001, 0.00001],
                        setLearningRate,
                        learningRate
                    )}

                    {/* <label>Epochs</label> */}
                    {generateSelectComponent(
                        "Epochs",
                        [10, 100, 200, 500],
                        setEpochs,
                        epochs
                    )}

                    {/* <label>Batch size </label> */}
                    {generateSelectComponent(
                        "Batch Size",
                        batchValueArray,
                        setBatchSize,
                        batchSize,
                        false
                    )}

                    {/* <label>Hidden units</label> */}
                    {generateSelectComponent(
                        "Hidden units",
                        [10, 100, 200],
                        setHiddenUnits,
                        hiddenUnits
                    )}
                </div>
            </Grid>
        </Grid>
    );

    return (
        <Suspense fallback={<div>Loading...</div>}>
            {imgSrcArr.length === 0 ? EmptyDatasetDisaply : ReguarlDisplay}
        </Suspense>
    );
}
