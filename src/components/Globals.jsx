import { atom } from "jotai";
import { loadTruncatedMobileNet } from "../model/model";
import { ControllerDataset } from "../model/controller_dataset";

// ---- Configurations ----
export const epochsAtom = atom(10); // Number of epochs
export const batchSizeAtom = atom(1); // Selected batch size
export const batchArrayAtom = atom([1]); // Possible batch sizes
export const hiddenUnitsAtom = atom(100); // Number of hidden units
export const learningRateAtom = atom(0.0001); // Learning rate

// ---- Model Training ----
export const modelAtom = atom(null); // Model
export const truncatedMobileNetAtom = atom(await loadTruncatedMobileNet()); // truncatedMobileNet
export const controllerDatasetAtom = atom(new ControllerDataset(4)); // Collection of images and labels
export const imgSrcArrAtom = atom([]); // Array of image sources

// ---- UI Display ----
export const lossAtom = atom(null); // Loss value
export const emptySetMessageAtom = atom(""); // Message to alert user of empty dataset
export const trainingProgressAtom = atom(0); // Training progress
export const dataSetSizeAtom = atom(0); // Size of dataset
export const dataFlagAtom = atom(false); // Flag to indicate if dataset is empty

function Globals() {
  return;
}

export default Globals;
