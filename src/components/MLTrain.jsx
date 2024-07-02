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
import { buildModel, processImages, predictDirection } from "../model/model";
import {
  batchArrayAtom,
  dataFlagAtom,
  dataSetSizeAtom,
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
  accuracyAtom,
} from "./Globals";
import { useAtom } from "jotai";
import JSONWriter from "./JSONWriter";
import JSONLoader from "./JSONLoader";

function generateSelectComponent(
  label,
  options,
  handleChange,
  currentValue,
  isDisabled = false
) {
  return (
    <>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        size="small"
        sx={{ minWidth: 120 }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentValue}
        label={label}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isDisabled}
      >
        {options.map((option) => (
          <MenuItem value={option}>{option}</MenuItem>
        ))}
      </Select>
    </>
  );
}

export default function MLTrain({ webcamRef }) {
  // ---- Configurations ----
  const [learningRate, setLearningRate] = useAtom(learningRateAtom);
  const [epochs, setEpochs] = useAtom(epochsAtom);
  const [batchSize, setBatchSize] = useAtom(batchSizeAtom);
  const [hiddenUnits, setHiddenUnits] = useAtom(hiddenUnitsAtom);
  const [batchValueArray] = useAtom(batchArrayAtom);
  const [isRunning] = useAtom(gameRunningAtom);
  const [, setPredictionDirection] = useAtom(predictionAtom);

  // ---- Model Training ----
  const [model, setModel] = useAtom(modelAtom);
  const [truncatedMobileNet] = useAtom(truncatedMobileNetAtom);
  const [imgSrcArr] = useAtom(imgSrcArrAtom);

  // ---- UI Display ----
  const [lossVal, setLossVal] = useAtom(lossAtom);
  const [accuracyVal, setAccuracyVal] = useAtom(accuracyAtom);
  const [dataFlag] = useAtom(dataFlagAtom);
  const [trainingProgress] = useAtom(trainingProgressAtom);
  const [dataSetSize] = useAtom(dataSetSizeAtom);
  const [buttonMsg, setButtonMsg] = useState("Train"); // Message to be displayed on training button
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
      setPredictionDirection(
        await predictDirection(webcamRef, truncatedMobileNet, model)
      );
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  // Call to run prediction loop
  useEffect(() => {
    if (isRunning && webcamRef.current != null && model != null) {
      runPredictionLoop();
    }
  }, [isRunning]);

  // Update button message (and function) based on training progress
  useEffect(() => {
    if (trainingProgress === 0) {
      setButtonMsg("Train");
    } else {
      setButtonMsg("Stop");
    }
  }, [trainingProgress]);

  // Train the model when called
  async function trainModel() {
    setModel(
      buildModel(
        truncatedMobileNet,
        setLossVal,
        setAccuracyVal,
        await processImages(imgSrcArr, truncatedMobileNet),
        hiddenUnits,
        batchSize,
        epochs,
        learningRate
      )
    );
  }

  const stopTrain = () => {
    setStopTraining(true);
  };

  const EmptyDatasetDisaply = (
    <Typography variant="h6" sx={{ marginTop: "10px" }}>
      Please collect some data first! Or <JSONLoader />
    </Typography>
  );

  const ReguarlDisplay = (
    <Grid container space={2}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          disabled={!dataFlag}
          onClick={() => {
            buttonMsg === "Train" ? trainModel() : stopTrain();
          }}
        >
          {buttonMsg}
        </Button>
        <LinearProgress
          variant="determinate"
          value={trainingProgress}
          style={{
            display: trainingProgress === 0 ? "none" : "block",
            width: "75%",
            marginTop: "10px",
          }}
        />
        <Typography variant="h6">
          LOSS: {lossVal === null ? "" : lossVal} <br />
          Accuracy: {accuracyVal === null ? "" : accuracyVal + "%"} <br />
          Dataset Size: {dataSetSize} <br />
        </Typography>
        <JSONWriter /> <br />
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
            [10, 100, 1000],
            setEpochs,
            epochs
          )}

          {/* <label>Batch size </label> */}
          {generateSelectComponent(
            "Batch Size",
            batchValueArray,
            setBatchSize,
            batchSize,
            !dataFlag
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
      {dataSetSize === 0 ? EmptyDatasetDisaply : ReguarlDisplay}
    </Suspense>
  );
}
