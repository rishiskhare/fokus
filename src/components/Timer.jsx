import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect, useRef } from "react";

const orange = "#FFA500";

const Timer = () => {
  const getTotalSecondsGivenMode = (mode) => {
    if (mode === "work") {
      return 60 * workMinutes;
    } else {
      return 60 * breakMinutes;
    }
  };

  const [workMinutes, setWorkMinutes] = useState(20);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(
    getTotalSecondsGivenMode(mode)
  );

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  const initTimer = () => {
    setSecondsLeft(workMinutes * 60);
  };

  const switchMode = () => {
    let nextMode = "work";
    if (modeRef.current === "work") {
      nextMode = "break";
    }
    setMode(nextMode);
    modeRef.current = nextMode;
    const seconds = getTotalSecondsGivenMode(nextMode);
    setSecondsLeft(seconds);
    secondsLeftRef.current = seconds;
  };

  useEffect(() => {
    initTimer();
    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      } else if (secondsLeftRef.current === 0) {
        switchMode();
      } else {
        secondsLeftRef.current -= 1;
        setSecondsLeft(secondsLeftRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const percentage = Math.round(
    (100 * secondsLeft) / getTotalSecondsGivenMode(mode)
  );
  const minutesText = Math.floor(secondsLeft / 60);
  let secondsText = secondsLeft % 60;
  if (secondsText < 10) {
    secondsText = "0" + secondsText;
  }

  return (
    <div>
      <CircularProgressbar
        value={percentage}
        text={minutesText + ":" + secondsText}
        styles={buildStyles({
          textColor: "#212427",
          pathColor: orange,
        })}
      />
      <div>{isPaused ? <button>Play</button> : <button>Pause</button>}</div>
    </div>
  );
};

export default Timer;
