import Webcam from "react-webcam";
import { Grid, Button, Box, Divider } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material/";
import { useState, useRef } from "react";
import { useAtom } from "jotai";
import {
  controllerDatasetAtom,
  dataFlagAtom,
  emptySetMessageAtom,
  imgSrcArrAtom,
  truncatedMobileNetAtom,
  dataSetSizeAtom,
  batchArrayAtom,
  batchSizeAtom,
  modelAtom,
} from "../App";
import { predict, processImg } from "../model/model";

const DIRECTIONS = {
  up: <ArrowUpward />,
  down: <ArrowDownward />,
  left: <ArrowBack />,
  right: <ArrowForward />,
};

export default function DataCollection() {
  // ---- Webcam ----
  const [isCameraOn, setIsCameraOn] = useState(false);
  const webcamRef = useRef(null);

  // ---- Model Training ----
  const [truncatedMobileNet] = useAtom(truncatedMobileNetAtom);
  const [controllerDataset] = useAtom(controllerDatasetAtom);
  const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);
  const [model] = useAtom(modelAtom);

  // ---- Configurations ----
  const [, setBatchValueArray] = useAtom(batchArrayAtom);
  const [, setBatchSize] = useAtom(batchSizeAtom);

  // ---- UI Display ----
  const [dataFlag, setDataFlag] = useAtom(dataFlagAtom);
  const [, setEmptySetMessage] = useAtom(emptySetMessageAtom);
  const [dataSetSize, setDataSetSize] = useAtom(dataSetSizeAtom);

  const capture = (direction) => () => {
    // Capture image from webcam
    const newImageSrc = webcamRef.current.getScreenshot();

    // If image is not null, proceed with adding it to the dataset
    if (newImageSrc) {
      const img = new ImageData(224, 224); // Setting image size
      img.src = newImageSrc.src;
      const embedding = truncatedMobileNet.predict(processImg(img));

      // Since capture function has been called (with valid image), the dataset is not empty
      !dataFlag ? (setDataFlag(true), setEmptySetMessage("")) : null;

      // Add example to the dataset
      controllerDataset.addExample(embedding, newImageSrc.label);
      setImgSrcArr([...imgSrcArr, { src: newImageSrc, label: direction }]);
      setDataSetSize(dataSetSize + 1);

      // Dynamically calculate possible batch sizes
      const batchPercentages = [0.05, 0.1, 0.4, 1];
      let batchValue;
      let tempBatchValueArray = [];

      // Calculate batch sizes based on percentages, without duplicates
      batchPercentages.forEach((percentage) => {
        batchValue = Math.floor(imgSrcArr.length * percentage);
        batchValue = batchValue < 1 ? 1 : batchValue;
        if (!tempBatchValueArray.includes(batchValue)) {
          tempBatchValueArray.push(batchValue);
        }
      });
      setBatchValueArray(tempBatchValueArray);
      tempBatchValueArray.length > 3
        ? setBatchSize(tempBatchValueArray[2])
        : setBatchSize(tempBatchValueArray[tempBatchValueArray.length - 1]);
    }
  };

  async function predictDirection() {
    const img = new ImageData(224, 224);
    img.src = webcamRef.current.getScreenshot().src;
    const prediction = await predict(
      truncatedMobileNet,
      model,
      processImg(img)
    );
    console.log(prediction);
  }

  const cameraPlaceholder = (
    <Box
      display="flex"
      textAlign={"center"}
      justifyContent="center"
      alignItems="center"
      sx={{
        p: 2,
        border: "1px dashed grey",
        height: "200px",
        width: "250px",
        margin: "auto",
        backgroundColor: "#ddd",
      }}
    >
      Camera is off
    </Box>
  );

  return (
    <Grid container>
      {/* first row */}

      <Grid item xs={12} sx={{ marginBottom: 2 }}>
        <Box textAlign="center">
          <Button
            variant="contained"
            onClick={() => setIsCameraOn(!isCameraOn)}
          >
            {" "}
            {isCameraOn ? "Stop" : "Start"} Camera
          </Button>
          {/* Temporary prediction button for testing purposes */}
          <Button
            variant="contained"
            onClick={() => {
              predictDirection();
            }}
            sx={{ marginLeft: 0.5 }}
          >
            Predict
          </Button>
        </Box>
        {isCameraOn ? (
          <Webcam
            mirrored
            width={"100%"}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
        ) : (
          cameraPlaceholder
        )}
      </Grid>

      {Object.keys(DIRECTIONS).map((directionKey) => {
        return (
          <OneDirection
            key={directionKey}
            disabled={!isCameraOn}
            directionIcon={DIRECTIONS[directionKey]}
            onCapture={capture(directionKey)}
            dirImgSrcArr={imgSrcArr.filter((d) => d.label == directionKey)}
          />
        );
      })}
    </Grid>
  );
}

const OneDirection = ({ directionIcon, onCapture, dirImgSrcArr, disabled }) => {
  return (
    <Grid item xs={3}>
      <Box textAlign="center">
        <Button
          variant="outlined"
          endIcon={directionIcon}
          onClick={onCapture}
          disabled={disabled}
        >
          {" "}
          Add to{" "}
        </Button>
      </Box>
      <Box textAlign="center" sx={{ width: "100%", height: "100px" }}>
        {dirImgSrcArr.length > 0 && (
          <img
            width={"100%"}
            height={"100%"}
            src={dirImgSrcArr[dirImgSrcArr.length - 1].src}
            style={{ padding: "2px" }}
          />
        )}
      </Box>
    </Grid>
  );
};
