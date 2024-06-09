import React from "react";
import {
  dataFlagAtom,
  emptySetMessageAtom,
  imgSrcArrAtom,
  truncatedMobileNetAtom,
  dataSetSizeAtom,
  batchArrayAtom,
  batchSizeAtom,
} from "./Globals";
import { useAtom } from "jotai";
import { Button } from "@mui/material";
import image_data from "../model/image_data.json";
import { base64ToTensor } from "../model/model";

function LoadJSON() {
  const [truncatedMobileNet] = useAtom(truncatedMobileNetAtom);
  const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);

  const [, setBatchValueArray] = useAtom(batchArrayAtom);
  const [, setBatchSize] = useAtom(batchSizeAtom);

  const [, setDataFlag] = useAtom(dataFlagAtom);
  const [, setEmptySetMessage] = useAtom(emptySetMessageAtom);
  const [dataSetSize, setDataSetSize] = useAtom(dataSetSizeAtom);

  const handleClick = async () => {
    if (image_data.data.length > 0) {
      let newImgSrcArr = [...imgSrcArr];
      let newDataSetSize = dataSetSize;
      const batchPercentages = [0.05, 0.1, 0.4, 1];
      let batchValue;
      let tempBatchValueArray = [];

      for (const image of image_data.data) {
        newImgSrcArr.push({ src: image.src, label: image.label });
        newDataSetSize += 1;
      }

      setImgSrcArr(newImgSrcArr);
      setDataSetSize(newDataSetSize);

      batchPercentages.forEach((percentage) => {
        batchValue = Math.floor(newImgSrcArr.length * percentage);
        batchValue = batchValue < 1 ? 1 : batchValue;
        if (!tempBatchValueArray.includes(batchValue)) {
          tempBatchValueArray.push(batchValue);
        }
      });
      setBatchValueArray(tempBatchValueArray);
      tempBatchValueArray.length > 3
        ? setBatchSize(tempBatchValueArray[2])
        : setBatchSize(tempBatchValueArray[tempBatchValueArray.length - 1]);

      setDataFlag(true);
      setEmptySetMessage("");
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      sx={{ mt: 1 }}
    >
      Load JSON
    </Button>
  );
}

export default LoadJSON;
