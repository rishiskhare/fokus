import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const orange = "#FFA500";

const Timer = () => {
  return (
    <div>
      <CircularProgressbar
        value={60}
        text={"60%"}
        styles={buildStyles({
          textColor: "#212427",
          pathColor: orange,
          trailColor: "rgba(255, 255, 255, 0.2)",
        })}
      />
      <button>Play</button>
    </div>
  );
};

export default Timer;
