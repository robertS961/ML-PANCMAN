import { Button, InputLabel, Select, MenuItem, FormControl, Grid, Typography } from "@mui/material";
import React from "react";

function generateSelectComponent(label, options, handleChange, currentValue) {
return <>
    <InputLabel id="demo-simple-select-label">{label}</InputLabel>
    <Select size="small" 
        sx={{minWidth: 120}}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentValue}
        label={label}
        onChange={e=>handleChange(e.target.value)}
    >
        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
    </Select>
  </>
}

export default function MLTrain() {
    const [learningRate, setLearningRate] = React.useState(0.0001);
    const [epochs, setEpochs] = React.useState(10);
    const [batchSize, setBatchSize] = React.useState(0.4);
    const [hiddenUnits, setHiddenUnits] = React.useState(100);
    return <Grid container space={2}>
        <Grid item xs={6}>
            <Button variant="contained" color="primary">Train</Button>
            <Typography variant="h6">LOSS:</Typography>
        </Grid>
        <Grid item xs={6}>
            <div className="hyper-params">
                {/* <label>Learning rate</label> */}
                {generateSelectComponent('Learning rate', [0.003, 0.001, 0.0001, 0.00001], setLearningRate, learningRate)}

                {/* <label>Epochs</label> */}
                {generateSelectComponent('Epochs', [10, 100, 1000], setEpochs, epochs)}

                {/* <label>Batch size</label> */}
                {generateSelectComponent('Batch size', [1, 0.4, 0.1, 0.05], setBatchSize, batchSize)}

                {/* <label>Hidden units</label> */}
                {generateSelectComponent('Hidden units', [10, 100, 200], setHiddenUnits, hiddenUnits)}
            </div>
        </Grid>
        
    </Grid>
}