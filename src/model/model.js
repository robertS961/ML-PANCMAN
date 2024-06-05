import * as tf from "@tensorflow/tfjs";
import { getDefaultStore, useAtom } from "jotai";
import { trainingProgressAtom } from "../App";

export async function loadTruncatedMobileNet() {
  // const mobilenet = await mobileNet.load();

  // Truncate the mobilenet model
  // const layer = mobilenet.getLayer("conv_pw_13_relu");
  const mobilenet = await tf.loadLayersModel(
    "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json"
  );

  const layer = mobilenet.getLayer("conv_pw_13_relu");
  let truncatedMobileNet = tf.model({
    inputs: mobilenet.inputs,
    outputs: layer.output,
  });

  return truncatedMobileNet;
}

export async function buildModel(
  truncatedMobileNet,
  setLoss,
  controllerDataset,
  hiddenUnits = 100,
  batchSize = 1,
  epochs = 10,
  learningrate = 0.0001
) {
  const model = tf.sequential({
    layers: [
      // Flattens the input to a vector so we can use it in a dense layer. While
      // technically a layer, this only performs a reshape (and has no training
      // parameters).
      tf.layers.flatten({
        inputShape: truncatedMobileNet.outputs[0].shape.slice(1),
      }),
      // Layer 1.
      tf.layers.dense({
        units: hiddenUnits,
        activation: "relu",
        kernelInitializer: "varianceScaling",
        useBias: true,
      }),
      // Layer 2. The number of units of the last layer should correspond
      // to the number of classes we want to predict.
      tf.layers.dense({
        units: 4,
        kernelInitializer: "varianceScaling",
        useBias: false,
        activation: "softmax",
      }),
    ],
  });

  const optimizer = tf.train.adam(learningrate);
  model.compile({ optimizer: optimizer, loss: "categoricalCrossentropy" });
  const store = getDefaultStore();

  model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: epochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        setLoss(logs.loss.toFixed(5));
      },
      onTrainEnd: async () => {
        store.set(trainingProgressAtom, 0);
        console.log("Training has ended.");
      },
      onEpochEnd: async (epoch, logs) => {
        store.set(
          trainingProgressAtom,
          Math.floor(((epoch + 1) / epochs) * 100)
        );
      },
    },
  });

  return model;
}

export async function predict(truncatedMobileNet, model, img) {
  const embeddings = truncatedMobileNet.predict(img);
  const predictions = await model.predict(embeddings);
  const predictedClass = predictions.as1D().argMax();
  const classId = (await predictedClass.data())[0];
  return classId;
}

export async function base64ToTensor(base64) {
  return new Promise((resolve, reject) => {
    // Create an image element
    const img = new Image(224, 224);
    img.crossOrigin = "Anonymous";
    img.src = base64;

    img.onload = () => {
      // Set up canvas
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Convert the image data to a tensor
      const tensor = tf.browser.fromPixels(imageData);

      // Expand dimensions to include batch size
      const expandedTensor = tensor.expandDims(0);
      resolve(expandedTensor);
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
}
