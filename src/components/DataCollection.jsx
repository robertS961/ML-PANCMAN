import Webcam from "react-webcam";
import { Grid, Button, Box, Divider } from "@mui/material";
import {
  ArrowUpward,
  ArrowDownward,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material/";
import { useState, useCallback, useRef } from "react";
import { useAtom } from "jotai";
import {
  controllerDatasetAtom,
  dataFlagAtom,
  emptySetMessageAtom,
  imgSrcArrAtom,
  truncatedMobileNetAtom,
  batchSizeAtom,
  dataSetSizeAtom,
  batchArrayAtom,
} from "../App";
import { processImg } from "../model/model";
import { data } from "@tensorflow/tfjs";

const DIRECTIONS = {
  up: <ArrowUpward />,
  down: <ArrowDownward />,
  left: <ArrowBack />,
  right: <ArrowForward />,
};

export default function DataCollection() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [truncatedMobileNet] = useAtom(truncatedMobileNetAtom);
  const [controllerDataset] = useAtom(controllerDatasetAtom);
  const [dataFlag, setDataFlag] = useAtom(dataFlagAtom);
  const [empySetMessage, setEmptySetMessage] = useAtom(emptySetMessageAtom);
  const [batchValueArray, setBatchValueArray] = useAtom(batchArrayAtom);
  const [dataSetSize, setDataSetSize] = useAtom(dataSetSizeAtom);

  const webcamRef = useRef(null);
  const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);

  const capture = (direction) => () => {
    const newImageSrc = webcamRef.current.getScreenshot();

    if (newImageSrc) {
      const img = new ImageData(224, 224);
      img.src = newImageSrc.src;
      const embedding = truncatedMobileNet.predict(processImg(img));
      !dataFlag ? (setDataFlag(true), setEmptySetMessage("")) : null;

      controllerDataset.addExample(embedding, newImageSrc.label);
      setImgSrcArr([...imgSrcArr, { src: newImageSrc, label: direction }]);
      setDataSetSize(dataSetSize + 1);

      const batchPercentages = [0.05, 0.1, 0.4, 1];
      let batchValue;
      let tempBatchValueArray = [];

      batchPercentages.forEach((percentage) => {
        batchValue = Math.floor(imgSrcArr.length * percentage);
        batchValue = batchValue < 1 ? 1 : batchValue;
        if (!tempBatchValueArray.includes(batchValue)) {
          tempBatchValueArray.push(batchValue);
        }
      });
      setBatchValueArray(tempBatchValueArray);
    }
  };

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
