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

  const getCache = (key) => {
    return localStorage.getItem(key);
  }

  const setCache = (key, value) => {
    localStorage.setItem(key, value);
  }

  useEffect(() => {
    let cacheTime = getCache("start");
    let userTimeAllow = getCache("userAllow");
    console.log(cacheTime, userTimeAllow, getCache("paused"))
    if (cacheTime === null) {
      setCache("start", Date.now());
      setCache("userAllow", 20);
      setCache("paused", [false, Date.now()]);
      initTimer();
    } else {
      let pauz = getCache("paused");
      let timeElapsed;
      if (pauz[0]) {
        timeElapsed = pauz[1] - cacheTime;
      } else {
        timeElapsed = Date.now() - cacheTime;
      }
      setSecondsLeft((userTimeAllow - timeElapsed> 0) ? timeElapsed: 0);
    }
    const interval = setInterval(() => {
      if (isPausedRef.current) {
        if (getCache("paused") === null) {
          setCache("paused", [true, Date.now()]);
        }
        return;
      } else if (secondsLeftRef.current === 0 || !getCache("userAllow")) {
        return switchMode();
      } else {
        secondsLeftRef.current -= 1;
        return setSecondsLeft(secondsLeftRef.current);
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

  const shouldPauseTimer = (pause) => {
    console.log(pause);
    pause = pause === "pause";
    setIsPaused(pause);
    setCache("paused", [pause, Date.now()]);
    isPausedRef.current = pause;
    console.log(getCache("paused"))
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
