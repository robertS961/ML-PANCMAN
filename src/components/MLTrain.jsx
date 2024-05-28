import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import {
  predict,
  processImg,
  loadTruncatedMobileNet,
  buildModel,
} from "../model/model";
import { imgSrcArrAtom } from "../App";
import { useAtom } from "jotai";
import { lossAtom } from "../App";
import { ControllerDataset } from "../model/controller_dataset";

export let model;
export let truncatedMobileNet = await loadTruncatedMobileNet();

function generateSelectComponent(label, options, handleChange, currentValue) {
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
      >
        {options.map((option) => (
          <MenuItem value={option}>{option}</MenuItem>
        ))}
      </Select>
    </>
  );
}

export default function MLTrain() {
  const [learningRate, setLearningRate] = React.useState(0.0001);
  const [epochs, setEpochs] = React.useState(10);
  const [batchSize, setBatchSize] = React.useState("40%");
  const [hiddenUnits, setHiddenUnits] = React.useState(100);
  const [imgSrcArr] = useAtom(imgSrcArrAtom);
  const [lossVal, setLossVal] = useAtom(lossAtom);
  const controllerDataset = new ControllerDataset(4);

  function processAllImages() {
    imgSrcArr.map((imgData) => {
      const img = new ImageData(224, 224);
      img.src = imgData.src;
      const embedding = truncatedMobileNet.predict(processImg(img));
      let labelNum;
      switch (imgData.label) {
        case "up":
          labelNum = 0;
          break;
        case "down":
          labelNum = 1;
          break;
        case "left":
          labelNum = 2;
          break;
        case "right":
          labelNum = 3;
          break;
      }
      controllerDataset.addExample(embedding, labelNum);
    });
    trainModel();
  }

  function trainModel() {
    model = buildModel(
      truncatedMobileNet,
      setLossVal,
      controllerDataset,
      hiddenUnits,
      4,
      1,
      epochs,
      learningRate
    );
  }

  return (
    <Grid container space={2}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            processAllImages();
          }}
        >
          Train
        </Button>
        <Typography variant="h6">
          LOSS: {lossVal === null ? "" : lossVal}
        </Typography>
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
            "Batch Size (fraction of the dataset)",
            ["100%", "40%", "10%", "5%"],
            setBatchSize,
            batchSize
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
}
