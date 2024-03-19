import { useEffect, useState, useRef } from "react";
import CountdownItem from "./components/CountdownItem/CountdownItem";
import "./App.css";

const App = () => {
  const [targetDate, setTargetDate] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e.target.elements.targetDateTime.value);
    const selectedDateTime = new Date(dateInputRef.current.value);
    const currentDateTime = new Date();
    const timeDifference = selectedDateTime.getTime() - currentDateTime.getTime();

    // 100 days in milliseconds is 8640000000
    if (timeDifference >= 8640000000) {
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
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (targetDate) {
        const currentDate = new Date();
        const timeDiff = targetDate.getTime() - currentDate.getTime();

        if (timeDiff <= 0) {
          setSuccess(true);
          clearInterval(interval);
          setTimerStarted(false);
        } else {
          setCountdown(calculateCountdown(timeDiff));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

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
    dateInputRef.current.value = '';
    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setError("");
    setSuccess(false);
  };

  const resetTimer = () => {
    setTargetDate(null);
    dateInputRef.current.value = '';
    setTimerStarted(false);
    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setError("");
    setSuccess(false);
  }

  // const handleOnChange = (e) => {
  //   setTargetDate(e.target.value);
  // };

  return (
    <div className="App">
      <div className="title-container">
        <h1 className="title">Countdown Timer</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="datetime-local"
          // value={targetDate}
          name="targetDateTime"
          // max={moment().add(99, "days").format("YYYY-MM-DDTHH:mm")}
          ref={dateInputRef}
          // onChange={handleOnChange}
        />
        <button
          type="button"
          onClick={timerStarted ? cancelTimer : handleSubmit}
        >
          {timerStarted ? "Cancel Timer" : "Start Timer"}
        </button>
        <button type="button" onClick={resetTimer}>Reset Timer</button>
      </form>

      {error && <p className="error">{error}</p>}
      
      <div className="countdown">
        <CountdownItem label="Days" value={countdown.days} />
        <CountdownItem label="Hours" value={countdown.hours} />
        <CountdownItem label="Minutes" value={countdown.minutes} />
        <CountdownItem label="Seconds" value={countdown.seconds} />
      </div>
      {success && (
        <p className="success">
          🎉 The countdown is over! What{"'"}s next on your adventure? 🎉
        </p>
      )}
    </div>
  );
};

export default App;
