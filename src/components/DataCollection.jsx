import Webcam from "react-webcam";
import { Grid, Button, Box, Divider } from '@mui/material';
import {ArrowUpward, ArrowDownward, ArrowBack, ArrowForward} from '@mui/icons-material/'
import { useState, useCallback, useRef } from "react";

const DIRECTIONS = {'up': <ArrowUpward/>, 'down':<ArrowDownward/>, 'left':<ArrowBack/>, 'right':<ArrowForward/>}

export default function DataCollection() {
    const [isCameraOn, setIsCameraOn] = useState(false)

    const webcamRef = useRef(null);
    const [imgSrcArr, setImgSrcArr] = useState([]); // e.g., [{src: 'data:image/jpeg;base64...', label: 'up'}]

    const capture = (direction)=> () => {
      const newImageSrc = webcamRef.current.getScreenshot();
      
      if (newImageSrc) {
        setImgSrcArr([...imgSrcArr, {src: newImageSrc, label: direction}]);
      }
    };

    const cameraPlaceholder =  <Box display="flex" textAlign={'center'} justifyContent="center"
      alignItems="center" sx={{ p: 2, border: '1px dashed grey', height: '200px', width: '250px', margin:'auto', backgroundColor:'#ddd' }}>
      Camera is off
    </Box>



    return <Grid container >
      {/* first row */}
  
      <Grid item xs={12} sx={{marginBottom: 2}}>
        <Box textAlign='center'>
          <Button variant="contained" onClick={() => setIsCameraOn(!isCameraOn)}> {isCameraOn?'Stop': 'Start'} Camera</Button> 
        </Box>
        {isCameraOn ? 
        <Webcam width={'100%'} height={200} ref={webcamRef} screenshotFormat="image/jpeg"/> : cameraPlaceholder}
      </Grid>


      {Object.keys(DIRECTIONS).map((directionKey) => {
        return  <OneDirection key={directionKey} disabled={!isCameraOn} directionIcon={DIRECTIONS[directionKey]} onCapture= {capture(directionKey)} dirImgSrcArr={imgSrcArr.filter(d=>d.label==directionKey)}/>
      })}
        
    </Grid>
  }


  const OneDirection = ({directionIcon, onCapture, dirImgSrcArr, disabled}) => {
    return <Grid item xs={3}>
      <Box textAlign='center'>
        <Button variant="outlined" endIcon={directionIcon} onClick={onCapture} disabled={disabled}> Add to </Button> 
      </Box>
      <Box textAlign='center' sx={{width: '100%', height: '100px'}}>
        {dirImgSrcArr.length>0 && <img width={'100%'} height={'100%'} src={dirImgSrcArr[dirImgSrcArr.length-1].src} />}
      </Box>
    </Grid>
  }