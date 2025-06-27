import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { predictionConfidenceAtom, gameRunningAtom } from "../GlobalState";
import low_sound from "../lib/PacmanCovid/assets/sound/die.mp3"
import medium_sound from "../lib/PacmanCovid/assets/sound/eating.mp3"
import high_sound from "../lib/PacmanCovid/assets/sound/opening_song.mp3"

export default function ConfidenceAudioFeedback() {
  const [confidence] = useAtom(predictionConfidenceAtom);
  const [isRunning] = useAtom(gameRunningAtom);

  const lowRef = useRef(null);
  const mediumRef = useRef(null);
  const highRef = useRef(null);
  const currentAudioRef = useRef(null);
  const lastBucketRef = useRef(null);

  // Load audio once on mount
  useEffect(() => {
    const low_audio = new Audio(low_sound);
    const medium_audio = new Audio(medium_sound);
    const high_audio = new Audio(high_sound);

    lowRef.current = low_audio;
    mediumRef.current = medium_audio;
    highRef.current = high_audio;

    [lowRef, mediumRef, highRef].forEach(ref => {
      ref.current.loop = true;
      ref.current.volume = 0.3;
    });

    return () => {
      [lowRef, mediumRef, highRef].forEach(ref => {
        ref.current.pause();
        ref.current.currentTime = 0;
      });
    };
  }, []);

  // Handle confidence and game state changes
  useEffect(() => {
    if (!isRunning) {
      stopCurrentAudio();
      lastBucketRef.current = null;
      return;
    }

    const bucket = getConfidenceBucket(confidence);
    if (bucket !== lastBucketRef.current) {
      lastBucketRef.current = bucket;
      playAudioForBucket(bucket);
    }
  }, [confidence, isRunning]);

  function getConfidenceBucket(conf) {
    if (conf < 0.50) return "low";
    if (conf < 0.75) return "medium";
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

  return null; // No visible UI
}
