import {Button} from '@mui/material'

import '../lib/PacmanCovid/styles/index.scss';
import PacmanCovid from '../lib/PacmanCovid';
import { useState } from 'react';


export default function PacMan() {
    const [isRunning, setIsRuning] = useState(false)
    const pacManProps = {
        gridSize: 17,
        animate: process.env.NODE_ENV !== 'development',
        locale: 'pt',
        onEnd: () => {
          console.log('onEnd')
        }
      };
      
    return <>
      <PacmanCovid {...pacManProps} isRunning={isRunning} setIsRuning={setIsRuning}/>
      {!isRunning && <Button variant="contained" onClick={() => setIsRuning(!isRunning)}> Start</Button> }
    </>;
}