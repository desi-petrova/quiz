import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useNavigate } from 'react-router-dom';
import { MINUTE_SECONDS } from "../../common/constant";

interface Timer {
    timeQuestionnaire: number,
}

const Timer = ({ timeQuestionnaire }: Timer) => {
    console.log(timeQuestionnaire)
  const initialRemainingTime = timeQuestionnaire * MINUTE_SECONDS;
  const navigate = useNavigate();

  const getTimeMinutes = (time: number) => Math.floor(time / MINUTE_SECONDS) || 0;
  const getTimeSeconds = (time: number) => time % MINUTE_SECONDS || 0;

  const renderTime = ( time: number) => {
    return (
      <div className="time-wrapper">
        <div className="time">{time}</div>
      </div>
    );
  };

  return (
    <CountdownCircleTimer
      isPlaying
      colors={'#fbe300'}
      size={100}
      strokeWidth={12}
      duration={initialRemainingTime}
      onComplete={(totalElapsedTime) => {
        const remainingTime = initialRemainingTime - totalElapsedTime;
        if (remainingTime <= MINUTE_SECONDS) {
          navigate('/');
        }
        return { shouldRepeat: remainingTime > 0 };
      }}
    >
      {({ remainingTime }) => {
        const minutes = getTimeMinutes(remainingTime);
        const seconds = getTimeSeconds(remainingTime);

        return (
          <div style={{ color: "#fbe300" }} className="flex">
            {renderTime( minutes)}:{renderTime( seconds)}
          </div>
        );
      }}
    </CountdownCircleTimer>
  );
};

export default Timer;