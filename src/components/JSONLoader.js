import React from "react";
import {
    imgSrcArrAtom,
    dataSetSizeAtom,
    batchArrayAtom,
    batchSizeAtom,
} from "../GlobalState";
import { useAtom } from "jotai";
import { Button } from "@mui/material";

function LoadJSONButton() {

    const [imgSrcArr, setImgSrcArr] = useAtom(imgSrcArrAtom);

    const [, setBatchValueArray] = useAtom(batchArrayAtom);
    const [, setBatchSize] = useAtom(batchSizeAtom);

    const [dataSetSize, setDataSetSize] = useAtom(dataSetSizeAtom);

    const handleClick = async () => {
        const res = await fetch('../asset/image_data.json')
        const image_data = await res.json()

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
            Load Saved Dataset
        </Button>
    );
}

export default LoadJSONButton;
