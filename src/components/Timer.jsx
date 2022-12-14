import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";

const orange = "#FFA500";
const blue = "#3D81EF";

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
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(
    getTotalSecondsGivenMode(mode)
  );
  const [startTime, setStartTime] = useState(Date.now());

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

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
    window.localStorage.setItem("TIMER_MODE", JSON.stringify(modeRef.current));
  };

  useEffect(() => {
    const prevIsPaused = window.localStorage.getItem("TIMER_ISPAUSED");
    const prevSecondsLeft = window.localStorage.getItem("TIMER_SECONDSLEFT");
    const prevStartTime = window.localStorage.getItem("TIMER_STARTTIME");
    const prevMode = window.localStorage.getItem("TIMER_MODE");

    if (!prevMode) {
      window.localStorage.setItem("TIMER_MODE", JSON.stringify(mode));
    } else {
      modeRef.current = JSON.parse(prevMode);
      setMode(modeRef.current);
      window.localStorage.setItem(
        "TIMER_MODE",
        JSON.stringify(modeRef.current)
      );
    }

    if (prevIsPaused) {
      isPausedRef.current = JSON.parse(prevIsPaused);
      setIsPaused(isPausedRef.current);
    }

    if (isPausedRef.current) {
      // If paused, get seconds left from local storage

      if (prevSecondsLeft) {
        secondsLeftRef.current = JSON.parse(prevSecondsLeft);
        setSecondsLeft(secondsLeftRef.current);
      }
    } else {
      // Else if active, get start time from local storage
      if (prevStartTime) {
        setStartTime(JSON.parse(prevStartTime));
        let seconds =
          secondsLeftRef.current -
          Math.floor((Date.now() - prevStartTime) / 1000);

        if (seconds >= 0) {
          secondsLeftRef.current = seconds;
          setSecondsLeft(seconds);
        } else {
          let currMode = modeRef.current;
          while (seconds < 0) {
            currMode = "break" ? "work" : "break";
            if (currMode === "break") {
              seconds += breakMinutes * 60;
            } else {
              seconds += workMinutes * 60;
            }
          }
          setMode(currMode);
          modeRef.current = currMode;
          window.localStorage.setItem(
            "TIMER_MODE",
            JSON.stringify(modeRef.current)
          );
        }
      } else {
        setStartTime(Date.now());
      }
    }

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      } else if (secondsLeftRef.current === 0) {
        return switchMode();
      } else {
        secondsLeftRef.current -= 1;
        return setSecondsLeft(secondsLeftRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "TIMER_SECONDSLEFT",
      JSON.stringify(secondsLeft)
    );
  }, [secondsLeft]);

  const percentage = Math.round(
    (100 * secondsLeft) / getTotalSecondsGivenMode(mode)
  );
  const minutesText = Math.floor(secondsLeft / 60);
  let secondsText = secondsLeft % 60;
  if (secondsText < 10) {
    secondsText = "0" + secondsText;
  }

  const shouldPauseTimer = (pause) => {
    pause = pause === "pause";
    setIsPaused(pause);
    isPausedRef.current = pause;
    window.localStorage.setItem("TIMER_ISPAUSED", JSON.stringify(pause));
    if (pause) {
      window.localStorage.removeItem("TIMER_STARTTIME");
    } else {
      window.localStorage.setItem(
        "TIMER_STARTTIME",
        JSON.stringify(Date.now())
      );
    }
  };

  return (
    <div>
      <div className="timer_circle">
        <CircularProgressbar
          value={percentage}
          text={minutesText + ":" + secondsText}
          styles={buildStyles({
            textColor: "#212427",
            pathColor: mode === "work" ? orange : blue,
          })}
        />
      </div>
      <div>
        {isPaused ? (
          <Button
            className="play_pause_btn"
            onClick={() => {
              shouldPauseTimer("play");
            }}
          >
            Play
          </Button>
        ) : (
          <Button
            className="play_pause_btn"
            onClick={() => shouldPauseTimer("pause")}
          >
            Pause
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
