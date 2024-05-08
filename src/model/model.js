import * as mobileNet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';


export async function loadTruncatedModel() {
    const mobilenet = await mobileNet.load()

    // Truncate the mobilenet model
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    truncatedMobileNet = tf.model({inputs: mobilenet.inputs, outputs: layer.output});

    return truncatedMobileNet
}

async function buildModel(truncatedMobileNet,  setLoss, controllerDataset, hiddenUnits = 100, NUM_CLASSES = 4, batchSize = 0.4, epochs = 10, learningrate = 0.0001,) {
    const model = tf.sequential({
        layers: [
        // Flattens the input to a vector so we can use it in a dense layer. While
        // technically a layer, this only performs a reshape (and has no training
        // parameters).
        tf.layers.flatten(
            {inputShape: truncatedMobileNet.outputs[0].shape.slice(1)}),
        // Layer 1.
        tf.layers.dense({
            units: hiddenUnits,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
            useBias: true
        }),
        // Layer 2. The number of units of the last layer should correspond
        // to the number of classes we want to predict.
        tf.layers.dense({
            units: NUM_CLASSES,
            kernelInitializer: 'varianceScaling',
            useBias: false,
            activation: 'softmax'
        })
        ]
    });

    const optimizer = tf.train.adam(learningrate);
    model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

    model.fit(controllerDataset.xs, controllerDataset.ys, {
        batchSize,
        epochs: epochs,
        callbacks: {
          onBatchEnd: async (batch, logs) => {
            setLoss(logs.loss.toFixed(5));
          },
          onTrainEnd: async () => {
            console.log('Training has ended.');
          }
        }
      });
    
    return model
}

export async function predict(truncatedMobileNet, model, img) {
    const embeddings = truncatedMobileNet.predict(img);

    const predictions = await model.classify(embeddings);
    const predictedClass = predictions.as1D().argMax();
    const classId = (await predictedClass.data())[0];
    return classId
}

export const processImg = (img) => {
    // convert a base64 image to a tensor in tfjs
    const imageAsTensor = tf.browser.fromPixels(img)
    return tf.tidy(() => imageAsTensor.expandDims(0).toFloat().div(127).sub(1));
}