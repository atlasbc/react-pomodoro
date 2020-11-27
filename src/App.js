import './App.css';
import React, { useState, useEffect } from 'react';
import soundfile from "./Alarm-ringtone.mp3";
import {Howl, Howler} from 'howler';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      {/* <h3>With Class</h3>
      <TimerClass/> */}
      <Timer/>
      <Sessions/>
      </header>
    </div>
  );
}

function HelloWorld(){
  return <h1>Hello world!</h1>
}

function Sessions(){
  const [sessions, setSessions] = useState(localStorage.getItem("sessions"));
  let session_prototype = {"date": [
     {"session_time": "30", 
     "start_time": "15:37", 
     "finish_time:":"16:07",
     "project_name": "none" 
    }, 
    "..."]}

  let arr = {"minutes": 5, "time": "16:07"};
  function addSession(){
    console.log("Session is added");
    localStorage.setItem("sessions", JSON.stringify(arr));
    setSessions(localStorage.getItem("sessions"));
  }
  function removeSession(){
    console.log("Session is removed");
    localStorage.removeItem("sessions");
    setSessions(localStorage.getItem("sessions"));
  }

  return(
    <div className="session-border">
      <div className="session-header">
        <h2>Sessions</h2>
      </div>
      <div className="sessions">
      test
      <br/>
      {sessions}
      <div>
      <button className="btn btn-info btn-sm" onClick={addSession}>Add</button>
      <button className="btn btn-info btn-sm" onClick={removeSession}>Remove</button>
      </div>
      </div>
    </div>
  )
}

function Timer(){
  const starter_session = localStorage.getItem("starterminutes");
  const [seconds, setSeconds] = useState(0);
  let starter = 5;
  if (starter_session){
    starter = parseInt(starter_session);
  }
  const [starterminutes, setStarterMinutes] = useState(starter);
  const [minutes, setMinutes] = useState(starterminutes);
  const [intervalID, setintervalID] = useState(null);

  const [zero, setZero] = useState(null);
  const [isOn, setOnOff] = useState(false);
  const [isCompleted, completedOnOff] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  let endString = null;
  let startString = null;

  // var alarm = new Howl({
  //   src: [{soundfile}]
  // });

  // console.log(alarm);
  // alarm.load();

  
  // function playAlarm(){
  //   alarm.play();
  //   console.log("alarm is played");
  //   setTimeout(() => {
  //     alarm.pause();
  //     alarm.load();
  //   }, 1000)
  // }

  function handleTimer(){
    // start timer
    if (isOn === false){
      setintervalID(setInterval(() => {
        setSeconds(c => c - 1);
        console.log("interval is triggered");
      }, 1000));
      setOnOff(true);
      completedOnOff(false);
      setStartTime(new Date());
    }
    // reset timer
    else{
      clearInterval(intervalID);
      console.log("Timer has stopped");
      console.log("Interval is cleaned");
      setOnOff(false);
      setSeconds(0);
      setMinutes(starterminutes);
    }    
  }

  console.log(seconds);

  if (minutes >= 1 && seconds < 0 && isOn === true){
    console.log("below 1 minute");
    setSeconds(59);
    setMinutes(m => (m-1));
  }
  else if (minutes <= 0 && seconds <= 0 && isOn === true){
    clearInterval(intervalID);
    console.log("interval is cleaned");
    console.log("Session is completed");
    setSeconds(0);
    setMinutes(starterminutes);
    setOnOff(false);
    completedOnOff(true);
    setEndTime(new Date());
  }

  if (minutes >=1 && seconds < 10){
    if (zero === null){
      setZero(0);
    }
  }
  else{
    if (zero != null){
      setZero(null);
    }
  }

  function handleSessionTime(event) {
    let input_value = parseInt(event.target.value);
    if (input_value>=1 && input_value <=60 ){
      console.log("minutes is changed");
      setMinutes(input_value);
      setStarterMinutes(input_value);
      localStorage.setItem("starterminutes", String(input_value));
      // This prevents floating numbers appearing as starter minute
      event.target.value = input_value;
    }
    else {
      alert(`You must put a number between 1 and 60 to make this work!`);
      event.target.value = starterminutes;
    }
  }

  // Format ending and starting time HH/MM by getting Date object
  function getHHMM(date){
    let hh = null;
    let mm = null;
    hh = date.getHours();
    mm = date.getMinutes();

    if (mm < 10){
      mm = "0" + mm;
    }
    if (hh < 10){
      hh = "0" + hh;
    }
    let end_str = hh + ":" + mm;
    return end_str;
  }

  if (isCompleted){
    startString = getHHMM(startTime);
    endString = getHHMM(endTime);
  }
  

  return (
    <div>
          {minutes ? 
          <h1>{isOn ? minutes :<input min="1" max="60" onBlur={handleSessionTime} defaultValue={starterminutes} />} m : {zero}{seconds} s</h1>:
          <h1>{seconds} s </h1>}
          
            <button onClick={handleTimer} className="btn btn-info btn-sm">
            {isOn ? "Reset" : "Start"}
            </button>
            {isCompleted ? <h2>You Completed a Session at {endString}!</h2>: ""}
            {/* <button onClick={playAlarm} className="btn btn-info btn-sm">
            Alarm
            </button> */}
          
    </div>
    
         )
}

class TimerClass extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      start: 5,
      intervalID: null,
      isOn: false,
      isCompleted: false
    };
    this.handleTimer = this.handleTimer.bind(this);
  }
  
  handleTimer(){
    if (this.state.isOn === false){
      let intervalID = setInterval(() => {
        this.setState({
          start: this.state.start -1
        });
        console.log("interval is triggered");
      }, 1000);
      this.setState({
        intervalID: intervalID,
        isOn: true,
        isCompleted: false
      });
    }
    else{
      clearInterval(this.state.intervalID);
      this.setState({
        isOn: false,
        start: 5
      });
    }
  }

  componentDidUpdate(){
    if (this.state.start <= 0 && this.state.isOn === true){
      clearInterval(this.state.intervalID);
      this.setState({
        isOn: false,
        start: 5,
        isCompleted: true
      });
    }
  }

  render() {

    return (
      <div>
        <h1>{this.state.start}</h1>
        <button onClick={this.handleTimer} className="btn btn-info btn-sm">
        {this.state.isOn ? "Reset" : "Start"}
        </button>
        {this.state.isCompleted ? <h2>You Completed a Session!</h2>: ""}
      </div>

    )
  }
}


export default App;
