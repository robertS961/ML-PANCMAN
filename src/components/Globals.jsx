import { atom } from "jotai";
import { loadTruncatedMobileNet } from "../model/model";

// ---- Configurations ----
export const epochsAtom = atom(100); // Number of epochs
export const batchSizeAtom = atom(1); // Selected batch size
export const batchArrayAtom = atom([1]); // Possible batch sizes
export const hiddenUnitsAtom = atom(100); // Number of hidden units
export const learningRateAtom = atom(0.0001); // Learning rate
export const gameRunningAtom = atom(false); // Game state
export const predictionAtom = atom(null); // Current prediction

// ---- Model Training ----
export const modelAtom = atom(null); // Model
export const truncatedMobileNetAtom = atom(loadTruncatedMobileNet()); // truncatedMobileNet
export const imgSrcArrAtom = atom([]); // Array of image sources

// ---- UI Display ----
export const lossAtom = atom(null); // Loss value
export const emptySetMessageAtom = atom(""); // Message to alert user of empty dataset
export const trainingProgressAtom = atom(0); // Training progress
export const dataSetSizeAtom = atom(0); // Size of dataset
export const dataFlagAtom = atom(false); // Flag to indicate if dataset is empty
export const stopTrainingAtom = atom(false); // Flag to stop training

function Globals() {
  return;
}

export default Globals;
