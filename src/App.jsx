import { useEffect, useState, useRef } from "react";
import CountdownItem from "./components/CountdownItem/CountdownItem";
import sound from "./assets/tune.mp3";
import "./App.css";

const App = () => {
  const [targetDate, setTargetDate] = useState(() => {
    const storedTargetDate = localStorage.getItem("targetDate");
    return storedTargetDate ? new Date(storedTargetDate) : null;
  });
  const [timerStarted, setTimerStarted] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dateInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedDateTime = new Date(dateInputRef.current.value);
    const currentDateTime = new Date();
    const timeDifference =
      selectedDateTime.getTime() - currentDateTime.getTime();

    const maxDaysValue = 1000 * 60 * 60 * 24 * 100;
    if (timeDifference >= maxDaysValue) {
      setError("Selected time is more than 100 days");
      setTargetDate(null);
    } else if (timeDifference < 0) {
      setError("Select a future date and time");
      setSuccess(false);
    } else {
      setError("");
      setTargetDate(selectedDateTime);
      setSuccess(false);
      setTimerStarted(true);
      localStorage.setItem("targetDate", selectedDateTime.toISOString());
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (targetDate) {
        const currentDate = new Date();
        const timeDiff = targetDate.getTime() - currentDate.getTime();

        if (timeDiff <= 0) {
          setSuccess(true);
          // const audio = new Audio(sound);
          // audio.play();
          clearInterval(interval);
          setTimerStarted(false);
          localStorage.removeItem("targetDate");
        } else {
          setCountdown(calculateCountdown(timeDiff));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (success && audioRef.current) {
      audioRef.current.play();
    }
  }, [success]);

  const calculateCountdown = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const cancelTimer = () => {
    setTargetDate(null);
    setTimerStarted(false);
    dateInputRef.current.value = "";
    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setError("");
    setSuccess(false);
    localStorage.removeItem("targetDate");
  };

  const resetTimer = () => {
    setTargetDate(null);
    dateInputRef.current.value = "";
    setTimerStarted(false);
    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setError("");
    setSuccess(false);
    localStorage.removeItem("targetDate");
  };

  return (
    <div className="App">
      <div className="title-container">
        <h1 className="title">Countdown Timer</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          name="targetDateTime"
          ref={dateInputRef}
        />
        <button
          type="button"
          onClick={timerStarted ? cancelTimer : handleSubmit}
        >
          {timerStarted ? "Cancel Timer" : "Start Timer"}
        </button>
        <button type="button" onClick={resetTimer}>
          Reset Timer
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="countdown">
        <CountdownItem label="Days" value={countdown.days} />
        <CountdownItem label="Hours" value={countdown.hours} />
        <CountdownItem label="Minutes" value={countdown.minutes} />
        <CountdownItem label="Seconds" value={countdown.seconds} />
      </div>
      {success && (
        <>
          <audio src={sound} ref={audioRef} />
          <p className="success">
            🎉 The countdown is over! What{"'"}s next on your adventure? 🎉
          </p>
        </>
      )}
    </div>
  );
};

export default App;
