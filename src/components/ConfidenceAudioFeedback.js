import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { predictionConfidenceAtom, gameRunningAtom } from "../GlobalState";

export default function ConfidenceAudioFeedback() {
  const [confidence] = useAtom(predictionConfidenceAtom);
  const [isRunning] = useAtom(gameRunningAtom);

  // Refs for the audio tracks
  const lowRef = useRef(null);
  const mediumRef = useRef(null);
  const highRef = useRef(null);
  const currentAudioRef = useRef(null);
  const lastBucketRef = useRef(null);

  // Initialize audio objects only once
  useEffect(() => {
    lowRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
    mediumRef.current = new Audio("/audio/medium-confidence.mp3");
    highRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

    [lowRef, mediumRef, highRef].forEach(ref => {
      ref.current.loop = true;
      ref.current.volume = 0.3;
    });

    return () => {
      // Stop all on unmount
      [lowRef, mediumRef, highRef].forEach(ref => {
        ref.current.pause();
        ref.current.currentTime = 0;
      });
    };
  }, []);

  // Watch for changes in confidence or game status
  useEffect(() => {
    if (!isRunning) {
        stopCurrentAudio();
        lastBucketRef.current = null; // Reset so audio can retrigger on next game
        return;
    }

    const bucket = getConfidenceBucket(confidence);
    if (bucket !== lastBucketRef.current) {
      lastBucketRef.current = bucket;
      playAudioForBucket(bucket);
    }

  }, [confidence, isRunning]);

  function getConfidenceBucket(conf) {
    if (conf < 0.60) return "low";
    if (conf < 0.80) return "medium";
    return "high";
  }

  function stopCurrentAudio() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  }

  function playAudioForBucket(bucket) {
    stopCurrentAudio();

    let selected;
    switch (bucket) {
      case "low":
        selected = lowRef.current;
        break;
      case "medium":
        selected = mediumRef.current;
        break;
      case "high":
        selected = highRef.current;
        break;
      default:
        return;
    }

    if (selected) {
      currentAudioRef.current = selected;
      selected.play().catch(err => {
        console.error("Audio playback failed:", err);
      });
    }
  }

  return null; // No visual output
}
